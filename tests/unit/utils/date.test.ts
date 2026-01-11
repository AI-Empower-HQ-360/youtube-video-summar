/**
 * @label Unit Tests - Date Utilities
 * @description Tests for date formatting and manipulation
 */

import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, formatDuration, isToday, isYesterday } from '@/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date to locale string', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle string input', () => {
      const formatted = formatDate('2024-01-15');
      
      expect(formatted).toBeTruthy();
    });

    it('should handle timestamp input', () => {
      const timestamp = Date.now();
      const formatted = formatDate(timestamp);
      
      expect(formatted).toBeTruthy();
    });

    it('should use custom format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
      
      expect(formatted).toContain('2024');
      expect(formatted).toContain('Jan');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent timestamps', () => {
      const now = Date.now();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('should format minutes ago', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format hours ago', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should format days ago', () => {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('should handle singular forms', () => {
      const oneMinuteAgo = Date.now() - 60 * 1000;
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(45)).toBe('0:45');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05');
    });

    it('should format hours, minutes and seconds', () => {
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('should pad with zeros', () => {
      expect(formatDuration(5)).toBe('0:05');
      expect(formatDuration(605)).toBe('10:05');
    });

    it('should handle zero', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const now = new Date();
      expect(isToday(now)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for today', () => {
      const now = new Date();
      expect(isYesterday(now)).toBe(false);
    });

    it('should return false for two days ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(isYesterday(twoDaysAgo)).toBe(false);
    });
  });
});
