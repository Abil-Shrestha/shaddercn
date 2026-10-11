"use client";

import { defineRegistry, JSONUIProvider, Renderer } from "@json-render/react";
import { Alert, AlertDescription } from "@shaddercn/ui/components/alert";
import { Badge } from "@shaddercn/ui/components/badge";
import { Button } from "@shaddercn/ui/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@shaddercn/ui/components/card";
import { Field, FieldError, FieldLabel } from "@shaddercn/ui/components/field";
import { Fieldset } from "@shaddercn/ui/components/fieldset";
import { Form } from "@shaddercn/ui/components/form";
import { Input } from "@shaddercn/ui/components/input";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@shaddercn/ui/components/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shaddercn/ui/components/table";
import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import {
  catalog,
  type FormSubmission,
  parseFormSubmission,
  parseSpec,
} from "./catalog";

const SubmitContext = createContext<
  ((submission: FormSubmission) => Promise<void> | void) | undefined
>(undefined);

function HostForm({
  name,
  submitLabel,
  children,
  loading,
}: {
  name: string;
  submitLabel: string;
  children: ReactNode;
  loading?: boolean;
}) {
  const submit = useContext(SubmitContext);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
    <Form
      aria-label={name}
      className="flex w-full flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!submit || loading || pending.current) return;
        const values = Object.fromEntries(
          new FormData(event.currentTarget),
        ) as Record<string, string>;
        pending.current = true;
        setBusy(true);
        setMessage("");
        setError("");
        try {
          await submit({ form: name, values });
          setMessage("Submitted to the host. No backend data was changed.");
        } catch (cause) {
          setError(
            cause instanceof Error ? cause.message : "Submission failed.",
          );
        } finally {
          pending.current = false;
          setBusy(false);
        }
      }}
    >
      <Fieldset
        className="flex w-full min-w-0 max-w-none flex-col gap-6"
        disabled={loading || busy || !submit}
      >
        {children}
        <Alert role="note">
          <AlertDescription>
            Values are shared with the connected host or agent only when you
            submit. Do not enter secrets.
          </AlertDescription>
        </Alert>
        <Button className="self-start" type="submit">
          {busy ? "Submitting…" : submitLabel}
        </Button>
      </Fieldset>
      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert role="status" variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </Form>
  );
}

function LabeledInput({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
  type: "text" | "email";
  defaultValue: string;
  placeholder: string;
  required: boolean;
}) {
  return (
    <Field name={name}>
      <FieldLabel>
        {label}
        {props.required ? " *" : ""}
      </FieldLabel>
      <Input {...props} maxLength={2000} />
      <FieldError />
    </Field>
  );
}

export const { registry } = defineRegistry(catalog, {
  actions: { notify: async () => {} },
  components: {
    Badge: ({ props }) => (
      <div>
        <Badge
          className="h-auto max-w-full whitespace-normal sm:h-auto"
          variant={props.tone === "neutral" ? "secondary" : props.tone}
        >
          {props.label}
        </Badge>
      </div>
    ),
    Button: ({ props, on, loading }) => (
      <div>
        <Button
          disabled={loading || !on("press").bound}
          onClick={() => on("press").emit()}
          type="button"
          variant={props.variant}
        >
          {props.label}
        </Button>
      </div>
    ),
    Card: ({ props, children }) => (
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          {props.description && (
            <CardDescription>{props.description}</CardDescription>
          )}
        </CardHeader>
        <CardPanel>{children}</CardPanel>
      </Card>
    ),
    Form: ({ props, children, loading }) => (
      <HostForm {...props} key={String(loading)} loading={loading}>
        {children}
      </HostForm>
    ),
    Grid: ({ props, children }) => (
      <div
        className={`grid min-w-0 gap-4 ${props.columns === "3" ? "@min-[540px]:grid-cols-3" : "@min-[440px]:grid-cols-2"}`}
      >
        {children}
      </div>
    ),
    Heading: ({ props }) =>
      props.level === "2" ? (
        <h2 className="font-heading text-2xl tracking-tight">{props.text}</h2>
      ) : (
        <h3 className="font-semibold text-lg">{props.text}</h3>
      ),
    Input: ({ props }) => <LabeledInput {...props} />,
    Metric: ({ props }) => (
      <Card className="min-w-0">
        <CardHeader>
          <CardDescription>{props.label}</CardDescription>
          <CardTitle>{props.value}</CardTitle>
        </CardHeader>
        <CardPanel>
          <Badge
            className="h-auto max-w-full whitespace-normal sm:h-auto"
            variant={props.tone === "neutral" ? "secondary" : props.tone}
          >
            {props.detail}
          </Badge>
        </CardPanel>
      </Card>
    ),
    Progress: ({ props }) => (
      <Progress value={props.value}>
        <div className="flex justify-between gap-3">
          <ProgressLabel>{props.label}</ProgressLabel>
          <ProgressValue />
        </div>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    ),
    Stack: ({ props, children }) => (
      <div
        className={`flex min-w-0 flex-col ${{ lg: "gap-6", md: "gap-4", sm: "gap-2" }[props.gap]}`}
      >
        {children}
      </div>
    ),
    Table: ({ props }) => (
      <Table>
        <TableCaption>{props.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {props.columns.map((column, index) => (
              <TableHead key={`${index}-${column}`}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={`${index}-${row.join("|")}`}>
              {row.map((cell, cellIndex) => (
                <TableCell key={`${cellIndex}-${cell}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    Text: ({ props }) => (
      <p
        className={`text-sm leading-relaxed ${props.muted ? "text-muted-foreground" : ""}`}
      >
        {props.text}
      </p>
    ),
  },
});

/** Public boundary: validate even when the host supplies JSON directly. */
export function ShaddercnRenderer({
  spec,
  loading = false,
  onNotify,
  onSubmit,
}: {
  spec: unknown;
  loading?: boolean;
  onNotify: (message: string) => void;
  onSubmit?: (submission: FormSubmission) => Promise<void> | void;
}) {
  const valid = parseSpec(spec, { partial: loading });
  return (
    <div className="@container min-w-0 break-words [overflow-wrap:anywhere]">
      <SubmitContext.Provider
        value={
          onSubmit
            ? (submission) => onSubmit(parseFormSubmission(valid, submission))
            : undefined
        }
      >
        <JSONUIProvider
          handlers={{
            notify: (params) =>
              onNotify(
                catalog.data.actions.notify.params.parse(params).message,
              ),
          }}
          registry={registry}
        >
          <Renderer loading={loading} registry={registry} spec={valid} />
        </JSONUIProvider>
      </SubmitContext.Provider>
    </div>
  );
}
