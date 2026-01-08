/**
 * @label Summary API Service
 * @description API calls for AI summarization operations
 */

import { apiService } from './api.service';

// ============================================
// TYPES
// ============================================

interface QAPair {
  question: string;
  answer: string;
}

interface SummaryResponse {
  success: boolean;
  data: {
    summary: string;
  };
}

interface KeyPointsResponse {
  success: boolean;
  data: {
    keyPoints: string[];
  };
}

interface QAResponse {
  success: boolean;
  data: {
    qaPairs: QAPair[];
  };
}

interface CompleteAnalysisResponse {
  success: boolean;
  data: {
    summary: string;
    keyPoints: string[];
    qaPairs: QAPair[];
  };
}

// ============================================
// API METHODS
// ============================================

/**
 * @label Summary API
 * @description AI summarization API calls
 */
export const summaryApi = {
  /**
   * @label Generate Summary
   * @description Generate AI summary from transcript
   */
  generateSummary: async (transcript: string): Promise<string> => {
    const response = await apiService.post<SummaryResponse>('/summary/generate', { transcript });
    return response.data.summary;
  },

  /**
   * @label Generate Key Points
   * @description Extract key points from transcript
   */
  generateKeyPoints: async (transcript: string): Promise<string[]> => {
    const response = await apiService.post<KeyPointsResponse>('/summary/keypoints', { transcript });
    return response.data.keyPoints;
  },

  /**
   * @label Generate Q&A
   * @description Generate Q&A pairs from transcript
   */
  generateQA: async (transcript: string): Promise<QAPair[]> => {
    const response = await apiService.post<QAResponse>('/summary/qa', { transcript });
    return response.data.qaPairs;
  },

  /**
   * @label Generate Complete Analysis
   * @description Generate all analysis types at once
   */
  generateComplete: async (transcript: string): Promise<{
    summary: string;
    keyPoints: string[];
    qaPairs: QAPair[];
  }> => {
    const response = await apiService.post<CompleteAnalysisResponse>('/summary/complete', { transcript });
    return response.data;
  },
};

export default summaryApi;
