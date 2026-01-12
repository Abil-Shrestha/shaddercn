"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useCallback } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDropdownContext } from "./context";
import type { DropdownContentProps } from "./types";

const reducedMotionSpring = {
  damping: 100,
  stiffness: 1000,
};

export function Content({
  children,
  className = "",
  style,
  onAnimationComplete,
}: DropdownContentProps): ReactNode {
  const {
    open,
    contentRef,
    animationConfig,
    isOpenAnimationCompleteRef,
    direction,
    visualDuration,
    bounce,
  } = useDropdownContext();

  const prefersReducedMotion = useReducedMotion();

  // Content uses slightly shorter duration
  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : {
        bounce,
        type: "spring" as const,
        visualDuration: visualDuration * 0.85,
      };

  // Animation offsets based on direction (toward trigger origin)
  const getOffset = (amount: number) => {
    switch (direction) {
      case "top":
        return { x: 0, y: amount };
      case "bottom":
        return { x: 0, y: -amount };
      case "left":
        return { x: amount, y: 0 };
      case "right":
        return { x: -amount, y: 0 };
    }
  };

  const hiddenOffset = getOffset(8);

  const contentVariants = {
    exit: {
      filter: prefersReducedMotion
        ? "blur(0px)"
        : `blur(${animationConfig.contentBlur}px)`,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
      x: 0,
      y: 0,
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      ...hiddenOffset,
      filter: prefersReducedMotion
        ? "blur(0px)"
        : `blur(${animationConfig.contentBlur}px)`,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      transition: {
        ...springConfig,
        delay: prefersReducedMotion ? 0 : animationConfig.contentDelay,
      },
      x: 0,
      y: 0,
    },
  };

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
    },
    [contentRef],
  );

  const handleAnimationComplete = useCallback(
    (definition: string) => {
      if (definition === "visible" && isOpenAnimationCompleteRef) {
        isOpenAnimationCompleteRef.current = true;
      }
      onAnimationComplete?.();
    },
    [isOpenAnimationCompleteRef, onAnimationComplete],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate="visible"
          className={className}
          exit="exit"
          initial="hidden"
          key="dropdown-content"
          onAnimationComplete={handleAnimationComplete}
          ref={setRef}
          role="menu"
          style={{ position: "relative", ...style }}
          transition={{
            ...springConfig,
            delay: prefersReducedMotion ? 0 : animationConfig.contentDelay,
          }}
          variants={contentVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
