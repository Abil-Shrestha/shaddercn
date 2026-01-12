import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type RegistryFile = {
  path: string;
  content: string;
};

async function readFilesRecursive(dir: string): Promise<RegistryFile[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: RegistryFile[] = [];

  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await readFilesRecursive(abs)));
      continue;
    }

    // Keep it intentionally simple: only ship TS/TSX sources for now.
    if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;

    const content = await fs.readFile(abs, "utf8");
    out.push({
      content,
      path: path.relative(process.cwd(), abs),
    });
  }

  return out;
}

export async function GET() {
  const root = process.cwd();
  const shaddercnRoot = path.join(root, "shaddercn");

  const files = await readFilesRecursive(shaddercnRoot);

  return NextResponse.json(
    {
      files,
      kind: "agent-registry",
      name: "shaddercn",
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        // Designed for local dev / agent fetches.
        "Cache-Control": "no-store",
      },
    },
  );
}
