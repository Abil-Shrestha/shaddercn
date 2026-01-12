"use client";

import { AnimatePresence, motion, usePresence } from "framer-motion";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDropdownContext, useSubMenuContext } from "./context";
import type { DropdownSubMenuContentProps } from "./types";

const reducedMotionSpring = {
  damping: 100,
  stiffness: 1000,
};

const CONTENT_BLUR = 10;

export function SubMenuContent({
  children,
  className = "",
  style,
}: DropdownSubMenuContentProps): ReactNode {
  const {
    activeSubmenu,
    setActiveSubmenu,
    contentRef: mainContentRef,
    visualDuration,
    bounce,
    setExitingSubmenuId,
  } = useDropdownContext();
  const { id, triggerRef } = useSubMenuContext();
  const prefersReducedMotion = useReducedMotion();
  const subMenuRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [isPresent, _safeToRemove] = usePresence();

  // Trigger measurements
  const [triggerTop, setTriggerTop] = useState(0);
  const [triggerHeight, setTriggerHeight] = useState(44);

  // Content measurements (includes trigger height spacer + items)
  const [contentHeight, setContentHeight] = useState(triggerHeight);

  const isActive = activeSubmenu === id;

  // Measure trigger dimensions when submenu opens
  useLayoutEffect(() => {
    if (isActive && triggerRef.current) {
      setTriggerTop(triggerRef.current.offsetTop);
      setTriggerHeight(triggerRef.current.offsetHeight);
    }
  }, [isActive, triggerRef]);

  // Measure content height (spacer + items)
  useLayoutEffect(() => {
    if (isActive && measureRef.current) {
      // Force a slight delay to ensure DOM is fully rendered
      const height = measureRef.current.offsetHeight;
      setContentHeight(height);
    }
  }, [isActive]);

  // Track exit state with presence API
  useEffect(() => {
    if (isActive && isPresent) {
      // Submenu is active and present
      setExitingSubmenuId(null);
    } else if (!isPresent && isActive === false) {
      // Exit animation starting
      setExitingSubmenuId(id);
    }
  }, [isActive, isPresent, id, setExitingSubmenuId]);

  // Handle click outside to close submenu (but not main menu)
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // If clicking inside the submenu content, do nothing
      if (subMenuRef.current?.contains(target)) {
        return;
      }

      // If clicking on the trigger, let SubMenuTrigger handle it (toggle behavior)
      if (triggerRef.current?.contains(target)) {
        return;
      }

      // If clicking inside the main menu container, just close the submenu
      if (mainContentRef.current?.contains(target)) {
        event.stopPropagation();
        setActiveSubmenu(null);
        return;
      }

      // If clicking completely outside, close the submenu
      setActiveSubmenu(null);
    };

    // Delay adding listener to avoid immediate close from trigger click
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isActive, setActiveSubmenu, mainContentRef, triggerRef]);

  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { bounce, type: "spring" as const, visualDuration };

  const contentSpringConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : {
        bounce,
        type: "spring" as const,
        visualDuration: visualDuration * 0.85,
      };

  // Content fade-in animation (like main menu content)
  const contentVariants = {
    exit: {
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
      opacity: 0,
      transition: contentSpringConfig,
    },
    hidden: {
      filter: prefersReducedMotion ? "blur(0px)" : `blur(${CONTENT_BLUR}px)`,
      opacity: 0,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      transition: {
        ...contentSpringConfig,
        delay: 0.05,
      },
    },
  };

  // Scale to pop forward to 1.06 visual (Container is at 0.96, so 0.96 * 1.104 ≈ 1.06)
  const openScale = 1.06 / 0.96; // ≈ 1.104

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          animate={{
            filter: "blur(0px)",
            height: contentHeight,
            opacity: 1,
            pointerEvents: "auto" as const,
            scale: openScale,
          }}
          className={className}
          exit={{
            filter: prefersReducedMotion
              ? "blur(0px)"
              : `blur(${CONTENT_BLUR}px)`,
            height: triggerHeight,
            opacity: 0,
            pointerEvents: "none" as const,
            scale: 1,
          }}
          initial={{
            filter: prefersReducedMotion
              ? "blur(0px)"
              : `blur(${CONTENT_BLUR}px)`,
            height: triggerHeight,
            opacity: 1,
            pointerEvents: "auto" as const,
            scale: 1,
          }}
          ref={subMenuRef}
          style={{
            ...style,
            boxSizing: "content-box",
            left: 0,
            overflow: "hidden",
            position: "absolute",
            right: 0,
            top: triggerTop,
            transformOrigin: "top center",
            willChange: "transform, height, opacity",
            zIndex: 10,
          }}
          transition={springConfig}
        >
          {/* Inner wrapper for measuring natural height */}
          <div ref={measureRef}>
            {/* Spacer - SubMenuTrigger appears here visually via z-index stacking */}
            <div aria-hidden="true" style={{ height: triggerHeight }} />

            {/* Content with fade-in animation */}
            <motion.div
              animate="visible"
              exit="exit"
              initial="hidden"
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
