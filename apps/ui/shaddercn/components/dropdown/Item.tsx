"use client";

import { type ReactNode, useContext } from "react";
import { cn } from "@/registry/default/lib/utils";
import { SubMenuContext, useDropdownContext } from "./context";
import type { DropdownItemProps } from "./types";

export function Item({
  children,
  onSelect,
  disabled = false,
  closeOnSelect = true,
  className = "",
  style,
}: DropdownItemProps): ReactNode {
  const { setOpen, activeSubmenu, setActiveSubmenu, visualDuration } =
    useDropdownContext();
  const subMenuContext = useContext(SubMenuContext);

  // Only dim if there's an active submenu AND this item is NOT inside that submenu
  const isInsideActiveSubmenu =
    subMenuContext && activeSubmenu === subMenuContext.id;
  const shouldDim = activeSubmenu !== null && !isInsideActiveSubmenu;

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
    if (closeOnSelect) {
      // If inside a submenu, first close submenu, then close menu with delay
      if (isInsideActiveSubmenu) {
        setActiveSubmenu(null);
        // Delay closing the main menu to allow submenu exit animation
        setTimeout(() => {
          setOpen(false);
        }, visualDuration * 500); // Half the animation duration
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <div
      aria-disabled={disabled || undefined}
      className={cn(
        "[&>svg]:-mx-0.5 flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground [&>svg]:pointer-events-none [&>svg]:shrink-0",
        disabled && "pointer-events-none cursor-default opacity-50",
        className,
      )}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="menuitem"
      style={{
        opacity: shouldDim ? 0.5 : 1,
        transition: "opacity 0.2s",
        ...style,
      }}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
}
