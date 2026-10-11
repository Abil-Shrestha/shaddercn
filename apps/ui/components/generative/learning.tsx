"use client";

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
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@shaddercn/ui/components/frame";
import { ScrollArea } from "@shaddercn/ui/components/scroll-area";
import { ArrowRight, Code2, Play, Terminal } from "lucide-react";
import {
  type ExampleId,
  exampleIds,
  examples,
} from "@/lib/generative/examples";

type ExampleAction = (id: ExampleId, edit?: boolean) => void;

export function ExampleGallery({
  disabled,
  onExample,
}: {
  disabled: boolean;
  onExample: ExampleAction;
}) {
  return (
    <section aria-labelledby="examples-heading" className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-semibold text-xl" id="examples-heading">
          One catalog, many interfaces
        </h2>
        <p className="max-w-2xl text-muted-foreground text-sm">
          Start small or explore a real-world pattern. Every example is a
          prerecorded JSON spec with sample data. No account, API key, or model
          call required.
        </p>
        {disabled && (
          <Alert role="note">
            <AlertDescription>
              Stop the stream or disconnect your agent before loading another
              example. Your current preview stays intact while you browse.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exampleIds.map((id) => {
          const example = examples[id];
          const components = [
            ...new Set(
              Object.values(example.spec.elements).map(
                (element) => element.type,
              ),
            ),
          ];
          return (
            <Card key={id}>
              <CardHeader>
                <div className="mb-2">
                  <Badge variant="secondary">{example.category}</Badge>
                </div>
                <CardTitle>
                  <h3>{example.label}</h3>
                </CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-4">
                <p className="text-sm">{example.learn}</p>
                <p className="text-muted-foreground text-xs">
                  Uses {components.join(" · ")}
                </p>
              </CardPanel>
              <CardFooter className="mt-auto flex-wrap gap-2">
                <Button
                  aria-label={`Try ${example.label}`}
                  disabled={disabled}
                  onClick={() => onExample(id)}
                  size="sm"
                >
                  <Play /> Try example
                </Button>
                <Button
                  aria-label={`Edit ${example.label} JSON`}
                  disabled={disabled}
                  onClick={() => onExample(id, true)}
                  size="sm"
                  variant="outline"
                >
                  <Code2 /> Edit JSON
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function Tutorials({
  disabled,
  agentEnabled,
  onExample,
  onMode,
}: {
  disabled: boolean;
  agentEnabled: boolean;
  onExample: ExampleAction;
  onMode: (mode: "agent" | "live") => void;
}) {
  return (
    <Frame>
      <FrameHeader>
        <FrameTitle>
          <h2>Learn by changing something</h2>
        </FrameTitle>
        <FrameDescription>
          Four short walkthroughs, from your first spec to a connected agent.
          Start with lesson 1; it needs no setup.
        </FrameDescription>
      </FrameHeader>
      <FramePanel>
        {disabled && (
          <Alert role="note">
            <AlertDescription>
              You can read these lessons while connected. Stop the stream or
              disconnect your agent before opening a lesson in the playground.
            </AlertDescription>
          </Alert>
        )}
        <Accordion defaultValue={["first"]}>
          <AccordionItem value="first">
            <AccordionTrigger>
              01 · Build your first interface · 2 min
            </AccordionTrigger>
            <AccordionPanel>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-5">
                  <p>
                    A spec is a JSON description of an interface. You don’t
                    write JSX or CSS: you choose components from the catalog and
                    give them content.
                  </p>
                  <ol className="list-decimal space-y-3 pl-5">
                    <li>
                      Click <strong>Open starter in editor</strong>. The same
                      two-element spec shown here opens in Your JSON mode.
                    </li>
                    <li>
                      Find <code>title</code> under <code>welcome.props</code>{" "}
                      and change it to <strong>My first interface</strong>.
                    </li>
                    <li>
                      Click <strong>Validate &amp; render</strong>. The card
                      heading changes; its spacing, border, and typography still
                      come from the design system.
                    </li>
                  </ol>
                  <p>
                    <strong>How to read it:</strong> <code>root</code> names the
                    first element. Each entry in <code>elements</code> has a
                    component <code>type</code> and <code>props</code>. A
                    container’s <code>children</code> are other element IDs.
                  </p>
                  <Button
                    disabled={disabled}
                    onClick={() => onExample("hello", true)}
                    variant="outline"
                  >
                    <Code2 /> Open starter in editor
                  </Button>
                  <p>
                    <strong>Try a mistake:</strong> change <code>Card</code> to{" "}
                    <code>UnknownCard</code>. Validation rejects it and keeps
                    the last valid preview. Restore <code>Card</code> to
                    continue.
                  </p>
                </div>
                <div className="min-w-0 space-y-3">
                  <Badge variant="outline">Complete, editable spec</Badge>
                  <ScrollArea className="h-96">
                    <pre className="p-1 font-mono text-xs leading-relaxed">
                      <code>
                        {JSON.stringify(examples.hello.spec, null, 2)}
                      </code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="forms">
            <AccordionTrigger>
              02 · Send answers back to the host · 3 min
            </AccordionTrigger>
            <AccordionPanel className="space-y-5">
              <p>
                Generated UI can collect answers, not just display a report. A
                Form owns named Inputs and an explicit submit button.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Open <strong>Agent brief</strong> below. Click{" "}
                  <strong>Send brief</strong> with empty fields to see
                  required-field validation.
                </li>
                <li>
                  Enter a project name and a goal. Switch to{" "}
                  <strong>JSON</strong> and back to <strong>Preview</strong>:
                  your draft stays put.
                </li>
                <li>
                  Submit, then expand <strong>Last submitted values</strong>.
                  You’ll see <code>form: "projectBrief"</code> and{" "}
                  <code>values</code> with <code>projectName</code> and{" "}
                  <code>goal</code>.
                </li>
              </ol>
              <Alert role="note">
                <AlertTitle>Demo submissions stay here</AlertTitle>
                <AlertDescription>
                  No project is created, and no agent receives these demo
                  answers. In Coding agent mode, a submission goes to that
                  session’s inbox only after you click submit. Never enter
                  secrets.
                </AlertDescription>
              </Alert>
              <Button
                disabled={disabled}
                onClick={() => onExample("brief")}
                variant="outline"
              >
                <Play /> Open form example
              </Button>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="agent">
            <AccordionTrigger>
              03 · Connect your coding agent · 5 min
            </AccordionTrigger>
            <AccordionPanel className="space-y-5">
              <p>
                Use an agent that can make HTTP requests or run shell commands
                alongside the development server. This is an HTTP connection,
                not an MCP integration; no extra model key is needed by this
                playground.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  Open <strong>Coding agent</strong> mode below, then click{" "}
                  <strong>Create agent session</strong>. Keep this browser tab
                  open.
                </li>
                <li>
                  Click <strong>Copy connection instructions</strong> and paste
                  them privately into your agent. They include the catalog URL,
                  session ID, bearer token, and streaming protocol.
                </li>
                <li>
                  Ask:{" "}
                  <strong>
                    “Build a form asking for a project name and a goal. Read my
                    submission from the session inbox, then replace the form
                    with a summary.”
                  </strong>
                </li>
                <li>
                  Watch the interface arrive, submit your answers, and let the
                  agent poll the inbox and send a new spec. Click{" "}
                  <strong>Disconnect agent</strong> when finished to revoke
                  access.
                </li>
              </ol>
              <p>
                <strong>Under the hood:</strong> the agent fetches the catalog,
                POSTs newline-delimited JSON patches to the session’s{" "}
                <code>/spec</code> endpoint, then GETs <code>/events</code> with
                its cursor. The copied instructions contain the exact URLs and
                authorization headers.
              </p>
              <Alert role="note">
                <AlertTitle>Local development only</AlertTitle>
                <AlertDescription>
                  Sessions expire after 30 minutes and disappear on server
                  restart. If a portal requires browser login, the agent should
                  use the development server’s loopback address from the same
                  machine instead. Don’t commit the private connection
                  instructions.
                </AlertDescription>
              </Alert>
              <Button
                disabled={disabled || !agentEnabled}
                onClick={() => onMode("agent")}
                variant="outline"
              >
                <Terminal /> Open coding agent mode
              </Button>
              {!agentEnabled && (
                <p>
                  Agent sessions are disabled on this production instance. Run
                  the repository’s development server to follow this lesson.
                </p>
              )}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="live">
            <AccordionTrigger>
              04 · Generate from a prompt · Optional setup
            </AccordionTrigger>
            <AccordionPanel className="space-y-5">
              <p>
                Live model mode asks a model to create a new spec from your
                prompt. Unlike Demo mode, it makes a paid request through your
                server’s Vercel AI Gateway account.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  In your local checkout, add <code>AI_GATEWAY_API_KEY</code>{" "}
                  and <code>SHADDERCN_MODEL</code> to{" "}
                  <code>apps/ui/.env.local</code>. Use a supported Gateway model
                  ID in <code>provider/model</code> format. Keep the key private
                  and never use a <code>NEXT_PUBLIC_</code> prefix.
                </li>
                <li>
                  Restart the development server with{" "}
                  <code>bun run dev --filter=ui</code>, then reopen this page.
                </li>
                <li>
                  Switch to <strong>Live model</strong>, describe a small
                  dashboard or form, and click{" "}
                  <strong>Generate interface</strong>.
                </li>
              </ol>
              <p>
                The model is restricted to the catalog’s components and actions.
                Invalid output is rejected and the previous complete preview is
                restored. Live generation is disabled in production until
                authentication and usage limits exist.
              </p>
              <Button
                disabled={disabled}
                onClick={() => onMode("live")}
                variant="outline"
              >
                Open live model mode <ArrowRight />
              </Button>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </FramePanel>
    </Frame>
  );
}
