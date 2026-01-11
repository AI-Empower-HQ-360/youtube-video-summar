/**
 * @label Storage Utilities
 * @description localStorage and sessionStorage management utilities
 */

type StorageType = 'local' | 'session';

/**
 * @label Get Storage
 * @description Get the appropriate storage object
 */
function getStorage(type: StorageType = 'local'): Storage {
  return type === 'session' ? sessionStorage : localStorage;
}

/**
 * @label Set Item
 * @description Store value in storage with JSON serialization
 */
export function setItem<T>(key: string, value: T, type: StorageType = 'local'): void {
  try {
    const storage = getStorage(type);
    const serialized = JSON.stringify(value);
    storage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting storage item "${key}":`, error);
  }
}

/**
 * @label Get Item
 * @description Retrieve and parse value from storage
 */
export function getItem<T>(
  key: string,
  defaultValue: T | null = null,
  type: StorageType = 'local'
): T | null {
  try {
    const storage = getStorage(type);
    const item = storage.getItem(key);
    
    if (item === null) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting storage item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * @label Remove Item
 * @description Remove item from storage
 */
export function removeItem(key: string, type: StorageType = 'local'): void {
  try {
    const storage = getStorage(type);
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item "${key}":`, error);
  }
}

/**
 * @label Clear Storage
 * @description Clear all items from storage
 */
export function clear(type: StorageType = 'local'): void {
  try {
    const storage = getStorage(type);
    storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

/**
 * @label Has Item
 * @description Check if key exists in storage
 */
export function hasItem(key: string, type: StorageType = 'local'): boolean {
  try {
    const storage = getStorage(type);
    return storage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking storage item "${key}":`, error);
    return false;
  }
}
