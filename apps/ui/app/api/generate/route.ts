import { setTimeout } from "node:timers/promises";
import { systemPrompt } from "@shaddercn/registry/catalog";
import { toSpecStream } from "@shaddercn/registry/stream";
import { gateway, streamText } from "ai";
import { z } from "zod";
import { exampleIds, examples } from "../../../lib/generative/examples";

export const maxDuration = 60;

const requestSchema = z.discriminatedUnion("mode", [
  z.object({
    example: z.enum(exampleIds),
    mode: z.literal("demo"),
  }),
  z.object({
    mode: z.literal("live"),
    prompt: z.string().trim().min(1).max(4000),
  }),
]);

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 16_000)
    return Response.json({ error: "Request too large." }, { status: 413 });
  let input: z.infer<typeof requestSchema>;
  try {
    input = requestSchema.parse(JSON.parse(body));
  } catch {
    return Response.json(
      { error: "Choose a demo, or provide a prompt of 1–4000 characters." },
      { status: 400 },
    );
  }

  if (input.mode === "demo") {
    const lines = toSpecStream(examples[input.example].spec)
      .trimEnd()
      .split("\n");
    const encoder = new TextEncoder();
    let index = 0;
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      cancel() {
        cancelled = true;
      },
      async pull(controller) {
        try {
          await setTimeout(140, undefined, { signal: request.signal });
          if (cancelled) return;
          const line = lines[index++];
          if (line === undefined) controller.close();
          else controller.enqueue(encoder.encode(`${line}\n`));
        } catch (error) {
          if (!cancelled) controller.error(error);
        }
      },
    });
    return new Response(stream, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/x-ndjson",
      },
    });
  }

  // This unauthenticated playground must not expose a paid endpoint in production.
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      {
        error:
          "Live generation is development-only until authentication and usage limits are added.",
      },
      { status: 403 },
    );
  }
  const model = process.env.SHADDERCN_MODEL;
  if (!process.env.AI_GATEWAY_API_KEY || !model) {
    return Response.json(
      {
        error:
          "Set AI_GATEWAY_API_KEY and SHADDERCN_MODEL on the server, then restart. Demo mode needs no key.",
      },
      { status: 503 },
    );
  }
  const result = streamText({
    abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(55_000)]),
    maxOutputTokens: 6000,
    maxRetries: 0,
    model: gateway(model),
    prompt: input.prompt,
    system: systemPrompt,
  });
  return result.toTextStreamResponse({
    headers: { "Cache-Control": "no-store" },
  });
}
