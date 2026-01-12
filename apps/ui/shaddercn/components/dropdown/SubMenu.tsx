"use client";

import { type ReactNode, useMemo, useRef } from "react";
import { SubMenuContext } from "./context";
import type { DropdownSubMenuProps } from "./types";

export function SubMenu({ children, id }: DropdownSubMenuProps): ReactNode {
  const triggerRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo(() => ({ id, triggerRef }), [id]);

  return (
    <SubMenuContext.Provider value={contextValue}>
      {children}
    </SubMenuContext.Provider>
  );
}
