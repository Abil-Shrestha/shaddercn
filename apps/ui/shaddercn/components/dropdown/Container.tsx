"use client";

import { motion } from "framer-motion";
import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDropdownContext } from "./context";
import type { Anchor, Direction, DropdownContainerProps } from "./types";

const reducedMotionSpring = {
  damping: 100,
  stiffness: 1000,
};

// Calculate base position styles based on direction (trigger stays fixed)
function getPositionStyles(direction: Direction): CSSProperties {
  const styles: CSSProperties = {
    position: "absolute",
  };

  // Direction determines which edge the trigger anchors to
  switch (direction) {
    case "top":
      styles.bottom = 0;
      styles.left = 0;
      break;
    case "bottom":
      styles.top = 0;
      styles.left = 0;
      break;
    case "left":
      styles.right = 0;
      styles.bottom = 0;
      break;
    case "right":
      styles.left = 0;
      styles.bottom = 0;
      break;
  }

  return styles;
}

// Calculate anchor offset (applied when open to shift menu alignment)
function getAnchorOffset(
  direction: Direction,
  anchor: Anchor,
  menuWidth: number,
  menuHeight: number,
  buttonWidth: number,
  buttonHeight: number,
) {
  if (anchor === "start") {
    return { x: 0, y: 0 };
  }

  const offsetAmount = anchor === "center" ? 0.5 : 1;

  if (direction === "top" || direction === "bottom") {
    // Horizontal offset for vertical menus
    const xOffset = -(menuWidth - buttonWidth) * offsetAmount;
    return { x: xOffset, y: 0 };
  }
  // Vertical offset for horizontal menus
  const yOffset = (menuHeight - buttonHeight) * offsetAmount;
  return { x: 0, y: yOffset };
}

// Calculate transform origin based on direction and anchor
function getTransformOrigin(direction: Direction, anchor: Anchor): string {
  const vertical =
    direction === "top" ? "bottom" : direction === "bottom" ? "top" : "center";
  const horizontal =
    direction === "left" ? "right" : direction === "right" ? "left" : "center";

  if (direction === "top" || direction === "bottom") {
    const h =
      anchor === "start" ? "left" : anchor === "end" ? "right" : "center";
    return `${h} ${vertical}`;
  }
  const v = anchor === "start" ? "bottom" : anchor === "end" ? "top" : "center";
  return `${horizontal} ${v}`;
}

// Calculate animation offset based on direction
function getAnimationOffset(direction: Direction, amount: number) {
  switch (direction) {
    case "top":
      return { y: -amount };
    case "bottom":
      return { y: amount };
    case "left":
      return { x: -amount };
    case "right":
      return { x: amount };
  }
}

export function Container({
  children,
  buttonSize = 40,
  menuWidth = 200,
  menuRadius = 24,
  buttonRadius,
  className = "",
  style,
}: DropdownContainerProps): ReactNode {
  const {
    open,
    setOpen,
    direction,
    anchor,
    activeSubmenu,
    exitingSubmenuId,
    visualDuration,
    bounce,
  } = useDropdownContext();
  const prefersReducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Button dimensions from prop (supports number or { width, height })
  const buttonWidth =
    typeof buttonSize === "number" ? buttonSize : buttonSize.width;
  const buttonHeight =
    typeof buttonSize === "number" ? buttonSize : buttonSize.height;
  const [measuredHeight, setMeasuredHeight] = useState<number>(buttonHeight);

  // Submenu styles active when submenu is open OR exiting
  const submenuStylesActive =
    activeSubmenu !== null || exitingSubmenuId !== null;

  // Use spring config for animations (reduced motion aware)
  const springConfig = prefersReducedMotion
    ? { type: "spring" as const, ...reducedMotionSpring }
    : { bounce, type: "spring" as const, visualDuration };

  // Measure the inner wrapper's natural height when open
  useLayoutEffect(() => {
    if (open && measureRef.current) {
      const height = measureRef.current.offsetHeight;
      setMeasuredHeight(height);
    }
  }, [open]);

  // Capture open state at pointerdown, before Base UI can change it
  const wasOpenRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    wasOpenRef.current = open;
  }, [open]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      // Only open if menu was closed when pointer went down
      if (!open && !wasOpenRef.current) {
        event.preventDefault();
        setOpen(true);
      }
    },
    [open, setOpen],
  );

  // Default to pill shape (half of smaller dimension)
  const closedRadius = buttonRadius ?? Math.min(buttonWidth, buttonHeight) / 2;
  const positionStyles = getPositionStyles(direction);
  const transformOrigin = getTransformOrigin(direction, anchor);
  // Lift amount is 75% of button height
  const liftAmount = buttonHeight * 0.75;
  const directionOffset = getAnimationOffset(direction, liftAmount);
  const anchorOffset = getAnchorOffset(
    direction,
    anchor,
    menuWidth,
    measuredHeight,
    buttonWidth,
    buttonHeight,
  );

  // Combine direction offset (lift) with anchor offset (alignment shift)
  const openOffset = {
    x: (directionOffset.x || 0) + anchorOffset.x,
    y: (directionOffset.y || 0) + anchorOffset.y,
  };

  return (
    <div
      style={{
        height: buttonHeight,
        position: "relative",
        width: buttonWidth,
      }}
    >
      <motion.div
        animate={{
          borderRadius: open ? menuRadius : closedRadius,
          boxShadow: open
            ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          height: open ? measuredHeight : buttonHeight,
          scale: activeSubmenu ? 0.96 : 1,
          width: open ? menuWidth : buttonWidth,
          x: open ? openOffset.x : 0,
          y: open ? openOffset.y : 0,
        }}
        className={className}
        initial={false}
        onClick={handleClick}
        onPointerDownCapture={handlePointerDown}
        ref={contentRef}
        style={{
          ...positionStyles,
          cursor: open ? "default" : "pointer",
          overflow: open && submenuStylesActive ? "visible" : "hidden",
          // Scale from center when submenu is active (and during exit animation)
          transformOrigin: submenuStylesActive
            ? "center center"
            : transformOrigin,
          willChange: "transform",
          zIndex: open ? 50 : "auto",
          ...style,
        }}
        transition={{
          ...springConfig,
        }}
      >
        {/* Inner wrapper for accurate height measurement */}
        <div ref={measureRef}>{children}</div>
      </motion.div>
    </div>
  );
}
