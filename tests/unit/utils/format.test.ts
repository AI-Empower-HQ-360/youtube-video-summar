/**
 * @label Unit Tests - Format Utilities
 * @description Tests for number and text formatting
 */

import { describe, it, expect } from 'vitest';
import { formatNumber, formatBytes, formatPercentage, formatCurrency } from '@/utils/format';

describe('Format Utilities', () => {
  describe('formatNumber', () => {
    it('should format numbers with thousands separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should handle decimals', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234');
    });

    it('should use custom decimal places', () => {
      expect(formatNumber(1234.5678, 1)).toBe('1,234.6');
      expect(formatNumber(1234.5678, 3)).toBe('1,234.568');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(2097152)).toBe('2 MB');
    });

    it('should format gigabytes', () => {
      expect(formatBytes(1073741824)).toBe('1 GB');
      expect(formatBytes(2147483648)).toBe('2 GB');
    });

    it('should format terabytes', () => {
      expect(formatBytes(1099511627776)).toBe('1 TB');
    });

    it('should use custom decimal places', () => {
      expect(formatBytes(1536, 2)).toBe('1.50 KB');
      expect(formatBytes(1536, 0)).toBe('2 KB');
    });
  });

  describe('formatPercentage', () => {
    it('should format decimals as percentages', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.75)).toBe('75%');
      expect(formatPercentage(1)).toBe('100%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0%');
    });

    it('should use custom decimal places', () => {
      expect(formatPercentage(0.12345, 2)).toBe('12.35%');
      expect(formatPercentage(0.12345, 1)).toBe('12.3%');
    });

    it('should handle values over 1', () => {
      expect(formatPercentage(1.5)).toBe('150%');
    });

    it('should handle negative values', () => {
      expect(formatPercentage(-0.25)).toBe('-25%');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should format different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
    });

    it('should handle large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(1234.567)).toBe('$1,234.57');
      expect(formatCurrency(1234.563)).toBe('$1,234.56');
    });
  });
});
