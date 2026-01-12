import { Container } from "./Container";
import { Content } from "./Content";
import { Item } from "./Item";
import { Root } from "./Root";
import { SubMenu } from "./SubMenu";
import { SubMenuContent } from "./SubMenuContent";
import { SubMenuTrigger } from "./SubMenuTrigger";
import { Trigger } from "./Trigger";

// Compound component export (primary API)
export const Dropdown = {
  Container,
  Content,
  Item,
  Root,
  SubMenu,
  SubMenuContent,
  SubMenuTrigger,
  Trigger,
};

// Individual component exports
export {
  Root,
  Container,
  Trigger,
  Content,
  Item,
  SubMenu,
  SubMenuTrigger,
  SubMenuContent,
};

export { useClickOutside } from "../../hooks/useClickOutside";
export { useControllable } from "../../hooks/useControllable";
export { useEscapeKey } from "../../hooks/useEscapeKey";
export { useReducedMotion } from "../../hooks/useReducedMotion";
// Hook exports (for advanced usage)
export { useDropdownContext } from "./context";

// Type exports
export type {
  Anchor,
  DetailedAnimationConfig,
  Direction,
  DropdownContainerProps,
  DropdownContentProps,
  DropdownItemProps,
  DropdownRootProps,
  DropdownSubMenuContentProps,
  DropdownSubMenuProps,
  DropdownSubMenuTriggerProps,
  DropdownTriggerProps,
} from "./types";
