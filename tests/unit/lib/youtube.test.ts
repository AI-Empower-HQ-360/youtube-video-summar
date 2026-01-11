/**
 * @label Unit Tests - YouTube AI Library
 * @description Tests for YouTube AI integration functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractVideoId, isValidYouTubeUrl, getVideoTranscript, getVideoInfo } from '@/lib/youtube';
import { sampleVideos } from '../../fixtures/videos';

// Mock fetch globally
global.fetch = vi.fn();

describe('YouTube Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractVideoId', () => {
    it('should extract ID from standard watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from v/ URL', () => {
      const url = 'https://www.youtube.com/v/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should handle URLs with parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s&list=PLxxx';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URLs', () => {
      expect(extractVideoId('not-a-url')).toBeNull();
      expect(extractVideoId('https://vimeo.com/123456')).toBeNull();
      expect(extractVideoId('')).toBeNull();
    });

    it('should handle malformed YouTube URLs', () => {
      expect(extractVideoId('https://www.youtube.com/')).toBeNull();
      expect(extractVideoId('https://www.youtube.com/watch')).toBeNull();
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidYouTubeUrl('not-a-url')).toBe(false);
      expect(isValidYouTubeUrl('https://vimeo.com/123456')).toBe(false);
      expect(isValidYouTubeUrl('')).toBe(false);
      expect(isValidYouTubeUrl('https://www.youtube.com/')).toBe(false);
    });
  });

  describe('getVideoTranscript', () => {
    it('should fetch transcript successfully', async () => {
      const mockHtml = `
        <html>
          <body>
            <script>"captions":{"playerCaptionsTracklistRenderer":{"captionTracks":[{"baseUrl":"https://example.com/transcript.xml"}]}}</script>
          </body>
        </html>
      `;

      const mockTranscriptXml = `
        <?xml version="1.0" encoding="utf-8" ?>
        <transcript>
          <text start="0" dur="2.5">Hello world</text>
          <text start="2.5" dur="2.5">This is a test</text>
        </transcript>
      `;

      (global.fetch as any)
        .mockResolvedValueOnce({ text: () => Promise.resolve(mockHtml) })
        .mockResolvedValueOnce({ text: () => Promise.resolve(mockTranscriptXml) });

      const transcript = await getVideoTranscript('dQw4w9WgXcQ');

      expect(transcript).toContain('Hello world');
      expect(transcript).toContain('This is a test');
    });

    it('should throw error when captions not found', async () => {
      const mockHtml = '<html><body>No captions here</body></html>';
      (global.fetch as any).mockResolvedValue({ text: () => Promise.resolve(mockHtml) });

      await expect(getVideoTranscript('test123')).rejects.toThrow('No captions found');
    });

    it('should decode HTML entities', async () => {
      const mockHtml = `
        <html>"captions":{"playerCaptionsTracklistRenderer":{"captionTracks":[{"baseUrl":"https://example.com/transcript.xml"}]}}</html>
      `;

      const mockTranscriptXml = `
        <transcript>
          <text>Test &amp; test &quot;quotes&quot; &lt;tag&gt;</text>
        </transcript>
      `;

      (global.fetch as any)
        .mockResolvedValueOnce({ text: () => Promise.resolve(mockHtml) })
        .mockResolvedValueOnce({ text: () => Promise.resolve(mockTranscriptXml) });

      const transcript = await getVideoTranscript('test123');

      expect(transcript).toContain('&');
      expect(transcript).toContain('"');
      expect(transcript).toContain('<');
      expect(transcript).toContain('>');
    });
  });

  describe('getVideoInfo', () => {
    it('should fetch video metadata', async () => {
      const mockHtml = `
        <html>
          <head><title>Test Video - YouTube</title></head>
          <body></body>
        </html>
      `;

      (global.fetch as any).mockResolvedValue({ text: () => Promise.resolve(mockHtml) });

      const info = await getVideoInfo('dQw4w9WgXcQ');

      expect(info).toHaveProperty('title');
      expect(info).toHaveProperty('thumbnail');
      expect(info.title).toBe('Test Video');
      expect(info.thumbnail).toContain('dQw4w9WgXcQ');
    });

    it('should handle missing title', async () => {
      const mockHtml = '<html><body>No title</body></html>';
      (global.fetch as any).mockResolvedValue({ text: () => Promise.resolve(mockHtml) });

      const info = await getVideoInfo('test123');

      expect(info.title).toBe('Unknown Video');
      expect(info.thumbnail).toContain('test123');
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const info = await getVideoInfo('test123');

      expect(info.title).toBe('Unknown Video');
      expect(info.thumbnail).toBeTruthy();
    });

    it('should generate correct thumbnail URL', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Any error'));

      const info = await getVideoInfo('abc123xyz');

      expect(info.thumbnail).toBe('https://img.youtube.com/vi/abc123xyz/maxresdefault.jpg');
    });
  });
});
