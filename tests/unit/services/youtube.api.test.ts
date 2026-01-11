/**
 * @label Unit Tests - YouTube API Service
 * @description Tests for YouTube video operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { youtubeApi } from '@/services/youtube.api';
import { apiService } from '@/services/api.service';
import { sampleVideos } from '../../fixtures/videos';
import { sampleTranscripts } from '../../fixtures/transcripts';

vi.mock('@/services/api.service');

describe('YouTube API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractVideoId', () => {
    it('should extract video ID from URL', async () => {
      const mockResponse = {
        success: true,
        data: {
          videoId: sampleVideos.withCaptions.id,
        },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await youtubeApi.extractVideoId(sampleVideos.withCaptions.url);

      expect(apiService.post).toHaveBeenCalledWith('/youtube/extract', {
        url: sampleVideos.withCaptions.url,
      });
      expect(result).toBe(sampleVideos.withCaptions.id);
    });

    it('should handle invalid URL', async () => {
      const mockResponse = {
        success: false,
        error: 'Invalid YouTube URL',
      };

      vi.mocked(apiService.post).mockRejectedValue(new Error('Invalid YouTube URL'));

      await expect(youtubeApi.extractVideoId('not-a-url'))
        .rejects.toThrow('Invalid YouTube URL');
    });
  });

  describe('getTranscript', () => {
    it('should fetch transcript for valid video ID', async () => {
      const mockResponse = {
        success: true,
        data: {
          videoId: sampleVideos.withCaptions.id,
          transcript: sampleTranscripts.medium,
          length: sampleTranscripts.medium.length,
        },
      };

      vi.mocked(apiService.get).mockResolvedValue(mockResponse);

      const result = await youtubeApi.getTranscript(sampleVideos.withCaptions.id);

      expect(apiService.get).toHaveBeenCalledWith(
        `/youtube/transcript/${sampleVideos.withCaptions.id}`
      );
      expect(result).toBe(sampleTranscripts.medium);
    });

    it('should handle video without captions', async () => {
      vi.mocked(apiService.get).mockRejectedValue(
        new Error('Captions are disabled for this video')
      );

      await expect(youtubeApi.getTranscript(sampleVideos.withoutCaptions.id))
        .rejects.toThrow('Captions are disabled');
    });

    it('should handle private or deleted videos', async () => {
      vi.mocked(apiService.get).mockRejectedValue(new Error('Video not found'));

      await expect(youtubeApi.getTranscript('deleted123'))
        .rejects.toThrow('Video not found');
    });
  });

  describe('getMetadata', () => {
    it('should fetch video metadata', async () => {
      const mockResponse = {
        success: true,
        data: {
          title: sampleVideos.withCaptions.title,
          thumbnail: sampleVideos.withCaptions.thumbnail,
          duration: sampleVideos.withCaptions.duration,
        },
      };

      vi.mocked(apiService.get).mockResolvedValue(mockResponse);

      const result = await youtubeApi.getMetadata(sampleVideos.withCaptions.id);

      expect(apiService.get).toHaveBeenCalledWith(
        `/youtube/metadata/${sampleVideos.withCaptions.id}`
      );
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('thumbnail');
      expect(result.title).toBe(sampleVideos.withCaptions.title);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct YouTube URL', async () => {
      const mockResponse = {
        success: true,
        data: { isValid: true, url: sampleVideos.withCaptions.url },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await youtubeApi.validateUrl(sampleVideos.withCaptions.url);

      expect(result).toBe(true);
    });

    it('should invalidate incorrect URL', async () => {
      const mockResponse = {
        success: true,
        data: { isValid: false, url: 'not-a-youtube-url' },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await youtubeApi.validateUrl('not-a-youtube-url');

      expect(result).toBe(false);
    });
  });
});
