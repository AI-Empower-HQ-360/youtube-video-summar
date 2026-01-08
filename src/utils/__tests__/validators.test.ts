import { describe, it, expect } from 'vitest'
import { 
  isValidYouTubeUrl, 
  isValidUrl, 
  isEmpty 
} from '../validators'

describe('validators', () => {
  describe('isValidYouTubeUrl', () => {
    it('should validate standard YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('http://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
    })

    it('should validate shortened YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('http://youtu.be/dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('youtu.be/dQw4w9WgXcQ')).toBe(true)
    })

    it('should validate embed YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidYouTubeUrl('https://google.com')).toBe(false)
      expect(isValidYouTubeUrl('not a url')).toBe(false)
      expect(isValidYouTubeUrl('')).toBe(false)
      expect(isValidYouTubeUrl('https://youtube.com/watch?v=invalid')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidYouTubeUrl(null as any)).toBe(false)
      expect(isValidYouTubeUrl(undefined as any)).toBe(false)
      expect(isValidYouTubeUrl(123 as any)).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://google.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://sub.domain.com/path')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('just text')).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should identify empty strings', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty('\n\t')).toBe(true)
    })

    it('should identify non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty('  hello  ')).toBe(false)
      expect(isEmpty('0')).toBe(false)
    })
  })
})
