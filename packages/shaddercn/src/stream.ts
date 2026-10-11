import { createSpecStreamCompiler } from "@json-render/core";
import { z } from "zod";
import { parseSpec, type Spec } from "./catalog";

const patchSchema = z.strictObject({
  op: z.enum(["add", "replace"]),
  path: z.string().regex(/^\/(root|elements\/[a-zA-Z][a-zA-Z0-9_-]{0,63})$/),
  value: z.unknown(),
});

/** Consume the same bounded SpecStream protocol from any agent or HTTP provider. */
export async function readSpecStream(
  stream: ReadableStream<Uint8Array>,
  onSpec: (spec: Spec) => void,
  signal?: AbortSignal,
): Promise<Spec> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const compiler = createSpecStreamCompiler<Partial<Spec>>();
  let buffer = "";
  let bytes = 0;
  let lines = 0;
  let latest: Spec | undefined;
  const abort = () => {
    void reader.cancel().catch(() => {});
  };
  signal?.addEventListener("abort", abort, { once: true });

  function consume(line: string) {
    if (!line.trim()) return;
    if (++lines > 500) throw new Error("Stream exceeds 500 operations.");
    patchSchema.parse(JSON.parse(line));
    const { result } = compiler.push(`${line}\n`);
    // A root patch arrives before its element. Missing references are allowed
    // while streaming, but component props, actions and cycles are not.
    latest = parseSpec({ elements: {}, ...result }, { partial: true });
    onSpec(latest);
  }

  try {
    while (true) {
      signal?.throwIfAborted();
      const { value, done } = await reader.read();
      signal?.throwIfAborted();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 256_000) throw new Error("Stream exceeds 256 KB.");
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        consume(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf("\n");
      }
    }
    consume(buffer + decoder.decode());
    if (!latest) throw new Error("The agent returned an empty stream.");
    return parseSpec(latest);
  } finally {
    signal?.removeEventListener("abort", abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export function toSpecStream(spec: Spec): string {
  const valid = parseSpec(spec);
  const patches: Array<{ op: "add"; path: string; value: unknown }> = [
    { op: "add", path: "/root", value: valid.root },
  ];
  // Parents first, regardless of how the JSON object's keys were ordered.
  const queue = [valid.root];
  for (const key of queue) {
    const element = valid.elements[key];
    patches.push({ op: "add", path: `/elements/${key}`, value: element });
    queue.push(...(element?.children ?? []));
  }
  return `${patches.map((patch) => JSON.stringify(patch)).join("\n")}\n`;
}
