/**
 * @label Use YouTube Hook
 * @description Custom hook for YouTube operations
 */

import { useState, useCallback } from 'react';
import { youtubeApi } from '../services/youtube.api';
import { extractVideoId as extractVideoIdLocal } from '../lib/youtube';

// ============================================
// TYPES
// ============================================

interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  duration: number;
  viewCount: number;
  url: string;
  thumbnail: string;
}

interface UseYouTubeReturn {
  videoId: string | null;
  transcript: string;
  metadata: VideoMetadata | null;
  isLoading: boolean;
  error: string | null;
  extractVideoId: (url: string) => string | null;
  fetchTranscript: (videoId: string) => Promise<void>;
  fetchMetadata: (videoId: string) => Promise<void>;
  validateUrl: (url: string) => Promise<boolean>;
  reset: () => void;
}

// ============================================
// HOOK
// ============================================

/**
 * @label Use YouTube Hook
 * @description Handle YouTube video operations
 */
export const useYouTube = (): UseYouTubeReturn => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @label Extract Video ID
   * @description Extract video ID from URL
   */
  const extractVideoId = useCallback((url: string): string | null => {
    try {
      const id = extractVideoIdLocal(url);
      setVideoId(id);
      return id;
    } catch {
      setError('Failed to extract video ID');
      return null;
    }
  }, []);

  /**
   * @label Fetch Transcript
   * @description Fetch video transcript from API
   */
  const fetchTranscript = useCallback(async (videoId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const transcriptData = await youtubeApi.getTranscript(videoId);
      setTranscript(transcriptData);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch transcript');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @label Fetch Metadata
   * @description Fetch video metadata from API
   */
  const fetchMetadata = useCallback(async (videoId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const metadataData = await youtubeApi.getMetadata(videoId);
      setMetadata(metadataData);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch metadata');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @label Validate URL
   * @description Check if URL is valid
   */
  const validateUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      return await youtubeApi.validateUrl(url);
    } catch {
      return false;
    }
  }, []);

  /**
   * @label Reset State
   * @description Clear all state
   */
  const reset = useCallback(() => {
    setVideoId(null);
    setTranscript('');
    setMetadata(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    videoId,
    transcript,
    metadata,
    isLoading,
    error,
    extractVideoId,
    fetchTranscript,
    fetchMetadata,
    validateUrl,
    reset,
  };
};

export default useYouTube;
