/**
 * @label Use Summary Hook
 * @description Custom hook for AI summarization operations
 */

import { useState, useCallback } from 'react';
import { summaryApi } from '../services/summary.api';

// ============================================
// TYPES
// ============================================

interface QAPair {
  question: string;
  answer: string;
}

interface UseSummaryReturn {
  summary: string;
  keyPoints: string[];
  qaPairs: QAPair[];
  isGenerating: boolean;
  error: string | null;
  generateSummary: (transcript: string) => Promise<void>;
  generateKeyPoints: (transcript: string) => Promise<void>;
  generateQA: (transcript: string) => Promise<void>;
  generateAll: (transcript: string) => Promise<void>;
  reset: () => void;
}

// ============================================
// HOOK
// ============================================

/**
 * @label Use Summary Hook
 * @description Handle AI summarization operations
 */
export const useSummary = (): UseSummaryReturn => {
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @label Generate Summary
   * @description Generate AI summary
   */
  const generateSummary = useCallback(async (transcript: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      const summaryData = await summaryApi.generateSummary(transcript);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to generate summary');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * @label Generate Key Points
   * @description Extract key points
   */
  const generateKeyPoints = useCallback(async (transcript: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      const points = await summaryApi.generateKeyPoints(transcript);
      setKeyPoints(points);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to generate key points');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * @label Generate Q&A
   * @description Generate Q&A pairs
   */
  const generateQA = useCallback(async (transcript: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      const qa = await summaryApi.generateQA(transcript);
      setQAPairs(qa);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to generate Q&A');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * @label Generate All
   * @description Generate all analyses at once
   */
  const generateAll = useCallback(async (transcript: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      const data = await summaryApi.generateComplete(transcript);
      setSummary(data.summary);
      setKeyPoints(data.keyPoints);
      setQAPairs(data.qaPairs);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to generate analysis');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * @label Reset State
   * @description Clear all state
   */
  const reset = useCallback(() => {
    setSummary('');
    setKeyPoints([]);
    setQAPairs([]);
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    summary,
    keyPoints,
    qaPairs,
    isGenerating,
    error,
    generateSummary,
    generateKeyPoints,
    generateQA,
    generateAll,
    reset,
  };
};

export default useSummary;
