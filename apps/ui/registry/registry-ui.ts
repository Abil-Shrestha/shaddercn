import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "ui",
    registryDependencies: [
      "@shaddercn/accordion",
      "@shaddercn/alert",
      "@shaddercn/alert-dialog",
      "@shaddercn/autocomplete",
      "@shaddercn/avatar",
      "@shaddercn/badge",
      "@shaddercn/breadcrumb",
      "@shaddercn/button",
      "@shaddercn/calendar",
      "@shaddercn/card",
      "@shaddercn/checkbox",
      "@shaddercn/checkbox-group",
      "@shaddercn/collapsible",
      "@shaddercn/combobox",
      "@shaddercn/command",
      "@shaddercn/context-menu",
      "@shaddercn/dialog",
      "@shaddercn/drawer",
      "@shaddercn/empty",
      "@shaddercn/field",
      "@shaddercn/fieldset",
      "@shaddercn/form",
      "@shaddercn/frame",
      "@shaddercn/group",
      "@shaddercn/input",
      "@shaddercn/otp-field",
      "@shaddercn/input-group",
      "@shaddercn/kbd",
      "@shaddercn/label",
      "@shaddercn/menu",
      "@shaddercn/meter",
      "@shaddercn/number-field",
      "@shaddercn/pagination",
      "@shaddercn/popover",
      "@shaddercn/preview-card",
      "@shaddercn/progress",
      "@shaddercn/radio-group",
      "@shaddercn/scroll-area",
      "@shaddercn/select",
      "@shaddercn/separator",
      "@shaddercn/sheet",
      "@shaddercn/sidebar",
      "@shaddercn/skeleton",
      "@shaddercn/slider",
      "@shaddercn/spinner",
      "@shaddercn/switch",
      "@shaddercn/table",
      "@shaddercn/tabs",
      "@shaddercn/textarea",
      "@shaddercn/toast",
      "@shaddercn/toggle",
      "@shaddercn/toggle-group",
      "@shaddercn/toolbar",
      "@shaddercn/tooltip",
    ],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/accordion.tsx",
        type: "registry:ui",
      },
    ],
    name: "accordion",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-400)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-400)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-700)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-700)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-700)",
      },
    },
    files: [
      {
        path: "ui/alert.tsx",
        type: "registry:ui",
      },
    ],
    name: "alert",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
    ],
    name: "alert-dialog",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/autocomplete.tsx",
        type: "registry:ui",
      },
    ],
    name: "autocomplete",
    registryDependencies: ["@shaddercn/input", "@shaddercn/scroll-area"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/avatar.tsx",
        type: "registry:ui",
      },
    ],
    name: "avatar",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-400)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-400)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
        info: "var(--color-blue-500)",
        "info-foreground": "var(--color-blue-700)",
        success: "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-700)",
        warning: "var(--color-amber-500)",
        "warning-foreground": "var(--color-amber-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
      },
    ],
    name: "badge",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "registry:ui",
      },
    ],
    name: "breadcrumb",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    name: "button",
    registryDependencies: ["@shaddercn/spinner"],
    type: "registry:ui",
  },
  {
    dependencies: ["@daypicker/react", "lucide-react"],
    files: [
      {
        path: "ui/calendar.tsx",
        type: "registry:ui",
      },
    ],
    name: "calendar",
    registryDependencies: [],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
      },
    ],
    name: "card",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "registry:ui",
      },
    ],
    name: "checkbox",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/checkbox-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "checkbox-group",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "registry:ui",
      },
    ],
    name: "collapsible",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/combobox.tsx",
        type: "registry:ui",
      },
    ],
    name: "combobox",
    registryDependencies: ["@shaddercn/input", "@shaddercn/scroll-area"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/command.tsx",
        type: "registry:ui",
      },
    ],
    name: "command",
    registryDependencies: ["@shaddercn/autocomplete"],
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/context-menu.tsx",
        type: "registry:ui",
      },
    ],
    name: "context-menu",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
    name: "dialog",
    registryDependencies: ["@shaddercn/button", "@shaddercn/scroll-area"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/drawer.tsx",
        type: "registry:ui",
      },
    ],
    name: "drawer",
    registryDependencies: ["@shaddercn/button", "@shaddercn/scroll-area"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/empty.tsx",
        type: "registry:ui",
      },
    ],
    name: "empty",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/field.tsx",
        type: "registry:ui",
      },
    ],
    name: "field",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/fieldset.tsx",
        type: "registry:ui",
      },
    ],
    name: "fieldset",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/form.tsx",
        type: "registry:ui",
      },
    ],
    name: "form",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/frame.tsx",
        type: "registry:ui",
      },
    ],
    name: "frame",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/group.tsx",
        type: "registry:ui",
      },
    ],
    name: "group",
    registryDependencies: ["@shaddercn/separator"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
    ],
    name: "input",
    type: "registry:ui",
  },
  {
    css: {
      "@keyframes caret-blink": {
        "0%, 70%, to": {
          opacity: "1",
        },
        "20%, 50%": {
          opacity: "0",
        },
      },
    },
    cssVars: {
      theme: {
        "--animate-caret-blink": "1s ease-out infinite caret-blink",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/otp-field.tsx",
        type: "registry:ui",
      },
    ],
    name: "otp-field",
    registryDependencies: ["@shaddercn/separator"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/input-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "input-group",
    registryDependencies: ["@shaddercn/input", "@shaddercn/textarea"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/kbd.tsx",
        type: "registry:ui",
      },
    ],
    name: "kbd",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
    ],
    name: "label",
    type: "registry:ui",
  },
  {
    cssVars: {
      dark: {
        "destructive-foreground": "var(--color-red-400)",
      },
      light: {
        "destructive-foreground": "var(--color-red-700)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/menu.tsx",
        type: "registry:ui",
      },
    ],
    name: "menu",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/meter.tsx",
        type: "registry:ui",
      },
    ],
    name: "meter",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/number-field.tsx",
        type: "registry:ui",
      },
    ],
    name: "number-field",
    registryDependencies: ["@shaddercn/label"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/pagination.tsx",
        type: "registry:ui",
      },
    ],
    name: "pagination",
    registryDependencies: ["@shaddercn/button"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/popover.tsx",
        type: "registry:ui",
      },
    ],
    name: "popover",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/preview-card.tsx",
        type: "registry:ui",
      },
    ],
    name: "preview-card",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/progress.tsx",
        type: "registry:ui",
      },
    ],
    name: "progress",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "radio-group",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
      },
    ],
    name: "scroll-area",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
    ],
    name: "select",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
    ],
    name: "separator",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
    ],
    name: "sheet",
    registryDependencies: ["@shaddercn/button", "@shaddercn/scroll-area"],
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/sidebar.tsx",
        type: "registry:ui",
      },
    ],
    name: "sidebar",
    registryDependencies: [
      "@shaddercn/button",
      "@shaddercn/input",
      "@shaddercn/scroll-area",
      "@shaddercn/separator",
      "@shaddercn/sheet",
      "@shaddercn/skeleton",
      "@shaddercn/tooltip",
      "@shaddercn/use-media-query",
      "@shaddercn/utils",
    ],
    type: "registry:ui",
  },
  {
    css: {
      "@keyframes skeleton": {
        to: {
          "background-position": "-200% 0",
        },
      },
    },
    cssVars: {
      theme: {
        "--animate-skeleton": "skeleton 2s -1s infinite linear",
      },
    },
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
    name: "skeleton",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
    ],
    name: "slider",
    type: "registry:ui",
  },
  {
    files: [
      {
        path: "ui/spinner.tsx",
        type: "registry:ui",
      },
    ],
    name: "spinner",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/switch.tsx",
        type: "registry:ui",
      },
    ],
    name: "switch",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/table.tsx",
        type: "registry:ui",
      },
    ],
    name: "table",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/tabs.tsx",
        type: "registry:ui",
      },
    ],
    name: "tabs",
    registryDependencies: ["@shaddercn/segmented-control"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/textarea.tsx",
        type: "registry:ui",
      },
    ],
    name: "textarea",
    type: "registry:ui",
  },
  {
    css: {
      "@keyframes toast-error-even": {
        "0%": {
          translate: "0 0",
        },
        "25%": {
          translate: "-3px 0",
        },
        "50%": {
          translate: "3px 0",
        },
        "75%": {
          translate: "-3px 0",
        },
        "100%": {
          translate: "0 0",
        },
      },
      "@keyframes toast-error-odd": {
        "0%": {
          translate: "0 0",
        },
        "25%": {
          translate: "-3px 0",
        },
        "50%": {
          translate: "3px 0",
        },
        "75%": {
          translate: "-3px 0",
        },
        "100%": {
          translate: "0 0",
        },
      },
      "@keyframes toast-success-even": {
        "0%": {
          scale: "1",
        },
        "30%": {
          scale: "1.025",
        },
        "60%": {
          scale: "0.99",
        },
        "100%": {
          scale: "1",
        },
      },
      "@keyframes toast-success-odd": {
        "0%": {
          scale: "1",
        },
        "30%": {
          scale: "1.025",
        },
        "60%": {
          scale: "0.99",
        },
        "100%": {
          scale: "1",
        },
      },
    },
    cssVars: {
      theme: {
        "--animate-toast-error-even":
          "toast-error-even 0.28s cubic-bezier(0.5, 1, 0.89, 1)",
        "--animate-toast-error-odd":
          "toast-error-odd 0.28s cubic-bezier(0.5, 1, 0.89, 1)",
        "--animate-toast-success-even":
          "toast-success-even 0.32s cubic-bezier(0.5, 1, 0.89, 1)",
        "--animate-toast-success-odd":
          "toast-success-odd 0.32s cubic-bezier(0.5, 1, 0.89, 1)",
      },
    },
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
    ],
    name: "toast",
    registryDependencies: ["@shaddercn/button"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
    name: "toggle",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "registry:ui",
      },
    ],
    name: "toggle-group",
    registryDependencies: ["@shaddercn/separator", "@shaddercn/toggle"],
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/toolbar.tsx",
        type: "registry:ui",
      },
    ],
    name: "toolbar",
    type: "registry:ui",
  },
  {
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
    name: "tooltip",
    type: "registry:ui",
  },
];
