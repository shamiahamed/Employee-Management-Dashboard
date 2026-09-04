import { useEffect, useState } from "react";

/**
 * Returns a debounced version of the given value.
 * Updates only after the specified delay has elapsed since the last change.
 *
 * @param {*} value - The value to debounce.
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms).
 * @returns {*} The debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
