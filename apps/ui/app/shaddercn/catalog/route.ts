import {
  catalog,
  formSubmissionSchema,
  specSchema,
  systemPrompt,
} from "@shaddercn/registry/catalog";
import { z } from "zod";
import { examples } from "@/lib/generative/examples";

export function GET() {
  return Response.json({
    actions: {
      notify: {
        description: catalog.data.actions.notify.description,
        params: z.toJSONSchema(catalog.data.actions.notify.params),
      },
    },
    components: Object.fromEntries(
      Object.entries(catalog.data.components).map(([name, definition]) => [
        name,
        {
          description: definition.description,
          props: z.toJSONSchema(definition.props),
          slots: "slots" in definition ? definition.slots : [],
        },
      ]),
    ),
    example: examples.project.spec,
    formExample: examples.brief.spec,
    formSubmission: z.toJSONSchema(formSubmissionSchema),
    kind: "generative-ui-catalog",
    name: "shaddercn",
    protocol: {
      constraints:
        "Literal props only. One connected tree. No cycles or shared children. Only Stack, Grid, Card and Form accept children. Table row widths must match columns. Only Button.on.press may bind notify. Form submits through the host, with no on binding. Inputs must be inside a Form. Form names are globally unique, field names unique per form (max 16). No nested forms.",
      format: "SpecStream JSONL",
      limits: { bytes: 256_000, depth: 16, elements: 100, operations: 500 },
      operations: ["add", "replace"],
      paths: ["/root", "/elements/{id}"],
    },
    specSchema: z.toJSONSchema(specSchema),
    systemPrompt,
    version: "0.2.0",
  });
}
