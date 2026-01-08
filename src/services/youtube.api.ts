/**
 * @label YouTube API Service
 * @description API calls for YouTube operations
 */

import { apiService } from './api.service';

// ============================================
// TYPES
// ============================================

interface ExtractVideoIdResponse {
  success: boolean;
  data: {
    videoId: string;
  };
}

interface TranscriptResponse {
  success: boolean;
  data: {
    videoId: string;
    transcript: string;
    length: number;
  };
}

interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  duration: number;
  viewCount: number;
  url: string;
  thumbnail: string;
}

interface MetadataResponse {
  success: boolean;
  data: VideoMetadata;
}

interface ValidateUrlResponse {
  success: boolean;
  data: {
    isValid: boolean;
    url: string;
  };
}

// ============================================
// API METHODS
// ============================================

/**
 * @label YouTube API
 * @description YouTube-specific API calls
 */
export const youtubeApi = {
  /**
   * @label Extract Video ID
   * @description Extract video ID from YouTube URL
   */
  extractVideoId: async (url: string): Promise<string> => {
    const response = await apiService.post<ExtractVideoIdResponse>('/youtube/extract', { url });
    return response.data.videoId;
  },

  /**
   * @label Get Transcript
   * @description Fetch transcript for a video
   */
  getTranscript: async (videoId: string): Promise<string> => {
    const response = await apiService.get<TranscriptResponse>(`/youtube/transcript/${videoId}`);
    return response.data.transcript;
  },

  /**
   * @label Get Metadata
   * @description Fetch video metadata
   */
  getMetadata: async (videoId: string): Promise<VideoMetadata> => {
    const response = await apiService.get<MetadataResponse>(`/youtube/metadata/${videoId}`);
    return response.data;
  },

  /**
   * @label Validate URL
   * @description Check if URL is valid YouTube URL
   */
  validateUrl: async (url: string): Promise<boolean> => {
    const response = await apiService.post<ValidateUrlResponse>('/youtube/validate', { url });
    return response.data.isValid;
  },
};

export default youtubeApi;
