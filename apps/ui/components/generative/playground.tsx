"use client";

import {
  catalog,
  type FormSubmission,
  parseSpec,
  type Spec,
} from "@shaddercn/registry/catalog";
import { ShaddercnRenderer } from "@shaddercn/registry/react";
import { readSpecStream } from "@shaddercn/registry/stream";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@shaddercn/ui/components/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@shaddercn/ui/components/alert";
import { Badge } from "@shaddercn/ui/components/badge";
import { Button } from "@shaddercn/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@shaddercn/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shaddercn/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@shaddercn/ui/components/field";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@shaddercn/ui/components/frame";
import { ScrollArea } from "@shaddercn/ui/components/scroll-area";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@shaddercn/ui/components/select";
import { Separator } from "@shaddercn/ui/components/separator";
import { Spinner } from "@shaddercn/ui/components/spinner";
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@shaddercn/ui/components/tabs";
import { Textarea } from "@shaddercn/ui/components/textarea";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Braces,
  CircleAlert,
  Code2,
  Copy,
  Layers,
  Play,
  Square,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  type ExampleId,
  exampleIds,
  examples,
} from "@/lib/generative/examples";
import { ExampleGallery, Tutorials } from "./learning";
import { useAgentSession } from "./use-agent-session";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/ui";
const initialSpec = parseSpec(examples.hello.spec);
type InputMode = "demo" | "live" | "json" | "agent";
const modes: { label: string; value: InputMode }[] = [
  { label: "Demo", value: "demo" },
  { label: "Coding agent", value: "agent" },
  { label: "Live model", value: "live" },
  { label: "Your JSON", value: "json" },
];
const demoOptions = exampleIds.map((value) => ({
  label: examples[value].label,
  value,
}));

