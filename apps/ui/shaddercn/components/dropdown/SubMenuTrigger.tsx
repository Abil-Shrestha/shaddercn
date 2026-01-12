"use client";

import { motion } from "framer-motion";
import { type ReactNode, useCallback } from "react";
import { cn } from "@/registry/default/lib/utils";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDropdownContext, useSubMenuContext } from "./context";
import type { DropdownSubMenuTriggerProps } from "./types";

const reducedMotionSpring = {
  damping: 100,
  stiffness: 1000,
};

export function SubMenuTrigger({
  children,
  className = "",
  style,
  disabled = false,
}: DropdownSubMenuTriggerProps): ReactNode {
  const {
    setActiveSubmenu,
    activeSubmenu,
    exitingSubmenuId,
    visualDuration,
    bounce,
  } = useDropdownContext();
  const { id, triggerRef } = useSubMenuContext();
  const prefersReducedMotion = useReducedMotion();

  const isActive = activeSubmenu === id;
  // Keep elevated during exit animation
  const isElevated = isActive || id === exitingSubmenuId;

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { bounce, type: "spring" as const, visualDuration };

  // Scale to pop forward to 1.06 visual (Container is at 0.96, so 0.96 * 1.104 ≈ 1.06)
  const openScale = 1.06 / 0.96; // ≈ 1.104

  // Toggle submenu on click
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) {
        setActiveSubmenu(isActive ? null : id);
      }
    },
    [disabled, setActiveSubmenu, id, isActive],
  );

  // Support render prop for dynamic children based on isActive
  const content =
    typeof children === "function" ? children(isActive) : children;

  // Don't use Base UI Menu.Item for submenu trigger - it causes the menu to close
  // Instead use a regular div with proper ARIA attributes
  return (
    <motion.div
      animate={{
        scale: isActive ? openScale : 1,
      }}
      aria-disabled={disabled || undefined}
      aria-expanded={isActive}
      aria-haspopup="menu"
      className={cn(
        "[&>svg]:-mx-0.5 flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:shrink-0",
        className,
      )}
      data-active={isActive || undefined}
      data-elevated={isElevated || undefined}
      initial={false}
      onClick={handleClick}
      ref={triggerRef}
      role="menuitem"
      style={{
        ...style,
        // Z-index stays elevated during exit animation (uses delayed isElevated)
        position: "relative",
        transformOrigin: "center center",
        userSelect: "none",
        zIndex: isElevated ? 20 : undefined,
      }}
      tabIndex={disabled ? -1 : 0}
      transition={springConfig}
    >
      {content}
    </motion.div>
  );
}
