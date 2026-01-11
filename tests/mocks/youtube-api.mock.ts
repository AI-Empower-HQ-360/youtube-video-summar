/**
 * @label Mock YouTube API
 * @description Mock YouTube API responses for testing
 */

import { sampleVideos, invalidVideos } from '../fixtures/videos';
import { sampleTranscripts } from '../fixtures/transcripts';

export class MockYouTubeAPI {
  /**
   * Mock transcript fetching
   */
  static async fetchTranscript(videoId: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    if (videoId === sampleVideos.withCaptions.id) {
      return sampleTranscripts.medium;
    }

    if (videoId === sampleVideos.withoutCaptions.id) {
      throw new Error('[YoutubeTranscript] 🚨 Transcript is disabled on this video');
    }

    if (videoId === invalidVideos.privateVideo.id) {
      throw new Error('Video is private');
    }

    if (videoId === invalidVideos.deletedVideo.id) {
      throw new Error('Video not found');
    }

    // Default return for unknown videos
    return sampleTranscripts.short;
  }

  /**
   * Mock video metadata fetching
   */
  static async fetchVideoInfo(videoId: string) {
    await new Promise(resolve => setTimeout(resolve, 50));

    const video = Object.values(sampleVideos).find(v => v.id === videoId);
    
    if (video) {
      return {
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
      };
    }

    return {
      title: 'Unknown Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: '0:00',
    };
  }

  /**
   * Mock video ID extraction
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

/**
 * @label Mock API Responses
 * @description Pre-defined API response objects
 */
export const mockAPIResponses = {
  transcriptSuccess: {
    success: true,
    data: {
      videoId: sampleVideos.withCaptions.id,
      transcript: sampleTranscripts.medium,
      length: sampleTranscripts.medium.length,
    },
  },

  transcriptDisabled: {
    success: false,
    error: {
      message: 'Captions are disabled for this video',
      statusCode: 404,
    },
  },

  videoInfo: {
    success: true,
    data: {
      title: sampleVideos.withCaptions.title,
      thumbnail: sampleVideos.withCaptions.thumbnail,
      duration: sampleVideos.withCaptions.duration,
    },
  },

  invalidUrl: {
    success: false,
    error: {
      message: 'Invalid YouTube URL',
      statusCode: 400,
    },
  },

  serverError: {
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  },
};
