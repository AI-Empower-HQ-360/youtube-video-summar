/**
 * @label YouTube Controller
 * @description Handles YouTube video operations
 */

import * as youtubeService from '../services/youtube.service.js';
import { ApiError } from '../utils/ApiError.js';

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

/**
 * @label Extract Video ID Controller
 * @description Extract video ID from YouTube URL
 */
export const extractVideoId = async (req, res, next) => {
  try {
    const { url } = req.body;
    const videoId = youtubeService.extractVideoId(url);

    if (!videoId) {
      throw new ApiError(400, 'Invalid YouTube URL');
    }

    res.status(200).json({
      success: true,
      data: { videoId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @label Get Transcript Controller
 * @description Fetch video transcript
 */
export const getTranscript = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const transcript = await youtubeService.getVideoTranscript(videoId);

    res.status(200).json({
      success: true,
      data: {
        videoId,
        transcript,
        length: transcript.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @label Get Metadata Controller
 * @description Fetch video metadata
 */
export const getMetadata = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const metadata = await youtubeService.getVideoMetadata(videoId);

    res.status(200).json({
      success: true,
      data: metadata
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @label Validate URL Controller
 * @description Check if URL is valid YouTube URL
 */
export const validateUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    const isValid = youtubeService.isValidYouTubeUrl(url);

    res.status(200).json({
      success: true,
      data: {
        isValid,
        url
      }
    });
  } catch (error) {
    next(error);
  }
};
