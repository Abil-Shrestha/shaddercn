import { type RefObject, useEffect } from "react";

export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      // Check if click is outside all provided refs
      const isOutside = refs.every((ref) => {
        return !ref.current || !ref.current.contains(target);
      });

      if (isOutside) {
        handler();
      }
    }

    // Use mousedown for immediate response
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [refs, handler, enabled]);
}
