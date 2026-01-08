/**
 * @label YouTube Service
 * @description Business logic for YouTube video operations
 */

import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * @label Extract Video ID
 * @description Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url) {
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

/**
 * @label Validate YouTube URL
 * @description Check if URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

/**
 * @label Get Video Transcript
 * @description Fetch transcript for a YouTube video
 */
export async function getVideoTranscript(videoId) {
  try {
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    const html = response.data;
    
    const captionsMatch = html.match(/"captions":({.*?})/);
    if (!captionsMatch) {
      throw new ApiError(404, 'No captions found for this video');
    }

    const captionsData = JSON.parse(captionsMatch[1]);
    const captionTracks = captionsData?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captionTracks || captionTracks.length === 0) {
      throw new ApiError(404, 'No caption tracks available');
    }

    const transcriptUrl = captionTracks[0].baseUrl;
    const transcriptResponse = await axios.get(transcriptUrl);
    const transcriptXml = transcriptResponse.data;
    
    const textMatches = transcriptXml.matchAll(/<text[^>]*>([^<]+)<\/text>/g);
    const transcript = Array.from(textMatches)
      .map(match => match[1])
      .join(' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return transcript;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to fetch transcript: ${error.message}`);
  }
}

/**
 * @label Get Video Metadata
 * @description Fetch metadata for a YouTube video
 */
export async function getVideoMetadata(videoId) {
  try {
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    const html = response.data;
    
    // Extract title
    const titleMatch = html.match(/<meta name="title" content="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;
    
    // Extract description
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : null;
    
    // Extract duration (from structured data)
    const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : null;
    
    // Extract view count
    const viewCountMatch = html.match(/"viewCount":"(\d+)"/);
    const viewCount = viewCountMatch ? parseInt(viewCountMatch[1]) : null;

    return {
      videoId,
      title,
      description,
      duration,
      viewCount,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  } catch (error) {
    throw new ApiError(500, `Failed to fetch metadata: ${error.message}`);
  }
}
