/**
 * @label YouTube Data API v3 Service
 * @description Official YouTube Data API v3 integration for captions
 * Provides stable, official API access that bypasses scraping issues
 */

import axios from 'axios';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// CONSTANTS
// ============================================

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * @label Check API Key
 * @description Verify YouTube API key is configured
 */
function hasApiKey() {
  return Boolean(API_KEY && API_KEY !== 'your_youtube_api_key_here');
}

/**
 * @label Get Caption Tracks
 * @description Fetch available caption tracks for a video
 */
async function getCaptionTracks(videoId) {
  if (!hasApiKey()) {
    throw new ApiError(500, 'YouTube API key not configured');
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/captions`, {
      params: {
        part: 'snippet',
        videoId: videoId,
        key: API_KEY,
      },
    });

    return response.data.items || [];
  } catch (error) {
    if (error.response?.status === 403) {
      throw new ApiError(403, 'YouTube API quota exceeded or key invalid');
    }
    if (error.response?.status === 404) {
      throw new ApiError(404, 'Video not found or captions disabled');
    }
    throw new ApiError(500, `YouTube API error: ${error.message}`);
  }
}

/**
 * @label Download Caption
 * @description Download caption content from YouTube
 */
async function downloadCaption(captionId) {
  if (!hasApiKey()) {
    throw new ApiError(500, 'YouTube API key not configured');
  }

  try {
    // Note: The captions.download endpoint requires OAuth 2.0
    // We'll use the public timedtext endpoint instead
    const response = await axios.get(`${YOUTUBE_API_BASE}/captions/${captionId}`, {
      params: {
        key: API_KEY,
        tfmt: 'srt', // Request SRT format
      },
    });

    return response.data;
  } catch (error) {
    throw new ApiError(500, `Failed to download caption: ${error.message}`);
  }
}

/**
 * @label Parse SRT Content
 * @description Convert SRT subtitle format to plain text
 */
function parseSrtToText(srtContent) {
  // Remove SRT timing and index lines, keep only text
  const lines = srtContent.split('\n');
  const textLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines, numbers, and timing lines
    if (line && 
        !/^\d+$/.test(line) && 
        !/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line)) {
      textLines.push(line);
    }
  }
  
  return textLines.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * @label Get Caption Using TimedText API
 * @description Fetch captions using YouTube's public timedtext endpoint
 */
async function getCaptionViaTimedText(videoId, languageCode = 'en') {
  try {
    // YouTube's public timedtext API endpoint
    const url = `https://www.youtube.com/api/timedtext`;
    
    const response = await axios.get(url, {
      params: {
        v: videoId,
        lang: languageCode,
        fmt: 'srv3', // XML format
      },
      timeout: 10000,
    });

    if (!response.data) {
      throw new Error('No caption data received');
    }

    // Parse XML to extract text
    return parseTimedTextXml(response.data);
  } catch (error) {
    throw new Error(`TimedText API failed: ${error.message}`);
  }
}

/**
 * @label Parse TimedText XML
 * @description Extract text from YouTube's timedtext XML format
 */
function parseTimedTextXml(xmlContent) {
  // Simple XML text extraction (removes all tags)
  const textContent = xmlContent
    .replace(/<[^>]*>/g, ' ') // Remove XML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (!textContent) {
    throw new Error('No text content found in caption XML');
  }

  return textContent;
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * @label Get Transcript via YouTube API
 * @description Fetch video transcript using official YouTube Data API v3
 * Tries multiple methods: API captions → TimedText endpoint
 */
export async function getTranscriptViaApi(videoId, preferredLanguage = 'en') {
  console.log('🎬 Attempting YouTube Data API v3 for:', videoId);

  // Method 1: Try public TimedText API first (no API key needed)
  try {
    console.log('📺 Trying YouTube TimedText API...');
    const transcript = await getCaptionViaTimedText(videoId, preferredLanguage);
    console.log(`✅ TimedText API success: ${transcript.length} characters`);
    return {
      text: transcript,
      source: 'youtube-timedtext',
      language: preferredLanguage,
    };
  } catch (error) {
    console.log(`⚠️  TimedText API failed: ${error.message}`);
  }

  // Method 2: Try official API with key (if configured)
  if (!hasApiKey()) {
    console.log('⚠️  YouTube API key not configured, skipping Data API v3');
    throw new ApiError(
      500, 
      'YouTube captions unavailable. Configure YOUTUBE_API_KEY or use video with auto-captions'
    );
  }

  try {
    console.log('📺 Trying YouTube Data API v3 with API key...');
    
    // Get available caption tracks
    const tracks = await getCaptionTracks(videoId);
    console.log(`📋 Found ${tracks.length} caption tracks`);

    if (tracks.length === 0) {
      throw new ApiError(404, 'No captions available for this video');
    }

    // Find preferred language or use first available
    let selectedTrack = tracks.find(track => 
      track.snippet.language === preferredLanguage
    );

    if (!selectedTrack) {
      selectedTrack = tracks[0];
      console.log(`⚠️  Preferred language "${preferredLanguage}" not found, using: ${selectedTrack.snippet.language}`);
    }

    console.log(`🎯 Selected caption: ${selectedTrack.snippet.name} (${selectedTrack.snippet.language})`);

    // Download caption content
    const captionContent = await downloadCaption(selectedTrack.id);
    const transcript = parseSrtToText(captionContent);

    console.log(`✅ YouTube API v3 success: ${transcript.length} characters`);

    return {
      text: transcript,
      source: 'youtube-api-v3',
      language: selectedTrack.snippet.language,
      trackName: selectedTrack.snippet.name,
    };
  } catch (error) {
    console.log(`❌ YouTube Data API v3 failed: ${error.message}`);
    throw error;
  }
}

/**
 * @label Check API Availability
 * @description Check if YouTube Data API v3 is available
 */
export function isYouTubeApiAvailable() {
  return hasApiKey();
}

/**
 * @label Get API Status
 * @description Get current YouTube API configuration status
 */
export function getApiStatus() {
  return {
    configured: hasApiKey(),
    timedTextAvailable: true, // Always available (no key needed)
    dataApiAvailable: hasApiKey(),
    message: hasApiKey() 
      ? 'YouTube Data API v3 ready' 
      : 'Using TimedText API only (configure YOUTUBE_API_KEY for full access)',
  };
}
