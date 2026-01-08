export interface GeneratedContent {
  summary: string;
  keyPoints: string[];
  qaPairs: { question: string; answer: string }[];
}

export async function generateSummary(transcript: string): Promise<string> {
  const prompt = (window.spark.llmPrompt as any)`You are an expert at summarizing video content. Given this video transcript, create a clear, concise summary in 3-5 paragraphs that captures the main ideas and key information. Write in a natural, engaging style.

Transcript:
${transcript}

Provide only the summary, no additional commentary.`;

  const result = await window.spark.llm(prompt, 'gpt-4o-mini');
  return result.trim();
}

export async function generateKeyPoints(transcript: string): Promise<string[]> {
  const prompt = (window.spark.llmPrompt as any)`You are an expert at extracting key information. Given this video transcript, identify the 5-8 most important takeaways, lessons, or concepts. Each point should be clear, actionable, and distinct.

Transcript:
${transcript}

Return the result as a valid JSON object with a single property called "points" that contains the list. Format:
{
  "points": ["First key point here", "Second key point here", ...]
}`;

  const result = await window.spark.llm(prompt, 'gpt-4o-mini', true);
  const parsed = JSON.parse(result);
  return parsed.points || [];
}

export async function generateQA(transcript: string): Promise<{ question: string; answer: string }[]> {
  const prompt = (window.spark.llmPrompt as any)`You are an expert educator. Given this video transcript, create 5-7 meaningful questions that test understanding of the content, along with comprehensive answers. Questions should range from basic comprehension to deeper application.

Transcript:
${transcript}

Return the result as a valid JSON object with a single property called "qaPairs" that contains the list. Format:
{
  "qaPairs": [
    {"question": "Question text here?", "answer": "Detailed answer here"},
    ...more pairs
  ]
}`;

  const result = await window.spark.llm(prompt, 'gpt-4o-mini', true);
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
