/**
 * @label AI Service (Legacy)
 * @description Legacy AI functions - Use services/summary.api.ts instead
 * @deprecated Use the new API services for better integration
 */

export interface GeneratedContent {
  summary: string;
  keyPoints: string[];
  qaPairs: { question: string; answer: string }[];
}

export async function generateSummary(transcript: string): Promise<string> {
  // Use the new API service instead
  const { summaryApi } = await import('../services/summary.api');
  return await summaryApi.generateSummary(transcript);
}

export async function generateKeyPoints(transcript: string): Promise<string[]> {
  // Use the new API service instead
  const { summaryApi } = await import('../services/summary.api');
  return await summaryApi.generateKeyPoints(transcript);
}

export async function generateQA(transcript: string): Promise<{ question: string; answer: string }[]> {
  // Use the new API service instead
  const { summaryApi } = await import('../services/summary.api');
  return await summaryApi.generateQA(transcript);
}

export async function generateAllContent(transcript: string): Promise<GeneratedContent> {
  // Use the new API service for complete analysis
  const { summaryApi } = await import('../services/summary.api');
  return await summaryApi.generateComplete(transcript);
}
