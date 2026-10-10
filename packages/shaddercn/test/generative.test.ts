import { describe, expect, test } from "bun:test";
import { parseFormSubmission, parseSpec, type Spec } from "../src/catalog";
import { readSpecStream, toSpecStream } from "../src/stream";

const spec: Spec = {
  // Deliberately not parent-first: object ordering must not control the stream.
  elements: {
    action: {
      on: { press: { action: "notify", params: { message: "Received." } } },
      props: { label: "Acknowledge", variant: "outline" },
      type: "Button",
    },
    greeting: { props: { muted: false, text: "Hello, 世界 👋" }, type: "Text" },
    page: {
      children: ["greeting", "action"],
      props: { gap: "lg" },
      type: "Stack",
    },
  },
  root: "page",
};

function source(text: string, chunkSize = 7) {
  const bytes = new TextEncoder().encode(text);
  let offset = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset >= bytes.length) return controller.close();
      controller.enqueue(bytes.slice(offset, offset + chunkSize));
      offset += chunkSize;
    },
  });
}

describe("agent UI contract", () => {
  test("round-trips byte-split Unicode with immutable, parent-first partial previews", async () => {
    const snapshots: Spec[] = [];
    const result = await readSpecStream(
      source(toSpecStream(spec).trimEnd(), 1),
      (next) => snapshots.push(next),
    );
    expect(result).toEqual(spec);
    expect(snapshots.map((next) => Object.keys(next.elements).length)).toEqual([
      0, 1, 2, 3,
    ]);
    expect(snapshots[1]?.elements.page?.children).toEqual([
      "greeting",
      "action",
    ]);
    expect(snapshots[1]?.elements.greeting).toBeUndefined();
    expect(snapshots[2]?.elements.greeting?.props.text).toBe("Hello, 世界 👋");
  });

  test("whole-element replacements update the final spec", async () => {
    const replacement = {
      props: { muted: true, text: "Changed" },
      type: "Text",
    };
    const wire =
      toSpecStream(spec) +
      JSON.stringify({
        op: "replace",
        path: "/elements/greeting",
        value: replacement,
      });
    const result = await readSpecStream(source(wire), () => {});
    expect(result.elements.greeting).toEqual(replacement);
    expect(result.elements.action).toEqual(spec.elements.action);
  });

  test("never publishes an invalid streamed element to the renderer", async () => {
    const snapshots: Spec[] = [];
    const wire = `${toSpecStream(spec)}${JSON.stringify({
      op: "replace",
      path: "/elements/greeting",
      value: { props: { code: "alert(1)" }, type: "Script" },
    })}\n`;
    await expect(
      readSpecStream(source(wire), (next) => snapshots.push(next)),
    ).rejects.toThrow();
    expect(snapshots.at(-1)).toEqual(spec);
    expect(
      snapshots.every((next) =>
        Object.values(next.elements).every(
          (element) => element.type !== "Script",
        ),
      ),
    ).toBe(true);
  });

  test.each([
    { props: { code: "alert(1)" }, type: "Script" },
    { props: { className: "hidden", muted: false, text: "Hi" }, type: "Text" },
    { props: { muted: false, text: { $state: "/secret" } }, type: "Text" },
    {
      props: { muted: false, text: "Hi" },
      repeat: { statePath: "/rows" },
      type: "Text",
    },
    {
      on: {
        press: { action: "navigate", params: { url: "javascript:alert(1)" } },
      },
      props: { label: "Go", variant: "default" },
      type: "Button",
    },
    {
      on: {
        press: {
          action: "notify",
          onSuccess: { set: { x: 1 } },
          params: { message: "Hi" },
        },
      },
      props: { label: "Go", variant: "default" },
      type: "Button",
    },
    { props: { label: "Invalid", value: 101 }, type: "Progress" },
  ])("rejects content outside the catalog: %j", (element) => {
    expect(() =>
      parseSpec({ elements: { page: element }, root: "page" }),
    ).toThrow();
  });

  test("only missing references and unattached nodes are tolerated during streaming", () => {
    const partial = {
      elements: {
        page: { children: ["later"], props: { gap: "md" }, type: "Stack" },
      },
      root: "page",
    };
    expect(
      parseSpec(partial, { partial: true }).elements.page?.children,
    ).toEqual(["later"]);
    expect(() => parseSpec(partial)).toThrow("missing element");
    expect(() => parseSpec({ elements: {}, root: "constructor" })).toThrow(
      "missing element",
    );
    expect(() => parseSpec({ ...spec, root: "greeting" })).toThrow(
      "unreachable",
    );
    const cycle = {
      elements: {
        other: { children: ["page"], props: { gap: "md" }, type: "Stack" },
        page: { children: ["other"], props: { gap: "md" }, type: "Stack" },
      },
      root: "page",
    };
    expect(() => parseSpec(cycle, { partial: true })).toThrow("cycle");
    expect(() =>
      parseSpec({
        elements: {
          child: spec.elements.greeting,
          page: {
            children: ["child", "child"],
            props: { gap: "md" },
            type: "Stack",
          },
        },
        root: "page",
      }),
    ).toThrow("one parent");
  });

  test("enforces container, table, and depth constraints", () => {
    expect(() =>
      parseSpec({
        elements: {
          child: spec.elements.greeting,
          page: { ...spec.elements.greeting, children: ["child"] },
        },
        root: "page",
      }),
    ).toThrow("cannot contain children");
    expect(() =>
      parseSpec({
        elements: {
          page: {
            props: {
              caption: "Data",
              columns: ["A", "B"],
              rows: [["only one"]],
            },
            type: "Table",
          },
        },
        root: "page",
      }),
    ).toThrow("column count");
    const tree: Spec = { elements: {}, root: "n0" };
    for (let n = 0; n < 16; n++)
      tree.elements[`n${n}`] = {
        children: n < 15 ? [`n${n + 1}`] : [],
        props: { gap: "sm" },
        type: "Stack",
      };
    expect(parseSpec(tree).root).toBe("n0");
    tree.elements.n15 = {
      children: ["n16"],
      props: { gap: "sm" },
      type: "Stack",
    };
    tree.elements.n16 = { props: { gap: "sm" }, type: "Stack" };
    expect(() => parseSpec(tree)).toThrow("16 levels");
  });

  test("rejects malformed, unsupported, empty, truncated and oversized streams", async () => {
    const root = '{"op":"add","path":"/root","value":"page"}\n';
    for (const wire of [
      "",
      root,
      `${root}not JSON`,
      `${root}{"op":"add","path":"/elements/page/props","value":{}}`,
      " ".repeat(256_001),
    ]) {
      await expect(
        readSpecStream(source(wire, 100_000), () => {}),
      ).rejects.toThrow();
    }
    const truncated = toSpecStream(spec)
      .trimEnd()
      .split("\n")
      .slice(0, -1)
      .join("\n");
    await expect(readSpecStream(source(truncated), () => {})).rejects.toThrow(
      "missing element",
    );
  });

  test("aborting a waiting stream rejects instead of completing a partial spec", async () => {
    const controller = new AbortController();
    const stream = new ReadableStream<Uint8Array>();
    const pending = readSpecStream(stream, () => {}, controller.signal);
    controller.abort();
    await expect(pending).rejects.toThrow();
    expect(stream.locked).toBe(false);
  });

  test("forms round-trip and accept only their declared fields and valid values", async () => {
    const form: Spec = {
      elements: {
        email: {
          props: {
            defaultValue: "",
            label: "Email",
            name: "email",
            placeholder: "",
            required: false,
            type: "email",
          },
          type: "Input",
        },
        form: {
          children: ["title", "email"],
          props: { name: "brief", submitLabel: "Send" },
          type: "Form",
        },
        title: {
          props: {
            defaultValue: "",
            label: "Title",
            name: "title",
            placeholder: "",
            required: true,
            type: "text",
          },
          type: "Input",
        },
      },
      root: "form",
    };
    const complete = await readSpecStream(
      source(toSpecStream(form), 1),
      () => {},
    );
    expect(complete).toEqual(form);
    const submission = {
      form: "brief",
      values: { email: "", title: "Build 世界" },
    };
    expect(parseFormSubmission(complete, submission)).toEqual(submission);
    for (const invalid of [
      { form: "other", values: submission.values },
      { form: "brief", values: { title: "missing email" } },
      {
        form: "brief",
        values: { email: "", extra: "unapproved", title: "Hi" },
      },
      { form: "brief", values: { email: "hello@example.com", title: "  " } },
      { form: "brief", values: { email: "invalid", title: "Hi" } },
    ])
      expect(() => parseFormSubmission(complete, invalid)).toThrow();

    expect(() =>
      parseSpec({
        ...form,
        elements: { title: form.elements.title },
        root: "title",
      }),
    ).toThrow("inside a Form");
    const duplicate = structuredClone(form);
    duplicate.elements.email.props.name = "title";
    expect(() => parseSpec(duplicate)).toThrow("unique");
    const nested = structuredClone(form);
    nested.elements.title = {
      children: [],
      props: { name: "nested", submitLabel: "Send" },
      type: "Form",
    };
    expect(() => parseSpec(nested)).toThrow("nested");
  });
});
