/**
 * @label Mock Spark LLM (Deprecated)
 * @description Legacy mock for GitHub Spark - tests now use API mocks
 * @deprecated This file is kept for backwards compatibility but tests should use API mocks
 */

import { expectedSummaries } from '../fixtures/summaries';

/**
 * @deprecated Use API service mocks instead
 */
export class MockSparkLLM {
  /**
   * Mock LLM prompt execution
   * @deprecated Use API service mocks instead
   */
  static async llm(prompt: string, model: string = 'gpt-4o-mini', parseJSON: boolean = true): Promise<any> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Detect prompt type and return appropriate mock response
    if (prompt.includes('key information') || prompt.includes('key points')) {
      return parseJSON ? {
        points: expectedSummaries.medium.keyPoints
      } : JSON.stringify({
        points: expectedSummaries.medium.keyPoints
      });
    }

    if (prompt.includes('questions') || prompt.includes('Q&A')) {
      return parseJSON ? {
        qaPairs: expectedSummaries.medium.qaPairs
      } : JSON.stringify({
        qaPairs: expectedSummaries.medium.qaPairs
      });
    }

    // Default: return summary
    return expectedSummaries.medium.summary;
  }

  /**
   * Mock streaming response
   * @deprecated Use API service mocks instead
   */
  static async *llmStream(prompt: string, model: string = 'gpt-4o-mini'): AsyncGenerator<string> {
    const summary = expectedSummaries.medium.summary;
    const words = summary.split(' ');

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 10));
      yield word + ' ';
    }
  }
}

/**
 * @label Mock Window Spark Object (Deprecated)
 * @description Legacy mock - kept for backwards compatibility
 * @deprecated Use API service mocks instead
 */
export const mockWindowSpark = {
  llm: MockSparkLLM.llm,
  llmStream: MockSparkLLM.llmStream,
  llmPrompt: async (prompt: string) => MockSparkLLM.llm(prompt),
};

/**
 * @label Setup Mock Spark (Deprecated)
 * @description Helper to inject mock Spark into window object
 * @deprecated Use API service mocks instead
 */
export function setupMockSpark() {
  if (typeof window !== 'undefined') {
    (window as any).spark = mockWindowSpark;
  }
}

/**
 * @label Cleanup Mock Spark (Deprecated)
 * @description Helper to remove mock Spark from window object
 * @deprecated Use API service mocks instead
 */
export function cleanupMockSpark() {
  if (typeof window !== 'undefined') {
    delete (window as any).spark;
  }
}
