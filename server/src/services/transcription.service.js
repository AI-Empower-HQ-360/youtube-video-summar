/**
 * @label Local Transcription Service
 * @description FREE transcription using Transformers.js (local Whisper)
 */

import { pipeline } from '@xenova/transformers';
import ytdl from '@distube/ytdl-core';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache the transcription pipeline
let transcriber = null;

// ============================================
// LOCAL WHISPER TRANSCRIPTION (FREE)
// ============================================

/**
 * @label Initialize Transcriber
 * @description Load Whisper model (first time downloads ~100MB)
 */
async function initTranscriber() {
  if (!transcriber) {
    console.log('🔄 Loading Whisper model (first time may take a minute)...');
    transcriber = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en', // Using tiny model for speed (39MB)
      // Options: whisper-tiny.en (39MB), whisper-base.en (74MB), whisper-small.en (244MB)
    );
    console.log('✅ Whisper model loaded successfully!');
  }
  return transcriber;
}

/**
 * @label Get Audio Buffer from YouTube
 * @description Extract audio from YouTube video using ytdl-core
 */
async function getYouTubeAudio(videoId) {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    console.log(`📥 Downloading audio for: ${videoId}`);
    
    // Check if video is available
    const info = await ytdl.getInfo(videoUrl);
    if (!info) {
      throw new Error('Video not found or unavailable');
    }
    
    // Get audio stream
    const audioStream = ytdl(videoUrl, {
      quality: 'lowestaudio',
      filter: 'audioonly',
    });
    
    // Collect audio chunks
    const chunks = [];
    let totalSize = 0;
    
    for await (const chunk of audioStream) {
      chunks.push(chunk);
      totalSize += chunk.length;
    }
    
    const audioBuffer = Buffer.concat(chunks);
    console.log(`✅ Downloaded audio: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    return audioBuffer;
  } catch (error) {
    console.error('❌ Audio download error:', error.message);
    throw new ApiError(500, `Failed to download audio: ${error.message}`);
  }
}

/**
 * @label Save Audio Temporarily
 * @description Save audio buffer to temp file for processing
 */
async function saveAudioTemp(audioBuffer, videoId) {
  const tempDir = path.join(__dirname, '../../temp');
  await fs.mkdir(tempDir, { recursive: true });
  
  const tempPath = path.join(tempDir, `${videoId}.webm`);
  await fs.writeFile(tempPath, audioBuffer);
  
  return tempPath;
}

/**
 * @label Clean Up Temp Files
 * @description Remove temporary audio files
 */
async function cleanupTemp(filePath) {
  try {
    await fs.unlink(filePath);
    console.log('🗑️  Cleaned up temp file');
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * @label Transcribe with Local Whisper
 * @description FREE transcription using Transformers.js
 */
export async function transcribeWithLocalWhisper(videoId) {
  console.log(`🎙️  Starting FREE local transcription for video: ${videoId}`);
  
  let tempAudioPath = null;
  
  try {
    // Step 1: Initialize Whisper model
    const transcriber = await initTranscriber();
    
    // Step 2: Download audio from YouTube
    console.log('📥 Downloading audio...');
    const audioBuffer = await getYouTubeAudio(videoId);
    
    // Step 3: Save to temp file
    tempAudioPath = await saveAudioTemp(audioBuffer, videoId);
    
    // Step 4: Transcribe with Whisper
    console.log('🔄 Transcribing with local Whisper (this may take a few minutes)...');
    const result = await transcriber(tempAudioPath, {
      chunk_length_s: 30, // Process in 30-second chunks
      stride_length_s: 5,  // 5-second overlap
      return_timestamps: false,
    });
    
    console.log('✅ Transcription completed!');
    
    // Step 5: Clean up
    if (tempAudioPath) {
      await cleanupTemp(tempAudioPath);
    }
    
    if (!result || !result.text) {
      throw new Error('Transcription returned empty result');
    }
    
    return {
      text: result.text.trim(),
      language: 'en', // Tiny model is English-only
      method: 'local-whisper-transformers',
      cost: 0, // FREE!
    };
    
  } catch (error) {
    // Clean up on error
    if (tempAudioPath) {
      await cleanupTemp(tempAudioPath);
    }
    
    throw new ApiError(500, `Local transcription failed: ${error.message}`);
  }
}

/**
 * @label Check if Local Whisper is Available
 * @description Always returns true (no API key needed!)
 */
export function isLocalWhisperAvailable() {
  return true; // Always available - it's FREE!
}
