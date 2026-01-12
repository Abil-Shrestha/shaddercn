"use client";

import type * as React from "react";

import { cn } from "@/shaddercn/lib/utils";

export type ShaddercnCardProps = React.ComponentProps<"div">;

export function ShaddercnCard({ className, ...props }: ShaddercnCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm/5",
        className,
      )}
      {...props}
    />
  );
}

export function ShaddercnCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("border-b px-5 py-4", className)} {...props} />;
}

export function ShaddercnCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-heading font-medium", className)} {...props} />
  );
}

export function ShaddercnCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}
