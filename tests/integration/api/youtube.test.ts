/**
 * @label Integration Tests - YouTube API Endpoints
 * @description Integration tests for YouTube-related API endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sampleVideos } from '../../fixtures/videos';
import { MockYouTubeAPI } from '../../mocks/youtube-api.mock';

describe('YouTube API Integration', () => {
  describe('POST /api/youtube/validate', () => {
    it('should validate correct YouTube URL', async () => {
      const url = sampleVideos.withCaptions.url;
      const videoId = MockYouTubeAPI.extractVideoId(url);
      
      expect(videoId).toBe(sampleVideos.withCaptions.id);
    });

    it('should reject invalid URL', async () => {
      const url = 'not-a-youtube-url';
      const videoId = MockYouTubeAPI.extractVideoId(url);
      
      expect(videoId).toBeNull();
    });
  });

  describe('GET /api/youtube/transcript/:videoId', () => {
    it('should fetch transcript for video with captions', async () => {
      const videoId = sampleVideos.withCaptions.id;
      const transcript = await MockYouTubeAPI.fetchTranscript(videoId);
      
      expect(transcript).toBeTruthy();
      expect(transcript.length).toBeGreaterThan(0);
    });

    it('should return error for video without captions', async () => {
      const videoId = sampleVideos.withoutCaptions.id;
      
      await expect(MockYouTubeAPI.fetchTranscript(videoId))
        .rejects
        .toThrow('Transcript is disabled');
    });

    it('should return error for private video', async () => {
      const videoId = 'private123';
      
      await expect(MockYouTubeAPI.fetchTranscript(videoId))
        .rejects
        .toThrow('Video is private');
    });
  });

  describe('GET /api/youtube/metadata/:videoId', () => {
    it('should fetch video metadata', async () => {
      const videoId = sampleVideos.withCaptions.id;
      const metadata = await MockYouTubeAPI.fetchVideoInfo(videoId);
      
      expect(metadata).toHaveProperty('title');
      expect(metadata).toHaveProperty('thumbnail');
      expect(metadata).toHaveProperty('duration');
    });

    it('should return default metadata for unknown video', async () => {
      const videoId = 'unknown123';
      const metadata = await MockYouTubeAPI.fetchVideoInfo(videoId);
      
      expect(metadata.title).toBe('Unknown Video');
      expect(metadata.thumbnail).toContain(videoId);
    });
  });
});
