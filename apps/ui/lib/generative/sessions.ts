import { randomBytes, timingSafeEqual } from "node:crypto";
import {
  type FormSubmission,
  formSubmissionSchema,
  parseFormSubmission,
  type Spec,
} from "@shaddercn/registry/catalog";
import { readSpecStream } from "@shaddercn/registry/stream";
import { z } from "zod";

export type SessionSnapshot = {
  version: number;
  revision: number;
  spec: Spec | null;
  status: "waiting" | "streaming" | "ready" | "error";
  error: string;
};
export type SessionConnection = {
  id: string;
  token: string;
  expiresAt: number;
};
type Submission = FormSubmission & { id: number; revision: number };
type Session = SessionConnection &
  SessionSnapshot & {
    complete: Spec | null;
    events: Submission[];
    active?: AbortController;
  };

// One development server only. Keep sessions across Next hot module reloads.
const globalStore = globalThis as typeof globalThis & {
  shaddercnSessions?: Map<string, Session>;
};
globalStore.shaddercnSessions ??= new Map<string, Session>();
const sessions = globalStore.shaddercnSessions;
const ttl = 30 * 60 * 1000;
const eventSchema = z.strictObject({
  revision: z.number().int().nonnegative(),
  submission: formSubmissionSchema,
});
const headers = { "Cache-Control": "no-store" };
const json = (value: unknown, status = 200) =>
  Response.json(value, { headers, status });

function cleanup() {
  for (const session of sessions.values()) {
    if (session.expiresAt <= Date.now()) {
      session.active?.abort();
      sessions.delete(session.id);
    }
  }
}

async function readEvent(request: Request) {
  if (!request.body) throw new Error("Missing submission.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 128_000) throw new Error("Submission too large.");
      body += decoder.decode(value, { stream: true });
    }
    return eventSchema.parse(JSON.parse(body + decoder.decode()));
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function handleSessionRequest(
  request: Request,
  path: string[] = [],
) {
  if (process.env.NODE_ENV === "production")
    return json({ error: "Agent sessions are development-only." }, 403);
  cleanup();
  if (path.length === 0 && request.method === "POST") {
    // No CORS support: this non-simple header blocks cross-site session creation.
    if (request.headers.get("X-Shaddercn-Client") !== "playground")
      return json({ error: "Create sessions from the playground." }, 403);
    if (sessions.size >= 8)
      return json(
        {
          error:
            "Eight sessions are already open. Disconnect one or wait for it to expire.",
        },
        429,
      );
    const connection = {
      expiresAt: Date.now() + ttl,
      id: randomBytes(16).toString("hex"),
      token: randomBytes(32).toString("hex"),
    };
    sessions.set(connection.id, {
      ...connection,
      complete: null,
      error: "",
      events: [],
      revision: 0,
      spec: null,
      status: "waiting",
      version: 0,
    });
    return json(connection, 201);
  }
  const session = sessions.get(path[0] ?? "");
  const token =
    request.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
  if (
    !session ||
    !/^[a-f0-9]{64}$/.test(token) ||
    !timingSafeEqual(Buffer.from(token), Buffer.from(session.token))
  )
    return json(
      {
        error:
          "Session unavailable. Create a new connection if it expired or the server restarted.",
      },
      401,
    );

  const operation = path[1];
  if (path.length > 2) return json({ error: "Unknown session endpoint." }, 404);
  if (!operation && request.method === "DELETE") {
    session.active?.abort();
    sessions.delete(session.id);
    return new Response(null, { headers, status: 204 });
  }
  if (!operation && request.method === "GET") {
    const since = new URL(request.url).searchParams.get("since");
    if (since !== null && Number(since) === session.version)
      return new Response(null, { headers, status: 204 });
    const { error, revision, spec, status, version } = session;
    return json({
      error,
      revision,
      spec,
      status,
      version,
    } satisfies SessionSnapshot);
  }
  if (operation === "spec" && request.method === "POST") {
    if (session.active)
      return json(
        { error: "Another stream is already writing this session." },
        409,
      );
    if (!request.body)
      return json({ error: "Provide a SpecStream JSONL body." }, 400);
    const controller = new AbortController();
    session.active = controller;
    session.status = "streaming";
    session.error = "";
    session.spec = null;
    session.revision++;
    session.version++;
    try {
      const spec = await readSpecStream(
        request.body,
        (next) => {
          session.spec = next;
          session.version++;
        },
        AbortSignal.any([
          controller.signal,
          request.signal,
          AbortSignal.timeout(
            Math.min(55_000, Math.max(1, session.expiresAt - Date.now())),
          ),
        ]),
      );
      session.complete = spec;
      session.spec = spec;
      session.status = "ready";
      session.version++;
      return json({ revision: session.revision, status: "ready" });
    } catch (cause) {
      session.spec = session.complete;
      session.status = "error";
      session.error =
        cause instanceof Error && cause.name !== "ZodError"
          ? cause.message
          : "The stream does not match the catalog.";
      session.version++;
      return json({ error: session.error }, 400);
    } finally {
      session.active = undefined;
    }
  }
  if (operation === "events" && request.method === "GET") {
    const after = Number(new URL(request.url).searchParams.get("after") ?? 0);
    if (!Number.isSafeInteger(after) || after < 0)
      return json({ error: "after must be a nonnegative event ID." }, 400);
    return json({
      cursor: session.events.length,
      events: session.events.filter((event) => event.id > after),
    });
  }
  if (operation === "events" && request.method === "POST") {
    try {
      const { revision, submission } = await readEvent(request);
      // Check after reading: another agent can start a stream while the body arrives.
      if (
        session.active ||
        !session.complete ||
        revision !== session.revision ||
        !sessions.has(session.id) ||
        session.expiresAt <= Date.now()
      )
        return json(
          {
            error:
              "The interface changed. Review the current form before submitting.",
          },
          409,
        );
      if (session.events.length >= 100)
        return json(
          { error: "Session inbox full. Create a new session." },
          429,
        );
      const valid = parseFormSubmission(session.complete, submission);
      const event = { ...valid, id: session.events.length + 1, revision };
      session.events.push(event);
      return json({ id: event.id }, 201);
    } catch (cause) {
      return json(
        {
          error:
            cause instanceof Error && cause.name !== "ZodError"
              ? cause.message
              : "Invalid form submission.",
        },
        400,
      );
    }
  }
  return json({ error: "Unknown session endpoint or method." }, 404);
}
