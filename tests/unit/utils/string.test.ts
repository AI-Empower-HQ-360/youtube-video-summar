/**
 * @label Unit Tests - String Utilities
 * @description Tests for string manipulation functions
 */

import { describe, it, expect } from 'vitest';
import { truncate, slugify, capitalize, toCamelCase, toKebabCase, toTitleCase } from '@/utils/string';

describe('String Utilities', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long string that needs to be truncated';
      expect(truncate(text, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short strings', () => {
      const text = 'Short text';
      expect(truncate(text, 20)).toBe('Short text');
    });

    it('should handle custom ellipsis', () => {
      const text = 'This is a long string';
      expect(truncate(text, 10, '…')).toBe('This is a…');
    });

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should remove trailing/leading spaces', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should handle numbers', () => {
      expect(slugify('Test 123 abc')).toBe('test-123-abc');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should not change other letters', () => {
      expect(capitalize('hello WORLD')).toBe('Hello WORLD');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle spaces', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should handle multiple words', () => {
      expect(toCamelCase('hello-beautiful-world')).toBe('helloBeautifulWorld');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('should handle spaces', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('should handle uppercase', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should handle multiple words', () => {
      expect(toKebabCase('helloBeautifulWorld')).toBe('hello-beautiful-world');
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize each word', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle already capitalized text', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });

    it('should handle mixed case', () => {
      expect(toTitleCase('hELLo wORLD')).toBe('Hello World');
    });
  });
});
