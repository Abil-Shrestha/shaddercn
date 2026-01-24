"use client";

import {
  Bell,
  Calculator,
  Calendar,
  CircleHelp,
  CornerDownLeft,
  CreditCard,
  FileText,
  FolderOpen,
  GitBranch,
  Home,
  Inbox,
  Laptop,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Smile,
  Sparkles,
  Sun,
  Terminal,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toastManager } from "@/registry/default/ui/toast";
import { CommandK } from "@/shaddercn/components/command-k";

export function CommandKDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center rounded-2xl bg-muted/50 px-4 pt-8 pb-6">
      {/* Demo Area */}
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
          or click the button below
        </p>

        <button
          className="inline-flex items-center gap-2 rounded-lg border bg-popover px-4 py-2 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => setOpen(true)}
          type="button"
        >
          Open Command Palette
          <CommandK.ShortcutGroup>
            <CommandK.Shortcut>⌘</CommandK.Shortcut>
            <CommandK.Shortcut>K</CommandK.Shortcut>
          </CommandK.ShortcutGroup>
        </button>

        <CommandK.Root onOpenChange={setOpen} open={open}>
          <CommandK.Dialog>
            <CommandK.Input placeholder="Type a command or search..." />

            <CommandK.List maxHeight={400}>
              <CommandK.Empty>No results found.</CommandK.Empty>

              <CommandK.Group heading="Quick Actions">
                <CommandK.Item
                  keywords={["ai", "generate", "write"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "AI Assistant activated",
                      type: "info",
                    });
                  }}
                  value="ask ai"
                >
                  <Sparkles className="h-4 w-4 opacity-70" />
                  <span>Ask AI</span>
                  <CommandK.Shortcut className="ml-auto">⌘J</CommandK.Shortcut>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["find", "lookup"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Search opened",
                      type: "info",
                    });
                  }}
                  value="search files"
                >
                  <Search className="h-4 w-4 opacity-70" />
                  <span>Search Files</span>
                  <CommandK.Shortcut className="ml-auto">⌘F</CommandK.Shortcut>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["console", "cli", "shell"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Terminal opened",
                      type: "info",
                    });
                  }}
                  value="open terminal"
                >
                  <Terminal className="h-4 w-4 opacity-70" />
                  <span>Open Terminal</span>
                  <CommandK.Shortcut className="ml-auto">⌘`</CommandK.Shortcut>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Navigation">
                <CommandK.Item
                  onSelect={() => {
                    toastManager.add({
                      title: "Going home",
                      type: "info",
                    });
                  }}
                  value="go to home"
                >
                  <Home className="h-4 w-4 opacity-70" />
                  <span>Home</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["overview", "stats"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Dashboard opened",
                      type: "info",
                    });
                  }}
                  value="go to dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 opacity-70" />
                  <span>Dashboard</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["files", "documents"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Projects opened",
                      type: "info",
                    });
                  }}
                  value="go to projects"
                >
                  <FolderOpen className="h-4 w-4 opacity-70" />
                  <span>Projects</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["messages", "notifications"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Inbox opened",
                      type: "info",
                    });
                  }}
                  value="go to inbox"
                >
                  <Inbox className="h-4 w-4 opacity-70" />
                  <span>Inbox</span>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                    12
                  </span>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Tools">
                <CommandK.Item
                  onSelect={() => {
                    toastManager.add({
                      title: "Calendar opened",
                      type: "info",
                    });
                  }}
                  value="calendar"
                >
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span>Calendar</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["emoji", "face", "emoticon"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Emoji picker opened",
                      type: "info",
                    });
                  }}
                  value="emoji picker"
                >
                  <Smile className="h-4 w-4 opacity-70" />
                  <span>Emoji Picker</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["math", "compute"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Calculator opened",
                      type: "info",
                    });
                  }}
                  value="calculator"
                >
                  <Calculator className="h-4 w-4 opacity-70" />
                  <span>Calculator</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["vcs", "source control"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Git panel opened",
                      type: "info",
                    });
                  }}
                  value="git"
                >
                  <GitBranch className="h-4 w-4 opacity-70" />
                  <span>Git</span>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Settings">
                <CommandK.Item
                  keywords={["account", "me"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Profile opened",
                      type: "info",
                    });
                  }}
                  value="profile"
                >
                  <User className="h-4 w-4 opacity-70" />
                  <span>Profile</span>
                  <CommandK.Shortcut className="ml-auto">⌘P</CommandK.Shortcut>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["payment", "subscription"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Billing opened",
                      type: "info",
                    });
                  }}
                  value="billing"
                >
                  <CreditCard className="h-4 w-4 opacity-70" />
                  <span>Billing</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["team", "members"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Team settings opened",
                      type: "info",
                    });
                  }}
                  value="team"
                >
                  <Users className="h-4 w-4 opacity-70" />
                  <span>Team</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["alerts"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Notifications settings opened",
                      type: "info",
                    });
                  }}
                  value="notifications"
                >
                  <Bell className="h-4 w-4 opacity-70" />
                  <span>Notifications</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["preferences", "config"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Settings opened",
                      type: "info",
                    });
                  }}
                  value="settings"
                >
                  <Settings className="h-4 w-4 opacity-70" />
                  <span>Settings</span>
                  <CommandK.Shortcut className="ml-auto">⌘,</CommandK.Shortcut>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Theme">
                <CommandK.Item
                  onSelect={() => {
                    toastManager.add({
                      title: "Light mode enabled",
                      type: "success",
                    });
                  }}
                  value="light mode"
                >
                  <Sun className="h-4 w-4 opacity-70" />
                  <span>Light Mode</span>
                </CommandK.Item>
                <CommandK.Item
                  onSelect={() => {
                    toastManager.add({
                      title: "Dark mode enabled",
                      type: "success",
                    });
                  }}
                  value="dark mode"
                >
                  <Moon className="h-4 w-4 opacity-70" />
                  <span>Dark Mode</span>
                </CommandK.Item>
                <CommandK.Item
                  onSelect={() => {
                    toastManager.add({
                      title: "System theme enabled",
                      type: "success",
                    });
                  }}
                  value="system theme"
                >
                  <Laptop className="h-4 w-4 opacity-70" />
                  <span>System</span>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Help">
                <CommandK.Item
                  keywords={["docs", "documentation"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Opening documentation",
                      type: "info",
                    });
                  }}
                  value="documentation"
                >
                  <FileText className="h-4 w-4 opacity-70" />
                  <span>Documentation</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["support", "question"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Help center opened",
                      type: "info",
                    });
                  }}
                  value="help center"
                >
                  <CircleHelp className="h-4 w-4 opacity-70" />
                  <span>Help Center</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["feedback", "contact"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Feedback form opened",
                      type: "info",
                    });
                  }}
                  value="send feedback"
                >
                  <MessageSquare className="h-4 w-4 opacity-70" />
                  <span>Send Feedback</span>
                </CommandK.Item>
                <CommandK.Item
                  keywords={["shortcuts", "keys"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Keyboard shortcuts opened",
                      type: "info",
                    });
                  }}
                  value="keyboard shortcuts"
                >
                  <Zap className="h-4 w-4 opacity-70" />
                  <span>Keyboard Shortcuts</span>
                  <CommandK.Shortcut className="ml-auto">⌘/</CommandK.Shortcut>
                </CommandK.Item>
              </CommandK.Group>

              <CommandK.Separator />

              <CommandK.Group heading="Account">
                <CommandK.Item
                  keywords={["exit", "sign out"]}
                  onSelect={() => {
                    toastManager.add({
                      title: "Logging out...",
                      type: "info",
                    });
                  }}
                  value="log out"
                >
                  <LogOut className="h-4 w-4 opacity-70" />
                  <span>Log Out</span>
                </CommandK.Item>
              </CommandK.Group>
            </CommandK.List>

            <CommandK.Footer>
              <div className="flex items-center gap-2">
                <span>Navigate</span>
                <CommandK.ShortcutGroup>
                  <CommandK.Shortcut>↑</CommandK.Shortcut>
                  <CommandK.Shortcut>↓</CommandK.Shortcut>
                </CommandK.ShortcutGroup>
              </div>
              <div className="flex items-center gap-2">
                <span>Select</span>
                <CommandK.Shortcut>
                  <CornerDownLeft className="h-3 w-3" />
                </CommandK.Shortcut>
              </div>
              <div className="flex items-center gap-2">
                <span>Close</span>
                <CommandK.Shortcut>Esc</CommandK.Shortcut>
              </div>
            </CommandK.Footer>
          </CommandK.Dialog>
        </CommandK.Root>
      </div>
    </div>
  );
}
