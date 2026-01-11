/**
 * @label Unit Tests - Summary API Service
 * @description Tests for AI summarization API calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { summaryApi } from '@/services/summary.api';
import { apiService } from '@/services/api.service';
import { expectedSummaries } from '../../fixtures/summaries';
import { sampleTranscripts } from '../../fixtures/transcripts';

vi.mock('@/services/api.service');

describe('Summary API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSummary', () => {
    it('should generate summary from transcript', async () => {
      const mockResponse = {
        summary: expectedSummaries.medium.summary,
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateSummary(sampleTranscripts.medium);

      expect(apiService.post).toHaveBeenCalledWith('/summary/generate', {
        transcript: sampleTranscripts.medium,
      });
      expect(result).toBeTruthy();
    });

    it('should handle empty transcript', async () => {
      const error = new Error('Transcript is required');
      vi.mocked(apiService.post).mockRejectedValue(error);

      await expect(summaryApi.generateSummary('')).rejects.toThrow('Transcript is required');
    });

    it('should handle API errors', async () => {
      const error = new Error('AI service unavailable');
      vi.mocked(apiService.post).mockRejectedValue(error);

      await expect(summaryApi.generateSummary(sampleTranscripts.short))
        .rejects.toThrow('AI service unavailable');
    });
  });

  describe('generateKeyPoints', () => {
    it('should extract key points from transcript', async () => {
      const mockResponse = {
        keyPoints: expectedSummaries.medium.keyPoints,
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateKeyPoints(sampleTranscripts.medium);

      expect(apiService.post).toHaveBeenCalledWith('/summary/keypoints', {
        transcript: sampleTranscripts.medium,
      });
      expect(result).toBeTruthy();
    });

    it('should return array for short transcript', async () => {
      const mockResponse = {
        keyPoints: expectedSummaries.short.keyPoints,
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateKeyPoints(sampleTranscripts.short);

      expect(result).toBeTruthy();
    });
  });

  describe('generateQA', () => {
    it('should generate Q&A pairs from transcript', async () => {
      const mockResponse = {
        success: true,
        data: {
          qaPairs: expectedSummaries.medium.qaPairs,
        },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateQA(sampleTranscripts.medium);

      expect(apiService.post).toHaveBeenCalledWith('/summary/qa', {
        transcript: sampleTranscripts.medium,
      });
      expect(result).toEqual(expectedSummaries.medium.qaPairs);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('question');
      expect(result[0]).toHaveProperty('answer');
    });

    it('should validate Q&A pair structure', async () => {
      const mockResponse = {
        success: true,
        data: {
          qaPairs: expectedSummaries.short.qaPairs,
        },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateQA(sampleTranscripts.short);

      result.forEach(pair => {
        expect(pair).toHaveProperty('question');
        expect(pair).toHaveProperty('answer');
        expect(typeof pair.question).toBe('string');
        expect(typeof pair.answer).toBe('string');
        expect(pair.question.length).toBeGreaterThan(0);
        expect(pair.answer.length).toBeGreaterThan(0);
      });
    });
  });

  describe('generateComplete', () => {
    it('should generate complete analysis with all components', async () => {
      const mockResponse = {
        success: true,
        data: {
          summary: expectedSummaries.medium.summary,
          keyPoints: expectedSummaries.medium.keyPoints,
          qaPairs: expectedSummaries.medium.qaPairs,
        },
      };

      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      const result = await summaryApi.generateComplete(sampleTranscripts.medium);

      expect(apiService.post).toHaveBeenCalledWith('/summary/complete', {
        transcript: sampleTranscripts.medium,
      });
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('keyPoints');
      expect(result).toHaveProperty('qaPairs');
    });
  });
});
