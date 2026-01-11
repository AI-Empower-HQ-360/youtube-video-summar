/**
 * @label YouTube Service
 * @description Business logic for YouTube video operations
 */

import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import { Innertube } from 'youtubei.js';
import { ApiError } from '../utils/ApiError.js';
import { transcribeWithLocalWhisper, isLocalWhisperAvailable } from './transcription.service.js';

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
 * @description Fetch transcript for a YouTube video using youtube-transcript library
 */
export async function getVideoTranscript(videoId) {
  try {
    // Use the youtube-transcript library for reliable transcript fetching
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'en', // Try English first
    });
    
    if (!transcriptData || transcriptData.length === 0) {
      throw new ApiError(404, 'No transcript available for this video');
    }

    // Combine all transcript segments into a single text
    const transcript = transcriptData
      .map(item => item.text)
      .join(' ')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return transcript;
  } catch (error) {
    // If English fails, try to fetch any available language
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (!transcriptData || transcriptData.length === 0) {
        throw new ApiError(404, 'No transcript available for this video');
      }

      const transcript = transcriptData
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      return transcript;
    } catch (fallbackError) {
      // Try local Whisper transcription as final fallback (FREE!)
      if (isLocalWhisperAvailable()) {
        console.log('🎙️  No captions available - using FREE local Whisper transcription...');
        try {
          const result = await transcribeWithLocalWhisper(videoId);
          console.log(`✅ Local transcription successful (${result.method})`);
          return result.text;
        } catch (whisperError) {
          console.error('❌ Local Whisper failed:', whisperError.message);
          throw new ApiError(
            500, 
            `No captions available and transcription failed: ${whisperError.message}`
          );
        }
      }
      
      // If local Whisper not available, throw original error
      if (error.message?.includes('Transcript is disabled')) {
        throw new ApiError(404, 'Captions are disabled for this video');
      } else if (error.message?.includes('No transcript found')) {
        throw new ApiError(404, 'No captions available for this video. Please use a video with captions enabled.');
      }
      throw new ApiError(500, `Failed to fetch transcript: ${fallbackError.message}`);
    }
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
