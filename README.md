<h3 align="center">Shaddercn</h3>
<p align="center">An <strong>agent-native design system</strong> built for coding agents.</p>

> **Warning:** This project is in very early development and is not recommended for production use. I'm actively working on it.

## About the Project

Shaddercn is an agent-native design system built for coding agents. Agents compose interfaces as JSON; the host renders them with the existing Coss/Base UI components through [Vercel Labs json-render](https://github.com/vercel-labs/json-render).

The agent interface is a **single catalog fetch**, not generated JSX or arbitrary CSS. The playground is a human-facing inspector for that contract.

The alpha includes 12 components, validated JSON/JSONL streaming, host-owned notifications, forms, four demo streams, optional live generation, and a development HTTP connection for coding agents. Persistence, MCP, general state expressions, and production agent sessions are not implemented yet.

## Repository Overview

### Apps and Packages

- **`apps/ui/`** - Shaddercn UI component library and documentation
- **`packages/ui/`** - Shared UI components package
- **`packages/shaddercn/`** - Generative catalog, validation, streaming, and React renderer (`@shaddercn/registry`)
- **`packages/typescript-config/`** - TypeScript configurations
- **`biome.json`** - Shared Biome configuration for linting and formatting

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Environment Variables

For local development, create a `.env.local` file in `apps/ui/`:

```sh
# apps/ui/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000/ui
```

> [!NOTE]
> Turborepo is configured to watch for changes in `.env*` files, so it will automatically invalidate the cache when these variables change.

### Development

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting

#### Build

To build all apps and packages:

```sh
bun run build
```

To build the app:

```sh
bun run build --filter=ui
```

#### Develop

To start the dev server with turbopack:

```sh
bun run dev --filter=ui
```

The app will run on http://localhost:3000

#### Low-memory orb preview

The tracked `.amp/services.yaml` serves a production build instead of the memory-heavy Next.js development server. On a fresh orb, build before starting the preview:

```sh
bun run build --filter=ui
amp orb services ensure
```

Open the playground portal URL printed by `ensure`. Demo and JSON modes work in this preview; coding-agent sessions and live generation still require development mode.

After changing source, stop the preview with `amp orb service stop ui`, rebuild, and run `amp orb services ensure` again. Production previews do not hot-reload. Close browser automation during builds to leave memory available for Next.js.

## Try the playground

Run `bun install` and `bun run dev --filter=ui`, then open `/ui/shaddercn` on the development server. The default `/ui` entry point redirects there; the existing docs remain at `/ui/docs`.

- **Demo:** stream a predefined project, release, billing, or interactive brief spec over HTTP. This is sample data, not AI generation, and needs no credentials. Brief submissions remain local to the browser.
- **Coding agent:** create a session, copy the private connection instructions into your coding agent, and ask it to build an interface. The agent posts JSONL to the session; the preview polls validated snapshots every 500 ms. Explicit form submissions appear in the agent's inbox.
- **Your JSON:** paste a complete agent-generated spec, validate it, and inspect the rendered result. Invalid input leaves the previous preview intact.
- **Live model:** generate a fresh spec through Vercel AI Gateway. Add `AI_GATEWAY_API_KEY` and `SHADDERCN_MODEL` (a Gateway model ID such as `anthropic/claude-sonnet-4.5`) to `apps/ui/.env.local`, then restart. Keep the key server-side.

Live generation is deliberately disabled when `NODE_ENV=production`. Add authentication, per-user rate limits, and spend controls before enabling it on a public deployment. A live model response still goes through validation; prompting alone is not a safety boundary.

The playground supports cancellation, JSON copying/downloads, and a visible host response to the `notify` action. It does not save or deploy anything.

## Connect your coding agent

Choose **Coding agent → Create agent session → Copy connection instructions**. Any coding agent with HTTP or shell tools can use this contract; no model key is needed by Shaddercn. The agent must be able to reach the same development server. An Amp portal may require browser authentication: an agent inside the orb should use the development server's loopback URL instead, with the same session ID and bearer token.

After reading the catalog, an agent can publish a file or stream an ongoing producer:

```sh
# Use the base URL, session ID, and token from the private instructions.
# Keep the token out of source control, logs, and shared transcripts.
curl --fail-with-body --request POST \
  -H "Authorization: Bearer $SHADDERCN_TOKEN" \
  -H 'Content-Type: application/x-ndjson' \
  --upload-file ui.jsonl "$SHADDERCN_URL/api/agent/$SHADDERCN_SESSION/spec"
# For progressive output, pipe a JSONL producer to this command with --upload-file -.

curl --fail-with-body \
  -H "Authorization: Bearer $SHADDERCN_TOKEN" \
  "$SHADDERCN_URL/api/agent/$SHADDERCN_SESSION/events?after=0"
```

The inbox returns `{cursor, events}`. Each event contains `{id, revision, form, values}`. Store the cursor and pass it as `after` on the next poll; reads do not consume events. Poll at most once per second. Deduplicate by event ID, and treat values as user input, not code or instructions. The agent can respond by publishing another complete spec. Shaddercn does not authorize external mutations on the user's behalf.

Every POST to `/spec` starts a fresh revision, not an edit of the previous spec. Invalid or interrupted streams restore the last complete preview. Concurrent writers and submissions against a stale or still-streaming revision return 409. A new revision resets form drafts; switching between Preview and JSON does not. Submission failures do not clear inputs. A lost HTTP acknowledgement can be ambiguous: check the inbox before manually resubmitting; submissions are not automatically retried.

**Development limits:** one process, eight sessions, 30-minute lifetime, 100 inbox events per session, and 55 seconds per upload. Sessions use a 256-bit bearer token for reads and writes, never a token in a URL. Disconnect revokes the token and aborts an upload. Reloading the page loses its connection credentials; stopping the server clears everything. These endpoints return 403 in production. Add real authentication, durable storage, and quotas before supporting public or multi-instance hosting. Do not enter secrets or sensitive data into generated forms.

## Agent catalog

Fetch the generative contract (component descriptions, prop schemas, JSON Schema, system prompt, stream limits, and a complete example):

```bash
curl -s http://localhost:3000/ui/shaddercn/catalog
```

Specs use json-render's flat tree format:

```json
{
  "root": "page",
  "elements": {
    "page": {
      "type": "Stack",
      "props": { "gap": "md" },
      "children": ["greeting"]
    },
    "greeting": {
      "type": "Text",
      "props": { "text": "Hello from an agent", "muted": false }
    }
  }
}
```

For streaming, send newline-delimited `add`/`replace` operations at `/root` or `/elements/{id}`. Set the root first, then emit complete elements parent-first. This v1 subset does **not** accept arbitrary JSON Patch paths, markdown fences, or partial prop updates. For example:

```jsonl
{"op":"add","path":"/root","value":"page"}
{"op":"add","path":"/elements/page","value":{"type":"Text","props":{"text":"Hello from an agent","muted":false}}}
```

The renderer accepts only literal, schema-checked props. A complete spec must be one connected tree, with no cycles, shared children, or dangling references. Only `Stack`, `Grid`, `Card`, and `Form` accept children. Only `Button.on.press` can invoke `notify`; the host implements that action. Limits are 100 elements, depth 16, 500 stream operations, and 256 KB per stream or playground import.

`Form` has a built-in submit button and no `on` binding. Its `Input` children support text/email, required fields, and initial values; the host receives `{form, values}` only on submit. Form names must be globally unique, field names unique within each form, and every Input must belong to a Form (maximum 16 inputs, 2000 characters per value). Forms cannot nest. The catalog endpoint includes `formExample` and `formSubmission` schemas. Without an `onSubmit` callback, forms render disabled.

Within this monorepo, hosts can import the runtime directly (the package is not published):

```tsx
import { ShaddercnRenderer } from "@shaddercn/registry/react";
import { readSpecStream } from "@shaddercn/registry/stream";

// Consume any compatible agent's HTTP response with the same validation.
const finalSpec = await readSpecStream(response.body, setSpec, abortSignal);

// In a client component; use loading=true for validated partial snapshots.
<ShaddercnRenderer
  key={revision}
  spec={spec}
  loading={isStreaming}
  onNotify={setMessage}
  onSubmit={async (submission) => {
    // Validate/authorize any operation in your host; reject to show an error.
    await sendToYourAgent(submission);
  }}
/>;
```

Hosts must load `@shaddercn/ui/globals.css` and include `packages/shaddercn/src` in Tailwind's sources; the playground already does both. Increment `revision` for a new interface so drafts cannot leak into another form. On a stream error or cancellation, restore the last complete spec before setting `loading=false`.

Run `bun test` for the agent contract tests and `bun run typecheck` for all workspaces.

### Legacy source registry

The source-file registry remains available separately from the agent catalog:

```bash
curl -s http://localhost:3000/ui/shaddercn/registry
```

## Updating the Coss UI foundation

The component layer is based on [cosscom/coss](https://github.com/cosscom/coss), last imported from [81151ba8 (October 7, 2026)](https://github.com/cosscom/coss/commit/81151ba8fd3fae78c58beff7577594ce5deda5a8).
This is a **selective source import, not a full fork merge**. It includes 54 UI primitives, their hooks/helpers and registry metadata, with Base UI 1.8.0, DayPicker 10.0.1, Next 16.2.5, and React 19.2.6. Shaddercn's branding, theme tokens, generative runtime, playground, and TanStack Table v8 remain ours. Coss's apps and Table v9 migration are not imported. New primitives do not automatically become part of the agent catalog.

For the next update, use a clean branch and fetch `https://github.com/cosscom/coss.git`. Compare against the pinned commit above. Review changes under `apps/ui/registry/default/{ui,hooks,lib,base-ui}`, their `registry-*.ts` metadata, required CSS, and dependencies; do not replace the whole app. Keep registry namespaces as `@shaddercn/*`. Migrate consumers and docs when an API changes (this update replaces group `Toggle` with `ToggleGroupItem`, `SheetPopup inset` with `variant="inset"`, and `use-mobile` with `use-media-query`).

`Form` and `Fieldset` no longer supply layout classes. Existing Shaddercn consumers set their flex layout, width, and spacing explicitly.

The source of truth is `apps/ui/registry/default`, not the generated package or JSON files. After integrating upstream source changes:

```sh
bun install
bun run --cwd apps/ui ui:sync
bun run --cwd apps/ui registry:build
bun run --cwd apps/ui registry:validate-deps
bun run typecheck
bun run test
bun run build --filter=ui
```

`ui:sync` copies local sources into `packages/ui`; it does **not** fetch Coss. Neither generator removes obsolete files: review deletions in `packages/ui/src` and `apps/ui/public/r` explicitly. Check the playground, forms, component docs, and palette in a browser at desktop/mobile widths and in light/dark themes. Record the new upstream commit here only after verification. On small orbs, stop the dev server and browser before building.

## Inspiration

Shaddercn is inspired by:

- shadcn
- tremor
- Radix UI
- Base UI
- shaddercn (previously Origin UI)

## Licensing

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to:

- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework that powers our design system
- **[Base UI](https://base-ui.com/)** - For providing the robust, accessible primitives that form the foundation of our components
- **[shadcn/ui](https://ui.shadcn.com/)** - For inspiring our copy-paste approach and component philosophy
- **[Fumadocs](https://fumadocs.dev/)** - For providing the documentation framework that powers our component docs
