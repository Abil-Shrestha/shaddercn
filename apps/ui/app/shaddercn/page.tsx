import Link from "next/link";

import { Badge } from "@/registry/default/ui/badge";
import { ShaddercnRouteButton } from "@/shaddercn/components/button";

export const metadata = {
  description: "Demo route for the Shaddercn component library",
  title: "Shaddercn - shaddercn",
};

export default function Page() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl">Shaddercn</h1>
          <Badge variant="outline">new library</Badge>
        </div>
        <p className="text-muted-foreground">
          This page is a separate route inside <code>/ui</code> that renders
          components from a new workspace package:{" "}
          <code className="font-mono">@shaddercn/ui</code>.
        </p>
        <p className="text-muted-foreground text-sm">
          Back to{" "}
          <Link className="underline underline-offset-4" href="/docs">
            docs
          </Link>
          .
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-heading text-lg">Button</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Imported from <code>@/shaddercn/components/button</code>{" "}
            (route-local component set).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ShaddercnRouteButton>Primary</ShaddercnRouteButton>
            <ShaddercnRouteButton intent="secondary">
              Secondary
            </ShaddercnRouteButton>
            <ShaddercnRouteButton disabled>Disabled</ShaddercnRouteButton>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-heading text-lg">How it’s wired</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
            <li>
              <code>packages/shaddercn</code> is the source-of-truth library.
            </li>
            <li>
              <code>apps/ui/app/shaddercn</code> is the demo/docs route.
            </li>
            <li>
              <code>apps/ui/next.config.ts</code> transpiles{" "}
              <code>@shaddercn/ui</code> so Next can import TS directly.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
