"use client";

import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Copy,
  Link2,
  Mail,
  MoreHorizontal,
  Pencil,
  Share,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { toastManager } from "@/registry/default/ui/toast";
import { Toggle, ToggleGroup } from "@/registry/default/ui/toggle-group";
import type { Anchor, Direction } from "@/shaddercn/components/dropdown";
import { Dropdown } from "@/shaddercn/components/dropdown";

export function DropdownDemo() {
  const [direction, setDirection] = useState<Direction>("top");
  const [anchor, setAnchor] = useState<Anchor>("start");
  const [hasSubmenu, setHasSubmenu] = useState(true);

  // For horizontal directions (left/right), anchor must be center
  const isHorizontal = direction === "left" || direction === "right";

  return (
    <div className="flex flex-col items-center rounded-2xl bg-muted/50 px-4 pt-8 pb-6">
      {/* Demo Area */}
      <div className="flex h-96 items-center justify-center">
        <Dropdown.Root anchor={anchor} direction={direction}>
          <Dropdown.Container
            buttonSize={40}
            className="border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
            menuRadius={12}
            menuWidth={160}
          >
            <Dropdown.Trigger>
              <div className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-5 w-5 opacity-80" />
              </div>
            </Dropdown.Trigger>

            <Dropdown.Content className="p-1">
              <Dropdown.Item
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                onSelect={() =>
                  toastManager.add({ title: "Edit mode enabled", type: "info" })
                }
              >
                <Pencil className="h-4 w-4 opacity-80" />
                Edit
              </Dropdown.Item>

              <Dropdown.Item
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                onSelect={() =>
                  toastManager.add({
                    title: "Copied to clipboard",
                    type: "success",
                  })
                }
              >
                <Copy className="h-4 w-4 opacity-80" />
                Copy
              </Dropdown.Item>

              {hasSubmenu ? (
                <Dropdown.SubMenu id="share">
                  <Dropdown.SubMenuTrigger className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[elevated]:hover:bg-transparent">
                    {(isActive: boolean) => (
                      <>
                        <span className="flex items-center gap-2">
                          <Share className="h-4 w-4 opacity-80" />
                          Share
                        </span>
                        <ChevronRight
                          className="h-4 w-4 opacity-80 transition-transform duration-200"
                          style={{
                            transform: isActive
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </>
                    )}
                  </Dropdown.SubMenuTrigger>

                  <Dropdown.SubMenuContent className="rounded-xl border bg-popover not-dark:bg-clip-padding p-1 shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]">
                    <div className="mx-1 mb-1 border-border border-b" />
                    <Dropdown.Item
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                      onSelect={() =>
                        toastManager.add({
                          title: "Shared to Twitter",
                          type: "success",
                        })
                      }
                    >
                      <Twitter className="h-4 w-4 opacity-80" />
                      Twitter
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                      onSelect={() =>
                        toastManager.add({
                          title: "Email draft created",
                          type: "success",
                        })
                      }
                    >
                      <Mail className="h-4 w-4 opacity-80" />
                      Email
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                      onSelect={() =>
                        toastManager.add({
                          title: "Link copied to clipboard",
                          type: "success",
                        })
                      }
                    >
                      <Link2 className="h-4 w-4 opacity-80" />
                      Copy Link
                    </Dropdown.Item>
                  </Dropdown.SubMenuContent>
                </Dropdown.SubMenu>
              ) : (
                <Dropdown.Item
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                  onSelect={() =>
                    toastManager.add({
                      title: "Share dialog opened",
                      type: "info",
                    })
                  }
                >
                  <Share className="h-4 w-4 opacity-80" />
                  Share
                </Dropdown.Item>
              )}

              <Dropdown.Item
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                onSelect={() => {
                  console.log("Archive clicked!");
                  toastManager.add({
                    title: "Successfully archived",
                    type: "success",
                  });
                }}
              >
                <Archive className="h-4 w-4 opacity-80" />
                Archive
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Container>
        </Dropdown.Root>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Direction Control */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground text-sm">
            Direction:
          </span>
          <ToggleGroup
            onValueChange={(value) => {
              if (value && value.length > 0) {
                const newDir = value[value.length - 1] as Direction;
                setDirection(newDir);
                if (newDir === "left" || newDir === "right") {
                  setAnchor("center");
                }
              }
            }}
            size="sm"
            value={[direction]}
            variant="outline"
          >
            <Toggle aria-label="Expand up" value="top">
              <ArrowUp className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Expand down" value="bottom">
              <ArrowDown className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Expand left" value="left">
              <ArrowLeft className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Expand right" value="right">
              <ArrowRight className="h-4 w-4" />
            </Toggle>
          </ToggleGroup>
        </div>

        {/* Anchor Control */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground text-sm">
            Anchor:
          </span>
          <ToggleGroup
            onValueChange={(value) => {
              if (value && value.length > 0) {
                setAnchor(value[value.length - 1] as Anchor);
              }
            }}
            size="sm"
            value={[anchor]}
            variant="outline"
          >
            <Toggle
              aria-label="Align to start"
              disabled={isHorizontal}
              value="start"
            >
              <AlignStartVertical className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Align to center" value="center">
              <AlignCenterVertical className="h-4 w-4" />
            </Toggle>
            <Toggle
              aria-label="Align to end"
              disabled={isHorizontal}
              value="end"
            >
              <AlignEndVertical className="h-4 w-4" />
            </Toggle>
          </ToggleGroup>
        </div>

        {/* Submenu Toggle */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground text-sm">
            Submenu:
          </span>
          <ToggleGroup
            onValueChange={(value) => {
              if (value && value.length > 0) {
                setHasSubmenu(value[value.length - 1] === "on");
              }
            }}
            size="sm"
            value={[hasSubmenu ? "on" : "off"]}
            variant="outline"
          >
            <Toggle aria-label="No submenu" value="off">
              Off
            </Toggle>
            <Toggle aria-label="With submenu" value="on">
              On
            </Toggle>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
