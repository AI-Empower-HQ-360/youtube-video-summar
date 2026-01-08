/**
 * @label Summary Controller
 * @description Handles AI summarization operations
 */

import * as summaryService from '../services/summary.service.js';

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

/**
 * @label Generate Summary Controller
 * @description Generate AI summary from transcript with language support
 */
export const generateSummary = async (req, res, next) => {
  try {
    const { transcript, sourceLanguage, targetLanguage } = req.body;
    const summary = await summaryService.generateSummary(transcript, {
      sourceLanguage,
      targetLanguage
    });

    res.status(200).json({
      success: true,
      data: { 
        summary,
        detectedLanguage: sourceLanguage,
        targetLanguage
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @label Generate Key Points Controller
 * @description Extract key points from transcript
 */
export const generateKeyPoints = async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const keyPoints = await summaryService.generateKeyPoints(transcript);

    res.status(200).json({
      success: true,
      data: { keyPoints }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @label Generate Q&A Controller
 * @description Generate Q&A pairs from transcript
 */
export const generateQA = async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const qaPairs = await summaryService.generateQA(transcript);

    res.status(200).json({
      success: true,
      data: { qaPairs }
    });
  } catch (error) { with language support
 */
export const generateComplete = async (req, res, next) => {
  try {
    const { transcript, sourceLanguage, targetLanguage } = req.body;
    
    const [summary, keyPoints, qaPairs] = await Promise.all([
      summaryService.generateSummary(transcript, { sourceLanguage, targetLanguage }),
      summaryService.generateKeyPoints(transcript),
      summaryService.generateQA(transcript)
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary,
        keyPoints,
        qaPairs,
        detectedLanguage: sourceLanguage,
        targetLanguage
      }
    });
  } catch (error) {
    next(error);
  }
};
    const [summary, keyPoints, qaPairs] = await Promise.all([
      summaryService.generateSummary(transcript),
      summaryService.generateKeyPoints(transcript),
      summaryService.generateQA(transcript)
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary,
        keyPoints,
        qaPairs
      }
    });
  } catch (error) {
    next(error);
  }
};
