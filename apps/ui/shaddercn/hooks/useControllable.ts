import { useCallback, useEffect, useRef, useState } from "react";

interface UseControllableProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllable<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableProps<T>): [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  // Track if we're in controlled mode to warn about switching
  const wasControlled = useRef(isControlled);

  useEffect(() => {
    if (wasControlled.current !== isControlled) {
      console.warn(
        "Shaddercn Dropdown: A component is changing from",
        wasControlled.current ? "controlled" : "uncontrolled",
        "to",
        isControlled ? "controlled" : "uncontrolled",
        ". This is likely a bug.",
      );
    }
    wasControlled.current = isControlled;
  }, [isControlled]);

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}
