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

// Check if Spark is available
const isSparkAvailable = () => {
  return typeof window !== 'undefined' && window.spark?.llm;
};

export async function generateSummary(transcript: string): Promise<string> {
  // Use the new API service instead
  const { summaryApi } = await import('../services/summary.api');
  return await summaryApi.generateSummary(transcript);
}

export async function generateKeyPoints(transcript: string): Promise<string[]> {
  if (!isSparkAvailable()) {
    // Fallback: Extract key sentences as points
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map(s => s.trim());
  }
  
  const spark = window.spark;
  const promptText = `You are an expert at extracting key information. Given this video transcript, identify the 5-8 most important takeaways, lessons, or concepts. Each point should be clear, actionable, and distinct.

Transcript:
${transcript}

Return the result as a valid JSON object with a single property called "points" that contains the list. Format:
{
  "points": ["First key point here", "Second key point here", ...]
}`;

  const result = await spark.llm(promptText, 'gpt-4o-mini', true);
  const parsed = JSON.parse(result);
  return parsed.points || [];
}

export async function generateQA(transcript: string): Promise<{ question: string; answer: string }[]> {
  if (!isSparkAvailable()) {
    // Fallback: Generate simple Q&A
    return [
      { question: "What is the main topic of this video?", answer: "This video covers the key concepts presented in the transcript." },
      { question: "What are the key takeaways?", answer: "The key takeaways include the main points discussed throughout the video." }
    ];
  }
  
  const spark = window.spark;
  const promptText = `You are an expert educator. Given this video transcript, create 5-7 meaningful questions that test understanding of the content, along with comprehensive answers. Questions should range from basic comprehension to deeper application.

Transcript:
${transcript}

Return the result as a valid JSON object with a single property called "qaPairs" that contains the list. Format:
{
  "qaPairs": [
    {"question": "Question text here?", "answer": "Detailed answer here"},
    ...more pairs
  ]
}`;

  const result = await spark.llm(promptText, 'gpt-4o-mini', true);
  const parsed = JSON.parse(result);
  return parsed.qaPairs || [];
}

export async function generateAllContent(transcript: string): Promise<GeneratedContent> {
  const [summary, keyPoints, qaPairs] = await Promise.all([
    generateSummary(transcript),
    generateKeyPoints(transcript),
    generateQA(transcript)
  ]);

  return {
    summary,
    keyPoints,
    qaPairs
  };
}
