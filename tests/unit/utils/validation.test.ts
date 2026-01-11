/**
 * @label Unit Tests - Validation Utilities
 * @description Tests for input validation functions
 */

import { describe, it, expect } from 'vitest';
import { isEmail, isUrl, isPhoneNumber, isEmpty, isAlphanumeric, isNumeric } from '@/utils/validation';

describe('Validation Utilities', () => {
  describe('isEmail', () => {
    it('should validate correct emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@example.co.uk')).toBe(true);
      expect(isEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isEmail('notanemail')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('test @example.com')).toBe(false);
      expect(isEmail('')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should validate correct URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('https://www.example.com/path')).toBe(true);
      expect(isUrl('https://example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('ftp://example.com')).toBe(false);
      expect(isUrl('example.com')).toBe(false);
      expect(isUrl('')).toBe(false);
    });

    it('should handle URLs with query params', () => {
      expect(isUrl('https://example.com?q=test')).toBe(true);
      expect(isUrl('https://example.com?q=test&page=1')).toBe(true);
    });

    it('should handle URLs with fragments', () => {
      expect(isUrl('https://example.com#section')).toBe(true);
      expect(isUrl('https://example.com/path#section')).toBe(true);
    });
  });

  describe('isPhoneNumber', () => {
    it('should validate US phone numbers', () => {
      expect(isPhoneNumber('(555) 123-4567')).toBe(true);
      expect(isPhoneNumber('555-123-4567')).toBe(true);
      expect(isPhoneNumber('5551234567')).toBe(true);
      expect(isPhoneNumber('+1 555 123 4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isPhoneNumber('123')).toBe(false);
      expect(isPhoneNumber('not-a-phone')).toBe(false);
      expect(isPhoneNumber('123-456')).toBe(false);
      expect(isPhoneNumber('')).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty('  text  ')).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });

    it('should handle arrays', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('should handle objects', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('test')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
      expect(isAlphanumeric('Test123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('test-123')).toBe(false);
      expect(isAlphanumeric('test 123')).toBe(false);
      expect(isAlphanumeric('test@123')).toBe(false);
      expect(isAlphanumeric('')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('12a3')).toBe(false);
      expect(isNumeric('12.34.56')).toBe(false);
      expect(isNumeric('')).toBe(false);
    });

    it('should handle numbers', () => {
      expect(isNumeric(123)).toBe(true);
      expect(isNumeric(0)).toBe(true);
      expect(isNumeric(-123.45)).toBe(true);
    });
  });
});
