import { ComponentPreviewTabs } from "@/components/component-preview-tabs";
import { ComponentSource } from "@/components/component-source";
import { ShaddercnRouteButton } from "@/shaddercn/components/button";
import {
  ShaddercnCard,
  ShaddercnCardContent,
  ShaddercnCardHeader,
  ShaddercnCardTitle,
} from "@/shaddercn/components/card";

export function ShaddercnButtonPreview() {
  return (
    <ComponentPreviewTabs
      component={
        <div className="flex flex-wrap items-center gap-3">
          <ShaddercnRouteButton>Primary</ShaddercnRouteButton>
          <ShaddercnRouteButton intent="secondary">
            Secondary
          </ShaddercnRouteButton>
          <ShaddercnRouteButton disabled>Disabled</ShaddercnRouteButton>
        </div>
      }
      source={
        <ComponentSource
          collapsible={false}
          src="shaddercn/components/button.tsx"
          title="apps/ui/shaddercn/components/button.tsx"
        />
      }
    />
  );
}

export function ShaddercnCardPreview() {
  return (
    <ComponentPreviewTabs
      align="start"
      component={
        <ShaddercnCard className="w-[420px] max-w-full">
          <ShaddercnCardHeader>
            <ShaddercnCardTitle>Card</ShaddercnCardTitle>
          </ShaddercnCardHeader>
          <ShaddercnCardContent className="space-y-3 text-muted-foreground text-sm">
            <p>
              This is a route-local Shaddercn component (not from the main
              registry).
            </p>
            <div className="flex gap-2">
              <ShaddercnRouteButton>Action</ShaddercnRouteButton>
              <ShaddercnRouteButton intent="secondary">
                Secondary
              </ShaddercnRouteButton>
            </div>
          </ShaddercnCardContent>
        </ShaddercnCard>
      }
      source={
        <ComponentSource
          collapsible={false}
          src="shaddercn/components/card.tsx"
          title="apps/ui/shaddercn/components/card.tsx"
        />
      }
    />
  );
}
