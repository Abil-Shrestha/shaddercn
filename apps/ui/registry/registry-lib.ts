import type { Registry } from "shadcn/schema";

export const lib: Registry["items"] = [
  {
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "lib/segmented-control.ts",
        type: "registry:lib",
      },
    ],
    name: "segmented-control",
    type: "registry:lib",
  },
  {
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
    name: "utils",
    type: "registry:lib",
  },
];
