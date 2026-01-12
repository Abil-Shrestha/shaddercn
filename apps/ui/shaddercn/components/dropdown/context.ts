import { createContext, useContext } from "react";
import type {
  DropdownContextValue,
  DropdownSubMenuContextValue,
} from "./types";

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error(
      "Dropdown components must be used within a <Dropdown.Root> component",
    );
  }
  return context;
}

// SubMenu context for passing submenu id to children
export const SubMenuContext = createContext<DropdownSubMenuContextValue | null>(
  null,
);

export function useSubMenuContext(): DropdownSubMenuContextValue {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error(
      "SubMenu components must be used within a <Dropdown.SubMenu> component",
    );
  }
  return context;
}
