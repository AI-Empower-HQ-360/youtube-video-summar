/**
 * @label YouTube Service
 * @description Business logic for YouTube video operations
 */

import axios from 'axios';
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
 * @description Fetch transcript for a YouTube video using Innertube (youtubei.js)
 */
export async function getVideoTranscript(videoId) {
  try {
    // Use Innertube for more reliable transcript fetching
    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    
    // Get transcript from captions
    const transcriptData = await info.getTranscript();
    
    if (!transcriptData || !transcriptData.transcript) {
      throw new Error('No transcript available');
    }

    // Combine all transcript segments into a single text
    const transcript = transcriptData.transcript.content.body.initial_segments
      .map(segment => segment.snippet.text)
      .join(' ')
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (!transcript) {
      throw new Error('Transcript is empty');
    }

    return transcript;
  } catch (error) {
    console.log(`⚠️  Captions not available: ${error.message}`);
    // Try fallback to any available transcript
    try {
      const youtube = await Innertube.create();
      const info = await youtube.getInfo(videoId);
      const transcriptData = await info.getTranscript();
      
      if (transcriptData && transcriptData.transcript) {
        const transcript = transcriptData.transcript.content.body.initial_segments
          .map(segment => segment.snippet.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (transcript) {
          return transcript;
        }
      }
      
      throw new Error('No transcript available');
    } catch (fallbackError) {
      console.log(`❌ Fallback also failed: ${fallbackError.message}`);
      
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
      
      // If local Whisper not available, throw error
      throw new ApiError(404, 'No captions available for this video');
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
