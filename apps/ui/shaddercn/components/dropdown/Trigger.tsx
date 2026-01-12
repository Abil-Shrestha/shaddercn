"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDropdownContext } from "./context";
import type { DropdownTriggerProps } from "./types";

const reducedMotionSpring = {
  damping: 100,
  stiffness: 1000,
};

export function Trigger({
  children,
  disabled = false,
  className = "",
  style,
}: DropdownTriggerProps): ReactNode {
  const { open, triggerRef, animationConfig, visualDuration, bounce } =
    useDropdownContext();
  const prefersReducedMotion = useReducedMotion();

  // Trigger uses slightly shorter duration (same as content)
  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : {
        bounce,
        type: "spring" as const,
        visualDuration: visualDuration * 0.85,
      };

  const triggerContentVariants = {
    hidden: {
      filter: prefersReducedMotion
        ? "blur(0px)"
        : `blur(${animationConfig.triggerBlur}px)`,
      opacity: 0,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
    },
  };

  return (
    <AnimatePresence initial={false}>
      {!open && (
        <motion.div
          animate="visible"
          aria-disabled={disabled || undefined}
          className={className}
          exit="hidden"
          initial="hidden"
          key="trigger-icon"
          layout={false}
          ref={triggerRef}
          style={{
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
            ...style,
          }}
          transition={springConfig}
          variants={triggerContentVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
