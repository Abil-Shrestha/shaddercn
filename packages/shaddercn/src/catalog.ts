import { defineCatalog, type Spec } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const text = z.string().max(2000);
const tone = z.enum(["neutral", "success", "warning", "error"]);
const id = z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/);

export const formSubmissionSchema = z.strictObject({
  form: id,
  values: z.record(id, text),
});
export type FormSubmission = z.infer<typeof formSubmissionSchema>;

export const catalog = defineCatalog(schema, {
  actions: {
    notify: {
      description:
        "Display a message in the host. Does not perform a backend mutation.",
      params: z.strictObject({ message: text }),
    },
  },
  components: {
    Badge: {
      description: "Short status label, colored by semantic tone.",
      props: z.strictObject({ label: text, tone }),
    },
    Button: {
      description:
        "Host-owned action. Bind on.press to notify; no navigation or code.",
      events: ["press"],
      props: z.strictObject({
        label: text,
        variant: z.enum(["default", "outline", "secondary"]),
      }),
    },
    Card: {
      description: "Surface grouping related content. Put content in children.",
      props: z.strictObject({ description: text.nullable(), title: text }),
      slots: ["default"],
    },
    Form: {
      description:
        "Collect Input values and explicitly submit them to the host/agent. No backend mutation. Includes its own submit button. Never request credentials or sensitive data.",
      props: z.strictObject({ name: id, submitLabel: text.min(1) }),
      slots: ["default"],
    },
    Grid: {
      description:
        "Responsive grid. Collapses to one column in narrow previews.",
      props: z.strictObject({ columns: z.enum(["2", "3"]) }),
      slots: ["default"],
    },
    Heading: {
      description:
        "Section heading. Use level 2 for the page, 3 for subsections.",
      props: z.strictObject({ level: z.enum(["2", "3"]), text }),
    },
    Input: {
      description:
        "Labeled text or email field inside a Form. Values remain local until submit. Names must be unique within the form. At most 16 inputs per form.",
      props: z.strictObject({
        defaultValue: text,
        label: text.min(1),
        name: id,
        placeholder: text,
        required: z.boolean(),
        type: z.enum(["text", "email"]),
      }),
    },
    Metric: {
      description:
        "A metric card with a preformatted value and supporting detail.",
      props: z.strictObject({ detail: text, label: text, tone, value: text }),
    },
    Progress: {
      description: "Labeled progress from 0 to 100, with an accessible value.",
      props: z.strictObject({ label: text, value: z.number().min(0).max(100) }),
    },
    Stack: {
      description: "Vertical layout. Use as the page root or to group content.",
      props: z.strictObject({ gap: z.enum(["sm", "md", "lg"]) }),
      slots: ["default"],
    },
    Table: {
      description: "Read-only table. Each row must have one cell per column.",
      props: z.strictObject({
        caption: text,
        columns: z.array(text).min(1).max(8),
        rows: z.array(z.array(text).max(8)).max(50),
      }),
    },
    Text: {
      description: "Plain text, never HTML or Markdown.",
      props: z.strictObject({ muted: z.boolean(), text }),
    },
  },
});

const action = z.strictObject({
  action: z.literal("notify"),
  params: catalog.data.actions.notify.params,
});

// Derive the wire schema from the same prop definitions as the renderer.
export const specSchema = z.strictObject({
  elements: z.record(
    id,
    z.union(
      Object.entries(catalog.data.components).map(([name, component]) =>
        z.strictObject({
          children: z.array(id).max(100).optional(),
          props: component.props,
          type: z.literal(name),
          ...(name === "Button"
            ? { on: z.strictObject({ press: action }).optional() }
            : {}),
        }),
      ),
    ),
  ),
  root: id,
});

export const systemPrompt = catalog.prompt({
  customRules: [
    "Shaddercn supports literal props only. No state expressions, bindings, repeat, visibility, named slots, HTML, CSS, className, URLs or executable code. Input values are managed locally by the host Form.",
    "The ONLY supported action is notify, bound as on.press on a Button: {action:'notify',params:{message:'...'}}. Do not use built-in state actions.",
    "Output only JSONL: one add or replace operation per line. Paths must be /root or /elements/ID. Write complete elements, not partial props. No markdown fences or prose.",
    "First set /root to its element ID, then add the root element, then its descendants. Do not write /elements as a whole.",
    "IDs start with a letter and contain only letters, digits, hyphens and underscores (max 64 characters).",
    "Use a single tree: every element reachable from root, exactly one parent per child, no cycles, max 100 elements, max depth 16. Only Stack, Grid, Card and Form accept children.",
    "Form has no on binding: its built-in submit button sends {form:name,values:{inputName:value}} to the host. Do not nest forms. Form names are globally unique; input names are unique within their form (max 16 inputs). Inputs must be inside a Form. Do not request passwords, tokens, payment details or other sensitive data. Submission does not perform a backend mutation.",
    "Use concise, realistic sample data and explicitly label it as sample data. Table rows must match the column count. Never claim a notify action saved, sent or changed real data.",
  ],
});

