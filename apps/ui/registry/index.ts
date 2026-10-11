import type { Registry } from "shadcn/schema";

import { baseUi } from "@/registry/registry-base-ui";
import { hooks } from "@/registry/registry-hooks";
import { lib } from "@/registry/registry-lib";
import { particles } from "@/registry/registry-particles";
import { styles } from "@/registry/registry-styles";
import { ui } from "@/registry/registry-ui";

export const registry = {
  homepage: "https://ui.shadcn.com",
  items: [...ui, ...particles, ...styles, ...lib, ...baseUi, ...hooks],
  name: "shadcn/ui",
} satisfies Registry;
