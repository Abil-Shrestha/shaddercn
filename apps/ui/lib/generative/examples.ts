import type { Spec } from "@shaddercn/registry/catalog";

export const examples = {
  brief: {
    category: "Forms & actions",
    description: "A form that sends answers back to the host",
    label: "Agent brief",
    learn:
      "Inputs stay in the browser until you submit. The Form sends named values to the host; in Demo mode, the result stays on this page.",
    prompt:
      "Ask for a project name and a goal before planning the work. Use a Form with two required text Inputs. No external mutation.",
    spec: {
      elements: {
        brief: {
          children: ["name", "goal"],
          props: { name: "projectBrief", submitLabel: "Send brief" },
          type: "Form",
        },
        card: {
          children: ["brief"],
          props: {
            description: "Two answers to start a useful conversation.",
            title: "What are we building?",
          },
          type: "Card",
        },
        goal: {
          props: {
            defaultValue: "",
            label: "What should it help people do?",
            name: "goal",
            placeholder: "Describe the first useful outcome",
            required: true,
            type: "text",
          },
          type: "Input",
        },
        name: {
          props: {
            defaultValue: "",
            label: "Project name",
            name: "projectName",
            placeholder: "e.g. Shaddercn",
            required: true,
            type: "text",
          },
          type: "Input",
        },
        note: {
          props: {
            muted: true,
            text: "An interactive sample. Review your answers before sharing them; submitting does not create a project.",
          },
          type: "Text",
        },
        page: {
          children: ["title", "note", "card"],
          props: { gap: "lg" },
          type: "Stack",
        },
        title: {
          props: { level: "2", text: "Give your agent a little direction." },
          type: "Heading",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Submit an empty form to see validation. Fill both fields, submit again, and expand Last submitted values.",
  },
  hello: {
    category: "Start here",
    description: "Your first interface in just two elements",
    label: "First interface",
    learn:
      "The root points to a Card. Its children list points to a Text element. These names map to real components, not generated HTML.",
    prompt:
      "Build a welcoming card with one line of text. Use only Card and Text.",
    spec: {
      elements: {
        message: {
          props: {
            muted: false,
            text: "Your agent chooses the content. Your design system owns the components.",
          },
          type: "Text",
        },
        welcome: {
          children: ["message"],
          props: {
            description: "This card is described by JSON.",
            title: "Hello, Shaddercn",
          },
          type: "Card",
        },
      },
      root: "welcome",
    } satisfies Spec,
    tryThis:
      "Open this example in the JSON editor, change the Card title to “My first interface”, then validate and render.",
  },
  incident: {
    category: "Agent reports",
    description: "Explain an incident and the next safe step",
    label: "Incident report",
    learn:
      "Semantic tones communicate status without letting the agent choose arbitrary colors. This is a read-only report, not an operations console.",
    prompt:
      "Show a sample incident report with an investigating badge, error-rate metric, timeline table, and a recommended next step. Do not perform infrastructure changes.",
    spec: {
      elements: {
        metric: {
          props: {
            detail: "Sample threshold: below 1%",
            label: "Requests returning errors",
            tone: "error",
            value: "3.2%",
          },
          type: "Metric",
        },
        next: {
          children: ["note"],
          props: {
            description: "Review before taking action.",
            title: "Recommended next step",
          },
          type: "Card",
        },
        note: {
          props: {
            muted: false,
            text: "Ask the on-call engineer to review the proposed rollback. This interface cannot restart services or change infrastructure.",
          },
          type: "Text",
        },
        page: {
          children: ["status", "title", "metric", "timeline", "next"],
          props: { gap: "lg" },
          type: "Stack",
        },
        status: {
          props: { label: "Investigating · sample incident", tone: "warning" },
          type: "Badge",
        },
        timeline: {
          props: {
            caption: "Illustrative timeline — not connected to monitoring",
            columns: ["Time", "Observation"],
            rows: [
              ["09:10", "Latency alert triggered"],
              ["09:14", "Database connection saturation identified"],
              ["09:18", "Rollback proposed for human review"],
            ],
          },
          type: "Table",
        },
        title: {
          props: { level: "2", text: "API latency is above normal" },
          type: "Heading",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Compare the warning and error tones. Change the badge tone to success and its label to Resolved in the editor to see a different state.",
  },
  project: {
    category: "Dashboards",
    description: "Metrics, a table, and a milestone",
    label: "Project overview",
    learn:
      "Stack and Grid compose the layout. Metrics, tables, and progress all use the same shared components as the rest of this app.",
    prompt:
      "Build a project overview for a small product team, with delivery metrics, recent projects, and milestone progress. Use sample data.",
    spec: {
      elements: {
        action: {
          on: {
            press: {
              action: "notify",
              params: {
                message:
                  "The host received notify. No project data was changed.",
              },
            },
          },
          props: { label: "Try an agent action", variant: "outline" },
          type: "Button",
        },
        active: {
          props: {
            detail: "Across 3 teams",
            label: "Active projects",
            tone: "neutral",
            value: "12",
          },
          type: "Metric",
        },
        badge: {
          props: { label: "Workspace overview", tone: "neutral" },
          type: "Badge",
        },
        completed: {
          props: {
            detail: "+18 from last month",
            label: "Tasks completed",
            tone: "success",
            value: "84",
          },
          type: "Metric",
        },
        description: {
          props: {
            muted: true,
            text: "Your team's projects, progress, and what's coming next. All in one place.",
          },
          type: "Text",
        },
        intro: {
          children: ["badge", "title", "description"],
          props: { gap: "sm" },
          type: "Stack",
        },
        metrics: {
          children: ["active", "completed", "velocity"],
          props: { columns: "3" },
          type: "Grid",
        },
        milestone: {
          children: ["milestone-body"],
          props: {
            description: "Design system v1.0 · 18 of 24 tasks complete",
            title: "Next milestone",
          },
          type: "Card",
        },
        "milestone-body": {
          children: ["progress", "action"],
          props: { gap: "md" },
          type: "Stack",
        },
        page: {
          children: ["intro", "metrics", "projects", "milestone"],
          props: { gap: "lg" },
          type: "Stack",
        },
        progress: {
          props: { label: "Release readiness", value: 75 },
          type: "Progress",
        },
        projects: {
          children: ["table"],
          props: {
            description: "A snapshot of the work in progress.",
            title: "Moving things forward",
          },
          type: "Card",
        },
        table: {
          props: {
            caption: "Sample project data · not connected to a workspace",
            columns: ["Project", "Owner", "Status", "Due"],
            rows: [
              ["Design system", "Alex Morgan", "In progress", "Oct 16"],
              ["Customer portal", "Sam Rivera", "In review", "Oct 22"],
              ["API v2", "Jordan Lee", "Planning", "Nov 04"],
            ],
          },
          type: "Table",
        },
        title: {
          props: {
            level: "2",
            text: "A little clarity for your next big thing.",
          },
          type: "Heading",
        },
        velocity: {
          props: {
            detail: "+4% from last month",
            label: "On-time delivery",
            tone: "success",
            value: "96%",
          },
          type: "Metric",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Replay the stream and watch the element count grow. Then click Try an agent action: it sends a notification, not a backend update.",
  },
  release: {
    category: "Agent reports",
    description: "A focused status report for an agent",
    label: "Release checklist",
    learn:
      "An agent can present a structured report instead of a wall of text. A warning badge and progress value make the blocker visible.",
    prompt:
      "Build a release readiness report for a coding agent. Show checks that passed, what is blocked, and the overall progress. Use sample data; don't claim a real deployment happened.",
    spec: {
      elements: {
        action: {
          on: {
            press: {
              action: "notify",
              params: {
                message: "Sample report acknowledged. No release was deployed.",
              },
            },
          },
          props: { label: "Acknowledge report", variant: "default" },
          type: "Button",
        },
        checks: {
          children: ["table"],
          props: {
            description:
              "A read-only report. No deployment actions are available.",
            title: "Preflight checks",
          },
          type: "Card",
        },
        note: {
          props: {
            muted: true,
            text: "Sample release report for v1.4.0. One check needs attention before a human approves the release.",
          },
          type: "Text",
        },
        page: {
          children: ["status", "title", "note", "checks", "progress", "action"],
          props: { gap: "lg" },
          type: "Stack",
        },
        progress: {
          props: { label: "Checks passed", value: 75 },
          type: "Progress",
        },
        status: {
          props: { label: "Needs your attention", tone: "warning" },
          type: "Badge",
        },
        table: {
          props: {
            caption: "Illustrative checks — not a live CI run",
            columns: ["Check", "Result", "Detail"],
            rows: [
              ["Type checking", "Passed", "0 errors"],
              ["Unit tests", "Passed", "128 / 128"],
              ["Accessibility", "Needs review", "2 missing labels"],
              ["Bundle size", "Passed", "142 KB / 160 KB"],
            ],
          },
          type: "Table",
        },
        title: {
          props: { level: "2", text: "Almost ready for the world." },
          type: "Heading",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Edit the JSON to change the accessibility result and progress value. Acknowledge report only displays a message; it never deploys.",
  },
  research: {
    category: "Agent reports",
    description: "Compare findings and call out uncertainty",
    label: "Research summary",
    learn:
      "The same catalog works for editorial content. Headings, cards, and a table can turn an agent's findings into a scannable comparison.",
    prompt:
      "Create a sample research summary comparing two search approaches, with tradeoffs and open questions. Clearly label the findings as illustrative.",
    spec: {
      elements: {
        comparison: {
          props: {
            caption: "Two starting points for a small documentation site",
            columns: ["Approach", "Useful for", "Tradeoff"],
            rows: [
              [
                "Keyword search",
                "Exact names and error messages",
                "Needs matching vocabulary",
              ],
              [
                "Semantic search",
                "Questions in natural language",
                "Adds embedding cost and evaluation work",
              ],
            ],
          },
          type: "Table",
        },
        note: {
          props: {
            muted: true,
            text: "Illustrative findings, not a benchmark. Validate with your own documents and queries.",
          },
          type: "Text",
        },
        page: {
          children: ["title", "note", "comparison", "questions"],
          props: { gap: "lg" },
          type: "Stack",
        },
        question: {
          props: {
            muted: false,
            text: "Collect 20 real queries. Compare relevance, latency, and cost for both approaches before choosing one.",
          },
          type: "Text",
        },
        questions: {
          children: ["question"],
          props: {
            description: "Turn assumptions into a small experiment.",
            title: "Before deciding",
          },
          type: "Card",
        },
        title: {
          props: { level: "2", text: "Choosing a search approach" },
          type: "Heading",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Add a third option as a row in the table. Keep three cells in every row so it still matches the column count.",
  },
  support: {
    category: "Forms & actions",
    description: "Collect a request with email validation",
    label: "Support intake",
    learn:
      "A required email Input validates its format. Field names become the keys in the submission payload; labels are just what people see.",
    prompt:
      "Create a support intake form with a required contact email and issue summary. Use sample data and explain that no ticket is created.",
    spec: {
      elements: {
        card: {
          children: ["form"],
          props: {
            description:
              "Sample support form. Submitting shares your answers with the host; it does not create a ticket.",
            title: "How can we help?",
          },
          type: "Card",
        },
        email: {
          props: {
            defaultValue: "",
            label: "Contact email",
            name: "email",
            placeholder: "alex@example.com",
            required: true,
            type: "email",
          },
          type: "Input",
        },
        form: {
          children: ["email", "issue"],
          props: { name: "supportRequest", submitLabel: "Send request" },
          type: "Form",
        },
        issue: {
          props: {
            defaultValue: "",
            label: "What went wrong?",
            name: "issue",
            placeholder: "Describe the issue without passwords or private data",
            required: true,
            type: "text",
          },
          type: "Input",
        },
      },
      root: "card",
    } satisfies Spec,
    tryThis:
      "Try an invalid email, then use alex@example.com and a short issue description. Submit to inspect the payload. No ticket is created.",
  },
  usage: {
    category: "Dashboards",
    description: "A plan summary with usage limits",
    label: "Usage & billing",
    learn:
      "Formatted values are plain text, while Progress takes a number from 0 to 100. The renderer owns their appearance.",
    prompt:
      "Build a usage and billing overview for a developer platform. Show the current plan, monthly usage, and a cost breakdown with sample data.",
    spec: {
      elements: {
        allowances: {
          children: ["requests", "storage"],
          props: { gap: "lg" },
          type: "Stack",
        },
        cost: {
          props: {
            detail: "Within your $100 budget",
            label: "Estimated total",
            tone: "success",
            value: "$48.20",
          },
          type: "Metric",
        },
        costs: {
          props: {
            caption: "Illustrative monthly costs",
            columns: ["Resource", "Usage", "Cost"],
            rows: [
              ["Pro subscription", "1 workspace", "$29.00"],
              ["Compute", "96 hours", "$14.40"],
              ["Storage", "12 GB", "$4.80"],
            ],
          },
          type: "Table",
        },
        metrics: {
          children: ["plan", "cost"],
          props: { columns: "2" },
          type: "Grid",
        },
        note: {
          props: {
            muted: true,
            text: "Your monthly usage at a glance. Sample data — no billing account is connected.",
          },
          type: "Text",
        },
        page: {
          children: ["title", "note", "metrics", "usage", "costs"],
          props: { gap: "lg" },
          type: "Stack",
        },
        plan: {
          props: {
            detail: "Renews November 1",
            label: "Current plan",
            tone: "neutral",
            value: "Pro",
          },
          type: "Metric",
        },
        requests: {
          props: { label: "API requests · 64,000 / 100,000", value: 64 },
          type: "Progress",
        },
        storage: {
          props: { label: "Storage · 12 GB / 50 GB", value: 24 },
          type: "Progress",
        },
        title: {
          props: { level: "2", text: "Room to build. Space to grow." },
          type: "Heading",
        },
        usage: {
          children: ["allowances"],
          props: {
            description: "You're comfortably within your plan.",
            title: "Monthly allowance",
          },
          type: "Card",
        },
      },
      root: "page",
    } satisfies Spec,
    tryThis:
      "Change the requests progress value from 64 to 90 in the JSON editor. Notice that the descriptive label is separate and must be updated too.",
  },
};

export type ExampleId = keyof typeof examples;
export const exampleIds = [
  "hello",
  ...Object.keys(examples).filter((id) => id !== "hello"),
] as [ExampleId, ...ExampleId[]];
