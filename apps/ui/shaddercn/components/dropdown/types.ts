import type { CSSProperties, ReactNode } from "react";

// Direction the menu expands from trigger
export type Direction = "top" | "bottom" | "left" | "right";

// Anchor point alignment
export type Anchor = "start" | "center" | "end";

// Detailed animation configuration
export interface DetailedAnimationConfig {
  /** Spring stiffness for shape morph */
  morphStiffness?: number;
  /** Spring damping for shape morph */
  morphDamping?: number;
  /** Spring stiffness for content fade */
  contentStiffness?: number;
  /** Spring damping for content fade */
  contentDamping?: number;
  /** Delay before content appears (seconds) */
  contentDelay?: number;
  /** Scale when content is hidden */
  contentScale?: number;
  /** Blur amount for trigger icon (px) */
  triggerBlur?: number;
  /** Blur amount for content (px) */
  contentBlur?: number;
}

// Root component props
export interface DropdownRootProps {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Detailed animation configuration (overrides preset) */
  animationConfig?: DetailedAnimationConfig;
  /** Close when clicking outside the menu */
  closeOnClickOutside?: boolean;
  /** Close when pressing Escape key */
  closeOnEscape?: boolean;
  /** Enable modal behavior with focus trapping */
  modal?: boolean;
  /** Direction the menu expands from trigger */
  direction?: Direction;
  /** Anchor point alignment */
  anchor?: Anchor;
  /** Spring animation duration in seconds (default: 0.3) */
  visualDuration?: number;
  /** Spring animation bounce (default: 0.2) */
  bounce?: number;
}

// Container component props
export interface DropdownContainerProps {
  children: ReactNode;
  /** Size of the closed button state - number for square, or { width, height } for rectangular */
  buttonSize?: number | { width: number; height: number };
  /** Fixed width when open (if not set, sizes to content) */
  menuWidth?: number;
  /** Border radius of the open menu state */
  menuRadius?: number;
  /** Border radius of the closed button state (defaults to pill shape) */
  buttonRadius?: number;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

// Trigger component props
export interface DropdownTriggerProps {
  children: ReactNode;
  /** Disable the trigger */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

// Content component props
export interface DropdownContentProps {
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Callback when content animation completes */
  onAnimationComplete?: () => void;
}

// Item component props
export interface DropdownItemProps {
  children: ReactNode;
  /** Called when item is selected */
  onSelect?: () => void;
  /** Disable the item */
  disabled?: boolean;
  /** Close menu after selection */
  closeOnSelect?: boolean;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

// SubMenu component props
export interface DropdownSubMenuProps {
  children: React.ReactNode;
  /** Unique identifier for this submenu */
  id: string;
}

// SubMenuTrigger component props
export interface DropdownSubMenuTriggerProps {
  /** Static children or render prop receiving isActive state */
  children: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Disable the trigger */
  disabled?: boolean;
}

// SubMenuContent component props
export interface DropdownSubMenuContentProps {
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

// Internal context state
export interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  animationConfig: DetailedAnimationConfig;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  modal: boolean;
  /** Track if open animation has completed (for hover highlighting) */
  isOpenAnimationCompleteRef: React.MutableRefObject<boolean>;
  /** Direction the menu expands from trigger */
  direction: Direction;
  /** Anchor point alignment */
  anchor: Anchor;
  /** Currently active submenu ID (null = main menu) */
  activeSubmenu: string | null;
  /** Set the active submenu */
  setActiveSubmenu: (id: string | null) => void;
  /** Submenu ID that is currently exiting (for coordinating animations) */
  exitingSubmenuId: string | null;
  /** Set the exiting submenu ID */
  setExitingSubmenuId: (id: string | null) => void;
  /** Spring animation duration in seconds */
  visualDuration: number;
  /** Spring animation bounce */
  bounce: number;
}

// SubMenu context value (for SubMenuTrigger/SubMenuContent)
export interface DropdownSubMenuContextValue {
  id: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}
