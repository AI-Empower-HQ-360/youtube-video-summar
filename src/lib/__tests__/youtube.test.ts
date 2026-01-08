import { describe, it, expect } from 'vitest'
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube'

describe('YouTube utilities', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ')
    })

    it('should return null for invalid URLs', () => {
      expect(extractVideoId('https://example.com')).toBeNull()
      expect(extractVideoId('invalid')).toBeNull()
      expect(extractVideoId('')).toBeNull()
    })
  })

  describe('isValidYouTubeUrl', () => {
    it('should validate YouTube URLs', () => {
      expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
      expect(isValidYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidYouTubeUrl('https://example.com')).toBe(false)
      expect(isValidYouTubeUrl('invalid')).toBe(false)
      expect(isValidYouTubeUrl('')).toBe(false)
    })
  })
})