export function Playground({
  liveEnabled,
  agentEnabled,
}: {
  liveEnabled: boolean;
  agentEnabled: boolean;
}) {
  const [section, setSection] = useState("playground");
  const [mode, setMode] = useState<InputMode>("demo");
  const [example, setExample] = useState<ExampleId>("hello");
  const [prompt, setPrompt] = useState(examples.hello.prompt);
  const [localSpec, setSpec] = useState<Spec | null>(initialSpec);
  const [input, setInput] = useState(JSON.stringify(initialSpec, null, 2));
  const [view, setView] = useState<"preview" | "json">("preview");
  const [generating, setStreaming] = useState(false);
  const [localStatus, setStatus] = useState("Example loaded");
  const [revision, setRevision] = useState(0);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const agent = useAgentSession();
  const spec = mode === "agent" ? agent.snapshot.spec : localSpec;
  const streaming =
    mode === "agent" ? agent.snapshot.status === "streaming" : generating;
  const locked = streaming || Boolean(agent.connection) || agent.busy;
  const displayError =
    error || (mode === "agent" ? agent.error || agent.snapshot.error : "");
  const status =
    mode === "agent"
      ? agent.error
        ? "Connection unavailable"
        : {
            error: "Stream rejected · previous preview restored",
            ready: "Agent interface ready",
            streaming: "Agent is streaming",
            waiting: agent.connection
              ? "Waiting for your agent"
              : "No agent connected",
          }[agent.snapshot.status]
      : localStatus;
  const active = useRef<AbortController | null>(null);
  const lastComplete = useRef(initialSpec);
  useEffect(() => () => active.current?.abort(), []);

  function complete(next: Spec) {
    lastComplete.current = next;
    setSpec(next);
    setInput(JSON.stringify(next, null, 2));
  }

  function openWorkbench() {
    setSection("playground");
    requestAnimationFrame(() => {
      const heading = document.getElementById("workbench-title");
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start" });
    });
  }

  function loadExample(id: ExampleId, edit = false) {
    if (locked) return;
    setExample(id);
    setPrompt(examples[id].prompt);
    setMode(edit ? "json" : "demo");
    complete(parseSpec(examples[id].spec));
    setRevision((value) => value + 1);
    setSubmission(null);
    setError("");
    setNotice("");
    setStatus(`${examples[id].label} loaded`);
    setView("preview");
    openWorkbench();
  }

  async function generate() {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setStreaming(true);
    setRevision((value) => value + 1);
    setSubmission(null);
    setError("");
    setNotice("");
    setSpec(null);
    setStatus("Streaming");
    try {
      const response = await fetch(`${basePath}/api/generate`, {
        body: JSON.stringify(
          mode === "demo" ? { example, mode } : { mode, prompt },
        ),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Generation failed. Please try again.");
      }
      if (!response.body) throw new Error("The server returned no stream.");
      const next = await readSpecStream(
        response.body,
        setSpec,
        controller.signal,
      );
      complete(next);
      setStatus("Stream complete");
    } catch (cause) {
      setSpec(lastComplete.current);
      if (controller.signal.aborted)
        setStatus("Stopped · previous preview restored");
      else {
        setError(
          cause instanceof Error && cause.name !== "ZodError"
            ? cause.message
            : "The output does not match the catalog. Check component names, props, and actions.",
        );
        setStatus("Failed · previous preview restored");
      }
    } finally {
      active.current = null;
      setStreaming(false);
    }
  }

  function applyJSON() {
    setError("");
    setNotice("");
    try {
      if (new TextEncoder().encode(input).length > 256_000)
        throw new Error("JSON exceeds 256 KB.");
      complete(parseSpec(JSON.parse(input)));
      setRevision((value) => value + 1);
      setSubmission(null);
      setStatus("JSON validated");
      setView("preview");
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "ZodError"
          ? cause.message
          : "Invalid spec: use only catalog components, literal props, and notify actions. The previous preview is unchanged.",
      );
    }
  }

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(message);
    } catch {
      setError(
        "Clipboard access is unavailable. Select and copy the JSON directly.",
      );
    }
  }

  function download() {
    if (!spec) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "shaddercn-spec.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container space-y-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Turn an agent’s answer into an interface.</h1>
          </CardTitle>
          <CardDescription className="max-w-3xl">
            Shaddercn lets coding agents compose dashboards, reports, and forms
            from your existing design system. Agents send JSON—not new
            components or CSS.
          </CardDescription>
        </CardHeader>
        <CardPanel>
          <ol className="grid gap-5 md:grid-cols-3">
            {[
              [
                "The agent describes it",
                "A JSON spec names the components, their content, and how they fit together.",
              ],
              [
                "The catalog checks it",
                "Only supported components and props are allowed. Invalid output is rejected.",
              ],
              [
                "Your components render it",
                "Real React components appear as the JSON arrives. Forms share answers only on submit.",
              ],
            ].map(([title, description], index) => (
              <li className="flex gap-3" key={title}>
                <Badge variant="outline">{index + 1}</Badge>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardPanel>
        <CardFooter className="flex-wrap gap-3">
          <Button disabled={locked} onClick={() => loadExample("hello")}>
            <Play /> Try your first interface
          </Button>
          <Button onClick={() => setSection("tutorials")} variant="outline">
            <BookOpen /> Follow a tutorial
          </Button>
          <CardDescription>No API key needed for examples.</CardDescription>
        </CardFooter>
      </Card>
      <Tabs
        onValueChange={(value) => setSection(String(value))}
        value={section}
      >
        <TabsList aria-label="Playground sections">
          <TabsTab value="playground">Playground</TabsTab>
          <TabsTab value="examples">
            Examples <Badge variant="secondary">{exampleIds.length}</Badge>
          </TabsTab>
          <TabsTab value="tutorials">Tutorials</TabsTab>
        </TabsList>
        <TabsPanel keepMounted value="playground">
          <Frame>
            <FrameHeader className="flex-row flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <FrameTitle>
                  <h2
                    className="scroll-mt-20 outline-none"
                    id="workbench-title"
                    tabIndex={-1}
                  >
                    Playground
                  </h2>
                </FrameTitle>
                <FrameDescription>
                  Replay a sample, edit its JSON, or connect your own agent.
                </FrameDescription>
              </div>
              <Button
                render={<Link href="/shaddercn/catalog" target="_blank" />}
                variant="outline"
              >
                <Braces /> Agent catalog <ArrowRight />
              </Button>
            </FrameHeader>
            <div className="grid items-start gap-1 lg:grid-cols-[300px_minmax(0,1fr)]">
              <FramePanel>
                <aside
                  aria-label="Generation controls"
                  className="flex flex-col gap-6"
                >
                  <Field>
                    <FieldLabel>Input mode</FieldLabel>
                    <Select<InputMode>
                      disabled={locked}
                      items={modes}
                      onValueChange={(value) => {
                        if (!value) return;
                        setMode(value);
                        setError("");
                        setNotice("");
                        setSubmission(null);
                      }}
                      value={mode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        {modes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                  </Field>

                  {mode === "demo" ? (
                    <Field>
                      <FieldLabel>Example</FieldLabel>
                      <Select<ExampleId>
                        disabled={streaming}
                        items={demoOptions}
                        onValueChange={(value) => {
                          if (!value) return;
                          loadExample(value);
                        }}
                        value={example}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectPopup>
                          {demoOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectPopup>
                      </Select>
                      <FieldDescription>
                        Prerecorded JSON, streamed over HTTP. No live AI or
                        connected data.
                      </FieldDescription>
                    </Field>
                  ) : mode === "agent" ? (
                    <div className="space-y-4">
                      <FrameDescription>
                        Your coding agent streams the interface here. Form
                        submissions go back to its session inbox. No model API
                        key required.
                      </FrameDescription>
                      {agent.connection ? (
                        <>
                          <Alert role="status">
                            <Terminal />
                            <AlertTitle>Session connected</AlertTitle>
                            <AlertDescription>
                              Expires{" "}
                              {new Date(
                                agent.connection.expiresAt,
                              ).toLocaleTimeString()}
                              . Keep this tab open.
                            </AlertDescription>
                          </Alert>
                          <Button
                            className="w-full"
                            onClick={() =>
                              copy(
                                agent.instructions(),
                                "Private session instructions copied. Paste them into your coding agent.",
                              )
                            }
                            variant="outline"
                          >
                            <Copy /> Copy connection instructions
                          </Button>
                          <FrameDescription>
                            Instructions contain a private access token. Share
                            only with your agent. Disconnect revokes it and
                            stops any active stream.
                          </FrameDescription>
                        </>
                      ) : (
                        <FrameDescription>
                          {agentEnabled
                            ? "Development-only. Sessions expire after 30 minutes and disappear when the server restarts."
                            : "Agent sessions are disabled in production. Run the development server to connect."}
                        </FrameDescription>
                      )}
                    </div>
                  ) : mode === "live" ? (
                    <Field>
                      <FieldLabel>What should the agent build?</FieldLabel>
                      <Textarea
                        className="min-h-40 resize-y"
                        disabled={streaming}
                        maxLength={4000}
                        onChange={(event) => setPrompt(event.target.value)}
                        value={prompt}
                      />
                      <FieldDescription>
                        {liveEnabled
                          ? "Uses your server's Vercel AI Gateway model. Each run starts a new spec."
                          : "Not connected. Set AI_GATEWAY_API_KEY and SHADDERCN_MODEL on the server to enable live generation in development."}
                      </FieldDescription>
                    </Field>
                  ) : (
                    <Field>
                      <FieldLabel>Paste an agent's JSON spec</FieldLabel>
                      <Textarea
                        className="h-80 resize-y font-mono text-xs"
                        onChange={(event) => setInput(event.target.value)}
                        spellCheck={false}
                        value={input}
                      />
                      <FieldDescription>
                        Validated before rendering. Unknown components and
                        unsafe actions are rejected.
                      </FieldDescription>
                    </Field>
                  )}

                  {mode === "agent" ? (
                    <Button
                      disabled={!agentEnabled || agent.busy}
                      onClick={() => {
                        setSubmission(null);
                        setNotice("");
                        setError("");
                        return agent.connection
                          ? agent.disconnect()
                          : agent.connect();
                      }}
                      variant={agent.connection ? "outline" : "default"}
                    >
                      {agent.busy ? <Spinner /> : <Terminal />}
                      {agent.connection
                        ? "Disconnect agent"
                        : "Create agent session"}
                    </Button>
                  ) : streaming ? (
                    <Button
                      onClick={() => active.current?.abort()}
                      variant="outline"
                    >
                      <Square /> Stop stream
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        mode === "live" && (!liveEnabled || !prompt.trim())
                      }
                      onClick={mode === "json" ? applyJSON : generate}
                    >
                      <Play />{" "}
                      {mode === "demo"
                        ? "Stream demo"
                        : mode === "json"
                          ? "Validate & render"
                          : "Generate interface"}
                    </Button>
                  )}

                  {(mode === "demo" || mode === "json") && (
                    <>
                      <Alert role="note">
                        <AlertTitle>
                          {mode === "demo"
                            ? "Try this example"
                            : "Editing the spec"}
                        </AlertTitle>
                        <AlertDescription>
                          {mode === "demo"
                            ? examples[example].tryThis
                            : "Change the JSON, then click Validate & render. Invalid edits leave the previous preview unchanged."}
                        </AlertDescription>
                      </Alert>
                      {mode === "demo" && (
                        <Button
                          disabled={locked}
                          onClick={() => loadExample(example, true)}
                          variant="outline"
                        >
                          <Code2 /> Edit this example’s JSON
                        </Button>
                      )}
                    </>
                  )}

                  <Separator />
                  <Accordion>
                    {mode === "demo" && (
                      <AccordionItem value="learn">
                        <AccordionTrigger>
                          What this example teaches
                        </AccordionTrigger>
                        <AccordionPanel>
                          {examples[example].learn}
                        </AccordionPanel>
                      </AccordionItem>
                    )}
                    <AccordionItem value="catalog">
                      <AccordionTrigger>
                        Connect a coding agent
                      </AccordionTrigger>
                      <AccordionPanel>
                        <div className="space-y-4">
                          <p>
                            Fetch the catalog for schemas and examples. Use
                            Coding agent for a live session, or Your JSON for a
                            one-off import.
                          </p>
                          <code className="block break-all text-xs">
                            GET {basePath}/shaddercn/catalog
                          </code>
                          <Button
                            onClick={() =>
                              copy(
                                `Fetch ${window.location.origin}${basePath}/shaddercn/catalog. Follow its specSchema and protocol constraints. Generate a complete JSON spec for the interface I describe, using only that catalog. Return JSON, no markdown.`,
                                "Agent instructions copied.",
                              )
                            }
                            size="sm"
                            variant="outline"
                          >
                            <Copy /> Copy agent instructions
                          </Button>
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </aside>
              </FramePanel>

              <FramePanel className="min-w-0">
                <section aria-label="Generated interface" className="space-y-4">
                  <Tabs
                    onValueChange={(value) =>
                      setView(value as "preview" | "json")
                    }
                    value={view}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <TabsList aria-label="Output view">
                        <TabsTab value="preview">
                          <Layers /> Preview
                        </TabsTab>
                        <TabsTab value="json">
                          <Code2 /> JSON
                        </TabsTab>
                      </TabsList>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">
                          {Object.keys(spec?.elements ?? {}).length} elements
                        </Badge>
                        <Button
                          aria-label="Copy JSON"
                          disabled={!spec || streaming}
                          onClick={() =>
                            copy(JSON.stringify(spec, null, 2), "JSON copied.")
                          }
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Copy />
                        </Button>
                        <Button
                          aria-label="Download JSON"
                          disabled={!spec || streaming}
                          onClick={download}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <ArrowDownToLine />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    {displayError && (
                      <Alert variant="error">
                        <CircleAlert />
                        <AlertTitle>Unable to render</AlertTitle>
                        <AlertDescription>{displayError}</AlertDescription>
                      </Alert>
                    )}
                    <TabsPanel keepMounted value="preview">
                      <div
                        aria-busy={streaming}
                        className="min-h-96"
                        id="generated-preview"
                      >
                        {spec ? (
                          <ShaddercnRenderer
                            key={
                              mode === "agent"
                                ? `agent-${agent.snapshot.revision}`
                                : `local-${revision}`
                            }
                            loading={streaming}
                            onNotify={setNotice}
                            onSubmit={
                              mode === "agent" &&
                              (!agent.connection || agent.error)
                                ? undefined
                                : async (next) => {
                                    if (mode === "agent")
                                      await agent.submit(next);
                                    setSubmission(next);
                                    setNotice(
                                      mode === "agent"
                                        ? "Submission queued for your agent."
                                        : "Demo submission received locally. No agent is connected.",
                                    );
                                  }
                            }
                            spec={spec}
                          />
                        ) : (
                          <Empty className="min-h-96">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                {streaming ? <Spinner /> : <Terminal />}
                              </EmptyMedia>
                              <EmptyTitle>
                                {streaming
                                  ? "Receiving interface"
                                  : agent.connection
                                    ? "Ready for your agent"
                                    : "No agent connected"}
                              </EmptyTitle>
                              <EmptyDescription>
                                {mode === "agent"
                                  ? agent.connection
                                    ? "Paste the connection instructions into your coding agent to start streaming."
                                    : "Create a session to connect your coding agent."
                                  : "Waiting for the first element…"}
                              </EmptyDescription>
                            </EmptyHeader>
                          </Empty>
                        )}
                      </div>
                    </TabsPanel>
                    <TabsPanel value="json">
                      <ScrollArea className="h-[36rem]">
                        <pre
                          aria-label="Generated JSON"
                          className="p-1 font-mono text-xs leading-relaxed"
                        >
                          <code>
                            {spec
                              ? JSON.stringify(spec, null, 2)
                              : "Waiting for the first element…"}
                          </code>
                        </pre>
                      </ScrollArea>
                    </TabsPanel>
                  </Tabs>
                  {submission && (
                    <Accordion>
                      <AccordionItem value="submission">
                        <AccordionTrigger>
                          Last submitted values ·{" "}
                          {mode === "agent"
                            ? "sent to agent inbox"
                            : "local demo only"}
                        </AccordionTrigger>
                        <AccordionPanel>
                          <pre
                            className="whitespace-pre-wrap break-words font-mono text-xs"
                            id="last-submission"
                          >
                            {JSON.stringify(submission, null, 2)}
                          </pre>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {notice && (
                    <Alert role="status" variant="success">
                      <AlertDescription>{notice}</AlertDescription>
                    </Alert>
                  )}
                  <Separator />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <FrameDescription
                      aria-live="polite"
                      className="flex items-center gap-2"
                      role="status"
                    >
                      {streaming && <Spinner className="size-4" />}
                      {status}
                    </FrameDescription>
                    <Badge variant="outline">json-render</Badge>
                  </div>
                </section>
              </FramePanel>
            </div>
            <FrameFooter className="flex-row flex-wrap items-center gap-2">
              <FrameDescription>Catalog</FrameDescription>
              {catalog.componentNames.map((name) => (
                <Badge key={name} variant="outline">
                  {name}
                </Badge>
              ))}
            </FrameFooter>
          </Frame>
        </TabsPanel>
        <TabsPanel value="examples">
          <ExampleGallery disabled={locked} onExample={loadExample} />
        </TabsPanel>
        <TabsPanel keepMounted value="tutorials">
          <Tutorials
            agentEnabled={agentEnabled}
            disabled={locked}
            onExample={loadExample}
            onMode={(next) => {
              if (locked) return;
              setMode(next);
              setError("");
              setNotice("");
              setSubmission(null);
              setView("preview");
              openWorkbench();
            }}
          />
        </TabsPanel>
      </Tabs>
    </main>
  );
}
