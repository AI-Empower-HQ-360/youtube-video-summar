/**
 * @label Use Debounce Hook
 * @description Debounce value changes
 */

import { useState, useEffect } from 'react';

// ============================================
// HOOK
// ============================================

/**
 * @label Use Debounce Hook
 * @description Delay value updates for better performance
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up on value change or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
