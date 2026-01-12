"use client";

import type * as React from "react";

import { cn } from "@/shaddercn/lib/utils";

export type ShaddercnRouteButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    intent?: "primary" | "secondary";
  };

export function ShaddercnRouteButton({
  className,
  intent = "primary",
  ...props
}: ShaddercnRouteButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg px-3 font-medium text-sm transition-colors",
        intent === "primary" && "bg-foreground text-background",
        intent === "secondary" && "bg-muted text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      type={props.type ?? "button"}
      {...props}
    />
  );
}
