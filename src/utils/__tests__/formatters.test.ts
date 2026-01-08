import { describe, it, expect } from 'vitest'
import { 
  formatDuration, 
  formatDate, 
  formatRelativeTime 
} from '../formatters'

describe('formatters', () => {
  describe('formatDuration', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatDuration(45)).toBe('0:45')
      expect(formatDuration(90)).toBe('1:30')
      expect(formatDuration(599)).toBe('9:59')
    })

    it('should format to HH:MM:SS when over an hour', () => {
      expect(formatDuration(3600)).toBe('1:00:00')
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(7200)).toBe('2:00:00')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(-10)).toBe('0:00')
      expect(formatDuration(null as any)).toBe('0:00')
    })

    it('should pad single digits correctly', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(3605)).toBe('1:00:05')
    })
  })

  describe('formatDate', () => {
    it('should format Date objects', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should format date strings', () => {
      const formatted = formatDate('2024-06-20')
      expect(formatted).toContain('June')
      expect(formatted).toContain('20')
      expect(formatted).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const now = new Date()
      const fiveSecsAgo = new Date(now.getTime() - 5000)
      const result = formatRelativeTime(fiveSecsAgo)
      expect(result).toMatch(/just now|seconds? ago/)
    })

    it('should format minutes ago', () => {
      const now = new Date()
      const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000)
      const result = formatRelativeTime(fiveMinsAgo)
      expect(result).toMatch(/\d+ minutes? ago/)
    })

    it('should format hours ago', () => {
      const now = new Date()
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
      const result = formatRelativeTime(twoHoursAgo)
      expect(result).toMatch(/\d+ hours? ago/)
    })
  })
})