/** Validate untrusted data before giving it to the React renderer. */
export function parseSpec(
  input: unknown,
  options: { partial?: boolean } = {},
): Spec & { root: string } {
  const spec = specSchema.parse(input) as Spec & { root: string };
  // IDs are untrusted: an absent "constructor" must not resolve off Object.prototype.
  spec.elements = Object.assign(Object.create(null), spec.elements);
  const keys = Object.keys(spec.elements);
  if (keys.length > 100)
    throw new Error("A spec can contain at most 100 elements.");

  const parents = new Set<string>();
  for (const [key, element] of Object.entries(spec.elements)) {
    if (
      element.children?.length &&
      !["Stack", "Grid", "Card", "Form"].includes(element.type)
    ) {
      throw new Error(`${key}: ${element.type} cannot contain children.`);
    }
    if (element.type === "Table") {
      const { rows, columns } = element.props as {
        rows: string[][];
        columns: string[];
      };
      if (rows.some((row) => row.length !== columns.length)) {
        throw new Error(`${key}: each table row must match the column count.`);
      }
    }
    for (const child of element.children ?? []) {
      if (parents.has(child))
        throw new Error(`${child}: an element must have only one parent.`);
      parents.add(child);
    }
  }

  const visited = new Set<string>();
  const active = new Set<string>();
  function visit(key: string, depth: number) {
    if (active.has(key)) throw new Error(`${key}: cycle detected.`);
    if (depth > 16) throw new Error("A spec can be at most 16 levels deep.");
    const element = spec.elements[key];
    if (!element) {
      if (!options.partial) throw new Error(`${key}: missing element.`);
      return;
    }
    active.add(key);
    visited.add(key);
    for (const child of element.children ?? []) visit(child, depth + 1);
    active.delete(key);
  }
  visit(spec.root, 1);
  for (const key of keys) {
    if (visited.has(key)) continue;
    if (!options.partial)
      throw new Error(`${key}: element is unreachable from root.`);
    visit(key, 1);
  }

  const forms = new Set<string>();
  function checkForms(key: string, fields?: Set<string>) {
    const element = spec.elements[key];
    if (!element) return;
    let current = fields;
    if (element.type === "Form") {
      const name = element.props.name as string;
      if (fields) throw new Error("Forms cannot be nested.");
      if (forms.has(name)) throw new Error("Form names must be unique.");
      forms.add(name);
      current = new Set();
    }
    if (element.type === "Input") {
      const name = element.props.name as string;
      if (!current) throw new Error("Inputs must be inside a Form.");
      if (current.has(name))
        throw new Error("Input names must be unique within a form.");
      current.add(name);
      if (current.size > 16)
        throw new Error("A form can contain at most 16 inputs.");
    }
    for (const child of element.children ?? []) checkForms(child, current);
  }
  // Unattached streaming nodes are checked when they join the rendered tree.
  checkForms(spec.root);
  return spec;
}

/** Validate browser-submitted values against the exact displayed form. */
export function parseFormSubmission(
  spec: Spec,
  input: unknown,
): FormSubmission {
  const submission = formSubmissionSchema.parse(input);
  const form = Object.values(spec.elements).find(
    (element) =>
      element.type === "Form" && element.props.name === submission.form,
  );
  if (!form) throw new Error("This form is not in the current interface.");
  const fields = new Map<string, Spec["elements"][string]>();
  function collect(key: string) {
    const element = spec.elements[key];
    if (!element) return;
    if (element.type === "Input")
      fields.set(element.props.name as string, element);
    for (const child of element.children ?? []) collect(child);
  }
  for (const child of form.children ?? []) collect(child);
  if (
    Object.keys(submission.values).length !== fields.size ||
    Object.keys(submission.values).some((name) => !fields.has(name))
  ) {
    throw new Error("Submitted fields must match the current form.");
  }
  for (const [name, field] of fields) {
    const value = submission.values[name];
    if (value === undefined || (field.props.required && !value.trim()))
      throw new Error(`${field.props.label}: a value is required.`);
    if (
      value &&
      field.props.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      throw new Error(`${field.props.label}: enter an email address.`);
  }
  return submission;
}

export type { Spec } from "@json-render/core";
