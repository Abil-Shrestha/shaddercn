/// <reference types="bun" />
import { afterEach, expect, setSystemTime, test } from "bun:test";
import { toSpecStream } from "@shaddercn/registry/stream";
import { examples } from "./examples";
import { handleSessionRequest, type SessionConnection } from "./sessions";

const connections: SessionConnection[] = [];
async function create() {
  const response = await handleSessionRequest(
    new Request("http://test/api/agent", {
      headers: { "X-Shaddercn-Client": "playground" },
      method: "POST",
    }),
  );
  expect(response.status).toBe(201);
  const connection: SessionConnection = await response.json();
  connections.push(connection);
  return connection;
}

function request(
  connection: SessionConnection,
  method = "GET",
  operation = "",
  body?: BodyInit,
) {
  const path = [
    connection.id,
    ...operation.replace(/\?.*/, "").split("/").filter(Boolean),
  ];
  return handleSessionRequest(
    new Request(`http://test/api/agent/${connection.id}/${operation}`, {
      body,
      headers: { Authorization: `Bearer ${connection.token}` },
      method,
      // Required by Node's Request when a test supplies a streaming body.
      ...(body instanceof ReadableStream ? { duplex: "half" } : {}),
    }),
    path,
  );
}

afterEach(async () => {
  setSystemTime();
  for (const connection of connections.splice(0))
    await request(connection, "DELETE");
});

const submission = {
  form: "projectBrief",
  values: { goal: "Make agents useful", projectName: "Shaddercn" },
};

test("authenticated sessions round-trip forms, preserve cursors, and reject stale revisions", async () => {
  const connection = await create();
  const other = await create();
  expect((await request({ ...connection, token: other.token })).status).toBe(
    401,
  );
  expect((await request({ ...connection, token: "é".repeat(64) })).status).toBe(
    401,
  );
  const wire = toSpecStream(examples.brief.spec);
  expect((await request(connection, "POST", "spec", wire)).status).toBe(200);
  const snapshot = await (await request(connection)).json();
  expect(snapshot.spec).toEqual(examples.brief.spec);
  expect(snapshot.revision).toBe(1);
  expect(
    (await request(connection, "GET", `?since=${snapshot.version}`)).status,
  ).toBe(204);

  expect(
    (
      await request(
        connection,
        "POST",
        "events",
        JSON.stringify({ revision: 1, submission }),
      )
    ).status,
  ).toBe(201);
  const inbox = await (
    await request(connection, "GET", "events?after=0")
  ).json();
  expect(inbox).toEqual({
    cursor: 1,
    events: [{ ...submission, id: 1, revision: 1 }],
  });
  expect(
    await (await request(connection, "GET", "events?after=0")).json(),
  ).toEqual(inbox);
  expect(
    await (await request(connection, "GET", "events?after=1")).json(),
  ).toEqual({ cursor: 1, events: [] });
  expect(await (await request(other, "GET", "events")).json()).toEqual({
    cursor: 0,
    events: [],
  });

  await request(connection, "POST", "spec", wire);
  expect(
    (
      await request(
        connection,
        "POST",
        "events",
        JSON.stringify({ revision: 1, submission }),
      )
    ).status,
  ).toBe(409);
  expect(
    (
      await request(
        connection,
        "POST",
        "events",
        JSON.stringify({
          revision: 2,
          submission: {
            ...submission,
            values: { ...submission.values, extra: "forged" },
          },
        }),
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await request(
        connection,
        "POST",
        "events",
        JSON.stringify({ revision: 2, submission }),
      )
    ).status,
  ).toBe(201);
});

test("partial updates are visible, concurrent writers fail, and an invalid stream rolls back", async () => {
  const connection = await create();
  await request(connection, "POST", "spec", toSpecStream(examples.brief.spec));
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({
    start(value) {
      controller = value;
    },
  });
  const pending = request(connection, "POST", "spec", stream);
  controller.enqueue(
    new TextEncoder().encode('{"op":"add","path":"/root","value":"page"}\n'),
  );
  await new Promise((resolve) => setTimeout(resolve, 0));
  const partial = await (await request(connection)).json();
  expect(partial.status).toBe("streaming");
  expect(partial.spec).toEqual({ elements: {}, root: "page" });
  expect(
    (
      await request(
        connection,
        "POST",
        "spec",
        toSpecStream(examples.project.spec),
      )
    ).status,
  ).toBe(409);
  expect(
    (
      await request(
        connection,
        "POST",
        "events",
        JSON.stringify({ revision: 2, submission }),
      )
    ).status,
  ).toBe(409);
  controller.enqueue(
    new TextEncoder().encode(
      '{"op":"add","path":"/elements/page","value":{"type":"Script","props":{}}}\n',
    ),
  );
  controller.close();
  expect((await pending).status).toBe(400);
  const restored = await (await request(connection)).json();
  expect(restored.status).toBe("error");
  expect(restored.spec).toEqual(examples.brief.spec);
  expect(
    (
      await request(
        connection,
        "POST",
        "spec",
        toSpecStream(examples.project.spec),
      )
    ).status,
  ).toBe(200);
});

test("disconnect aborts a writer and revokes its token; expiry rejects reads", async () => {
  const connection = await create();
  const pending = request(
    connection,
    "POST",
    "spec",
    new ReadableStream<Uint8Array>(),
  );
  expect((await request(connection, "DELETE")).status).toBe(204);
  expect((await pending).status).toBe(400);
  expect((await request(connection)).status).toBe(401);

  const expiring = await create();
  setSystemTime(expiring.expiresAt - 1);
  expect((await request(expiring)).status).toBe(200);
  setSystemTime(expiring.expiresAt);
  expect((await request(expiring)).status).toBe(401);
});

test("session creation and inbox memory are bounded", async () => {
  expect(
    (
      await handleSessionRequest(
        new Request("http://test/api/agent", { method: "POST" }),
      )
    ).status,
  ).toBe(403);
  const connection = await create();
  for (let index = 1; index < 8; index++) await create();
  expect(
    (
      await handleSessionRequest(
        new Request("http://test/api/agent", {
          headers: { "X-Shaddercn-Client": "playground" },
          method: "POST",
        }),
      )
    ).status,
  ).toBe(429);
  await request(connection, "POST", "spec", toSpecStream(examples.brief.spec));
  const body = JSON.stringify({ revision: 1, submission });
  for (let index = 0; index < 100; index++)
    expect((await request(connection, "POST", "events", body)).status).toBe(
      201,
    );
  expect((await request(connection, "POST", "events", body)).status).toBe(429);
});
