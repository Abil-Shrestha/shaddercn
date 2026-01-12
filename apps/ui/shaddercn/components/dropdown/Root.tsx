"use client";

import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { DropdownContext } from "./context";
import type { DetailedAnimationConfig, DropdownRootProps } from "./types";

const defaultAnimationConfig: DetailedAnimationConfig = {
  contentBlur: 10,
  contentDamping: 36,
  contentDelay: 0.03,
  contentStiffness: 403,
  morphDamping: 29,
  morphStiffness: 382,
  triggerBlur: 8,
};

export function Root({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  animationConfig,
  closeOnClickOutside = true,
  closeOnEscape = true,
  modal = false,
  direction = "top",
  anchor: anchorProp = "start",
  visualDuration = 0.25,
  bounce = 0.2,
}: DropdownRootProps): ReactNode {
  // For horizontal directions (left/right), anchor is always center
  const anchor =
    direction === "left" || direction === "right" ? "center" : anchorProp;

  // Proper controlled/uncontrolled state management
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Track if open animation has completed (to prevent highlighting during animation)
  const isOpenAnimationCompleteRef = useRef(false);

  // Track active submenu (null = main menu visible)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Track submenu that is exiting (for animation coordination)
  const [exitingSubmenuId, setExitingSubmenuId] = useState<string | null>(null);

  // Wrapper to reset animation state when menu opens/closes
  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        // Disable hover highlighting until open animation completes
        isOpenAnimationCompleteRef.current = false;
      } else {
        // Reset submenu when menu closes
        setActiveSubmenu(null);
      }

      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  // Close on click outside
  useClickOutside(
    [triggerRef, contentRef],
    () => handleSetOpen(false),
    open && closeOnClickOutside,
  );

  // Close on escape
  useEscapeKey(() => handleSetOpen(false), open && closeOnEscape);

  // Merge animation config with defaults
  const mergedAnimationConfig = useMemo(
    () => ({
      ...defaultAnimationConfig,
      ...animationConfig,
    }),
    [animationConfig],
  );

  const contextValue = useMemo(
    () => ({
      activeSubmenu,
      anchor,
      animationConfig: mergedAnimationConfig,
      bounce,
      closeOnClickOutside,
      closeOnEscape,
      contentRef,
      direction,
      exitingSubmenuId,
      isOpenAnimationCompleteRef,
      modal,
      open,
      setActiveSubmenu,
      setExitingSubmenuId,
      setOpen: handleSetOpen,
      triggerRef,
      visualDuration,
    }),
    [
      open,
      handleSetOpen,
      mergedAnimationConfig,
      closeOnClickOutside,
      closeOnEscape,
      modal,
      direction,
      anchor,
      activeSubmenu,
      exitingSubmenuId,
      visualDuration,
      bounce,
    ],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
}
