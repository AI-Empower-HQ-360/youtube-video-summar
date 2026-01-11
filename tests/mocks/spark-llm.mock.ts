/**
 * @label Mock Spark LLM
 * @description Mock GitHub Spark LLM for testing AI features
 */

import { expectedSummaries } from '../fixtures/summaries';

export class MockSparkLLM {
  /**
   * Mock LLM prompt execution
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
 * @label Mock Window Spark Object
 * @description Mock the window.spark object used in the app
 */
export const mockWindowSpark = {
  llm: MockSparkLLM.llm,
  llmStream: MockSparkLLM.llmStream,
  llmPrompt: async (prompt: string) => MockSparkLLM.llm(prompt),
};

/**
 * @label Setup Mock Spark
 * @description Helper to inject mock Spark into window object
 */
export function setupMockSpark() {
  if (typeof window !== 'undefined') {
    (window as any).spark = mockWindowSpark;
  }
}

/**
 * @label Cleanup Mock Spark
 * @description Helper to remove mock Spark from window object
 */
export function cleanupMockSpark() {
  if (typeof window !== 'undefined') {
    delete (window as any).spark;
  }
}
