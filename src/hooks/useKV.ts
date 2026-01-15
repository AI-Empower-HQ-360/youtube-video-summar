/**
 * @label useKV Hook
 * @description Custom hook for persistent key-value storage with localStorage fallback
 * 
 * This provides a compatible API with GitHub Spark's useKV hook but works
 * in any environment by using localStorage as the storage backend.
 */

import { useState, useEffect, useCallback } from 'react';

type SetValueFunction<T> = (value: T | ((prev: T) => T)) => void;

/**
 * @label useKV
 * @description Persistent key-value storage hook with localStorage backend
 */
export function useKV<T>(key: string, initialValue: T): [T, SetValueFunction<T>] {
  // Get initial value from localStorage or use provided default
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when value changes
  const setValue: SetValueFunction<T> = useCallback((value) => {
    try {
      // Allow value to be a function for functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useKV;
