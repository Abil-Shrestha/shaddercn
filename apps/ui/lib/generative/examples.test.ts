/// <reference types="bun" />
import { expect, test } from "bun:test";
import { parseSpec } from "@shaddercn/registry/catalog";
import { readSpecStream } from "@shaddercn/registry/stream";
import { POST } from "../../app/api/generate/route";
import { exampleIds, examples } from "./examples";

test.each(
  exampleIds,
)("gallery example %s streams its declared interface", async (id) => {
  const response = await POST(
    new Request("http://localhost/ui/api/generate", {
      body: JSON.stringify({ example: id, mode: "demo" }),
      method: "POST",
    }),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("application/x-ndjson");
  if (!response.body) throw new Error("Expected a demo stream");
  const spec = await readSpecStream(response.body, (partial) => {
    parseSpec(partial, { partial: true });
  });
  expect(spec).toEqual(examples[id].spec);
});

test("unknown example names do not fall back to another demo", async () => {
  const response = await POST(
    new Request("http://localhost/ui/api/generate", {
      body: JSON.stringify({ example: "constructor", mode: "demo" }),
      method: "POST",
    }),
  );
  expect(response.status).toBe(400);
});
