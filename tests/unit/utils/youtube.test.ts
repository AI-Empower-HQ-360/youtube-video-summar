/**
 * @label Unit Tests - YouTube Utility Functions
 * @description Tests for YouTube URL parsing and validation
 */

import { describe, it, expect } from 'vitest';
import { extractVideoId, isValidYouTubeUrl } from '@/lib/youtube';
import { sampleVideos, invalidVideos } from '../../fixtures/videos';

describe('YouTube Utils', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard watch URL', () => {
      const url = sampleVideos.withCaptions.url;
      const result = extractVideoId(url);
      expect(result).toBe(sampleVideos.withCaptions.id);
    });

    it('should extract video ID from short URL', () => {
      const url = `https://youtu.be/${sampleVideos.withCaptions.id}`;
      const result = extractVideoId(url);
      expect(result).toBe(sampleVideos.withCaptions.id);
    });

    it('should extract video ID from embed URL', () => {
      const url = `https://www.youtube.com/embed/${sampleVideos.withCaptions.id}`;
      const result = extractVideoId(url);
      expect(result).toBe(sampleVideos.withCaptions.id);
    });

    it('should return null for invalid URL', () => {
      const result = extractVideoId(invalidVideos.invalidUrl.url);
      expect(result).toBeNull();
    });

    it('should handle URLs with additional parameters', () => {
      const url = `${sampleVideos.withCaptions.url}&t=10s&list=PLxxx`;
      const result = extractVideoId(url);
      expect(result).toBe(sampleVideos.withCaptions.id);
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      expect(isValidYouTubeUrl(sampleVideos.withCaptions.url)).toBe(true);
      expect(isValidYouTubeUrl(`https://youtu.be/${sampleVideos.withCaptions.id}`)).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidYouTubeUrl(invalidVideos.invalidUrl.url)).toBe(false);
      expect(isValidYouTubeUrl('https://vimeo.com/123456')).toBe(false);
      expect(isValidYouTubeUrl('')).toBe(false);
    });
  });
});
