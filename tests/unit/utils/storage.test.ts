/**
 * @label Unit Tests - Storage Utilities
 * @description Tests for localStorage and sessionStorage operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getItem, setItem, removeItem, clear, hasItem } from '@/utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('setItem', () => {
    it('should set string value', () => {
      setItem('key', 'value');
      expect(localStorage.getItem('key')).toBe('"value"');
    });

    it('should set object value', () => {
      const obj = { name: 'test', id: 123 };
      setItem('key', obj);
      
      const stored = localStorage.getItem('key');
      expect(JSON.parse(stored!)).toEqual(obj);
    });

    it('should set array value', () => {
      const arr = [1, 2, 3];
      setItem('key', arr);
      
      const stored = localStorage.getItem('key');
      expect(JSON.parse(stored!)).toEqual(arr);
    });

    it('should use sessionStorage when specified', () => {
      setItem('key', 'value', 'session');
      expect(sessionStorage.getItem('key')).toBeTruthy();
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should handle set errors gracefully', () => {
      // Mock quota exceeded error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setItem('key', 'value')).not.toThrow();
      setItemSpy.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should get string value', () => {
      localStorage.setItem('key', JSON.stringify('value'));
      expect(getItem('key')).toBe('value');
    });

    it('should get object value', () => {
      const obj = { name: 'test', id: 123 };
      localStorage.setItem('key', JSON.stringify(obj));
      expect(getItem('key')).toEqual(obj);
    });

    it('should get array value', () => {
      const arr = [1, 2, 3];
      localStorage.setItem('key', JSON.stringify(arr));
      expect(getItem('key')).toEqual(arr);
    });

    it('should return null for non-existent key', () => {
      expect(getItem('nonexistent')).toBeNull();
    });

    it('should use default value when key not found', () => {
      expect(getItem('nonexistent', 'default')).toBe('default');
    });

    it('should get from sessionStorage when specified', () => {
      sessionStorage.setItem('key', JSON.stringify('value'));
      expect(getItem('key', null, 'session')).toBe('value');
    });

    it('should handle parse errors gracefully', () => {
      localStorage.setItem('key', 'invalid json');
      expect(getItem('key', 'default')).toBe('default');
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('key', 'value');
      removeItem('key');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should remove item from sessionStorage', () => {
      sessionStorage.setItem('key', 'value');
      removeItem('key', 'session');
      expect(sessionStorage.getItem('key')).toBeNull();
    });

    it('should not throw for non-existent key', () => {
      expect(() => removeItem('nonexistent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all localStorage items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      clear();
      expect(localStorage.length).toBe(0);
    });

    it('should clear all sessionStorage items', () => {
      sessionStorage.setItem('key1', 'value1');
      sessionStorage.setItem('key2', 'value2');
      clear('session');
      expect(sessionStorage.length).toBe(0);
    });
  });

  describe('hasItem', () => {
    it('should return true for existing key', () => {
      localStorage.setItem('key', 'value');
      expect(hasItem('key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(hasItem('nonexistent')).toBe(false);
    });

    it('should check sessionStorage when specified', () => {
      sessionStorage.setItem('key', 'value');
      expect(hasItem('key', 'session')).toBe(true);
      expect(hasItem('key', 'local')).toBe(false);
    });
  });
});
