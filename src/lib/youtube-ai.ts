/**
 * @label YouTube AI Service
 * @description Enhanced YouTube service with AI agent integration
 */

import { getAgentManager } from './agents'
import { extractVideoId, getVideoTranscript, getVideoInfo } from './youtube'

// ============================================
// TYPES
// ============================================

export interface VideoSummaryResult {
  videoId: string
  title: string
  thumbnail: string
  summary: string
  keyPoints: string[]
  themes: string[]
  sentiment: string
  qaPairs: Array<{ question: string; answer: string }>
  recommendations: string[]
  detectedLanguage?: string  // Detected source language
  targetLanguage?: string    // Output language
  metadata: {
    processingTime: number
    timestamp: string
    model: string
    tokensUsed: number
  }
}

export interface AnalysisOptions {
  includeKeyPoints?: boolean
  includeThemes?: boolean
  includeSentiment?: boolean
  includeQA?: boolean
  includeRecommendations?: boolean
  summaryLength?: 'short' | 'medium' | 'long'
  summaryFormat?: 'paragraph' | 'bullets' | 'structured'
  sourceLanguage?: string  // Auto-detect if not provided
  targetLanguage?: string  // Default to source language or English
}

// ============================================
// SERVICE
// ============================================

/**
 * @label Process YouTube Video with AI Agents
 * @description Comprehensive video analysis using multiple AI agents
 */
export async function processYouTubeVideo(
  url: string,
  options: AnalysisOptions = {}
): Promise<VideoSummaryResult> {
  const startTime = Date.now()
  
  // Extract video ID
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  // Get video info and transcript
  const [videoInfo, transcript] = await Promise.all([
    getVideoInfo(videoId),
    getVideoTranscript(videoId)
  ])

  // Get agent manager
  const manager = getAgentManager()
  const summarizer = manager.getSummarizer()
  const analyzer = manager.getAnalyzer()
  const extractor = manager.getExtractor()
  const qaAgent = manager.getQAAgent()
  const generator = manager.getGenerator()

  if (!summarizer || !analyzer || !extractor) {
    throw new Error('Required agents not initialized')
  }

  // Default options
  const opts = {
    includeKeyPoints: true,
    includeThemes: true,
    includeSentiment: true,
    includeQA: true,
    includeRecommendations: true,
    summaryLength: 'medium' as const,
    summaryFormat: 'structured' as const,
    ...options
  }

  // Detect source language if not provided
  let detectedLanguage = opts.sourceLanguage
  if (!detectedLanguage) {
    const { detectLanguage } = await import('./language-support')
    detectedLanguage = detectLanguage(transcript)
  }

  // Set target language (default to detected language if not specified)
  const targetLanguage = opts.targetLanguage || detectedLanguage

  // Generate summary with language support
  const summary = await summarizer.summarize(transcript, {
    length: opts.summaryLength,
    format: opts.summaryFormat,
    sourceLanguage: detectedLanguage,
    targetLanguage: targetLanguage
  })

  // Parallel processing for independent tasks
  const parallelTasks: Promise<unknown>[] = []
  
  // Key points extraction
  let keyPoints: string[] = []
  if (opts.includeKeyPoints) {
    parallelTasks.push(
      extractor.extract(summary, [
        'main points',
        'key takeaways',
        'important concepts'
      ]).then(result => {
        keyPoints = Object.values(result).flat().filter(Boolean)
      })
    )
  }

  // Analysis (themes and sentiment)
  let themes: string[] = []
  let sentiment = 'neutral'
  if (opts.includeThemes || opts.includeSentiment) {
    const aspects = []
    if (opts.includeThemes) aspects.push('main themes')
    if (opts.includeSentiment) aspects.push('overall sentiment')
    
    parallelTasks.push(
      analyzer.analyze(summary, aspects).then(analysis => {
        if (opts.includeThemes) {
          const themeMatch = analysis.match(/themes?:(.+?)(?:\n|sentiment|$)/is)
          if (themeMatch) {
            themes = themeMatch[1]
              .split(/[,\n]/)
              .map(t => t.trim())
              .filter(Boolean)
          }
        }
        if (opts.includeSentiment) {
          const sentimentMatch = analysis.match(/sentiment:(.+?)(?:\n|$)/i)
          if (sentimentMatch) {
            sentiment = sentimentMatch[1].trim()
          }
        }
      })
    )
  }

  // Wait for parallel tasks
  await Promise.all(parallelTasks)

  // Sequential dependent tasks
  let qaPairs: Array<{ question: string; answer: string }> = []
  if (opts.includeQA && qaAgent) {
    const qaPrompt = `Generate 5-7 meaningful questions and answers about this video summary:\n\n${summary}`
    const qaResult = await qaAgent.answer(qaPrompt, transcript)
    
    // Parse Q&A from response
    const qaMatches = qaResult.matchAll(/Q(?:uestion)?[\s:]+(.+?)\s*A(?:nswer)?[\s:]+(.+?)(?=Q(?:uestion)?|$)/gis)
    qaPairs = Array.from(qaMatches).map(match => ({
      question: match[1].trim(),
      answer: match[2].trim()
    }))
  }

  // Generate recommendations
  let recommendations: string[] = []
  if (opts.includeRecommendations && generator) {
    const recPrompt = `Based on this video summary, generate 3-5 actionable recommendations or next steps for viewers:\n\n${summary}`
    const recResult = await generator.generate(recPrompt, {
      tone: 'helpful',
      style: 'actionable'
    })
    
    // Parse recommendations as list
    recommendations = recResult
      .split('\n')
      .filter(line => /^[0-9-*.]\s/.test(line))
      .map(line => line.replace(/^[0-9-*.]\s+/, '').trim())
      .filter(Boolean)
  }

  // Calculate metadata
  const processingTime = Date.now() - startTime
  
  return {
    videoId,
    title: videoInfo.title,
    thumbnail: videoInfo.thumbnail,
    summary,
    keyPoints,
    themes,
    sentiment,
    qaPairs,
    recommendations,
    detectedLanguage,
    targetLanguage,
    metadata: {
      processingTime,
      timestamp: new Date().toISOString(),
      model: summarizer.getConfig().model || 'gpt-4-turbo-preview',
      tokensUsed: 0 // Will be calculated from agent responses
    }
  }
}

/**
 * @label Quick YouTube Summary
 * @description Fast summary generation using agents
 */
export async function quickYouTubeSummary(
  url: string,
  targetLanguage?: string
): Promise<string> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await getVideoTranscript(videoId)
  const manager = getAgentManager()
  const summarizer = manager.getSummarizer()
  
  if (!summarizer) {
    throw new Error('Summarizer agent not initialized')
  }

  // Detect source language
  const { detectLanguage } = await import('./language-support')
  const detectedLanguage = detectLanguage(transcript)

  return await summarizer.summarize(transcript, {
    length: 'medium',
    format: 'paragraph',
    sourceLanguage: detectedLanguage,
    targetLanguage: targetLanguage || detectedLanguage
  })
}

/**
 * @label Generate Video Key Points
 * @description Extract key points using agents
 */
export async function generateVideoKeyPoints(url: string): Promise<string[]> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await getVideoTranscript(videoId)
  const manager = getAgentManager()
  const extractor = manager.getExtractor()
  
  if (!extractor) {
    throw new Error('Extractor agent not initialized')
  }

  const result = await extractor.extract(transcript, [
    'key point 1',
    'key point 2',
    'key point 3',
    'key point 4',
    'key point 5'
  ])

  return Object.values(result).filter(Boolean)
}

/**
 * @label Analyze Video Sentiment
 * @description Analyze video sentiment using agents
 */
export async function analyzeVideoSentiment(url: string): Promise<{
  sentiment: string
  confidence: string
  explanation: string
}> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await getVideoTranscript(videoId)
  const manager = getAgentManager()
  const analyzer = manager.getAnalyzer()
  
  if (!analyzer) {
    throw new Error('Analyzer agent not initialized')
  }

  const analysis = await analyzer.analyze(transcript, [
    'sentiment',
    'confidence level',
    'explanation'
  ])

  // Parse analysis
  const sentimentMatch = analysis.match(/sentiment:(.+?)(?:\n|$)/i)
  const confidenceMatch = analysis.match(/confidence:(.+?)(?:\n|$)/i)
  const explanationMatch = analysis.match(/explanation:(.+?)(?:\n|$)/is)

  return {
    sentiment: sentimentMatch?.[1].trim() || 'neutral',
    confidence: confidenceMatch?.[1].trim() || 'medium',
    explanation: explanationMatch?.[1].trim() || analysis
  }
}

/**
 * @label Ask Question About Video
 * @description Answer questions about video content using Q&A agent
 */
export async function askVideoQuestion(
  url: string,
  question: string
): Promise<string> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await getVideoTranscript(videoId)
  const manager = getAgentManager()
  const qaAgent = manager.getQAAgent()
  
  if (!qaAgent) {
    throw new Error('Q&A agent not initialized')
  }

  return await qaAgent.answer(question, transcript)
}

/**
 * @label Translate Video Summary
 * @description Translate video summary to another language
 */
export async function translateVideoSummary(
  url: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await getVideoTranscript(videoId)
  const manager = getAgentManager()
  const summarizer = manager.getSummarizer()
  const translator = manager.getTranslator()
  
  if (!summarizer || !translator) {
    throw new Error('Required agents not initialized')
  }

  // First summarize
  const summary = await summarizer.summarize(transcript)
  
  // Then translate
  return await translator.translate(summary, targetLanguage, sourceLanguage)
}

/**
 * @label Compare Multiple Videos
 * @description Compare summaries of multiple videos using agents
 */
export async function compareVideos(urls: string[]): Promise<{
  summaries: Array<{ url: string; title: string; summary: string }>
  comparison: string
  commonThemes: string[]
  differences: string[]
}> {
  if (urls.length < 2) {
    throw new Error('Need at least 2 videos to compare')
  }

  const manager = getAgentManager()
  const summarizer = manager.getSummarizer()
  const analyzer = manager.getAnalyzer()
  
  if (!summarizer || !analyzer) {
    throw new Error('Required agents not initialized')
  }

  // Get summaries for all videos
  const summaries = await Promise.all(
    urls.map(async (url) => {
      const videoId = extractVideoId(url)
      if (!videoId) return null
      
      const [info, transcript] = await Promise.all([
        getVideoInfo(videoId),
        getVideoTranscript(videoId)
      ])
      
      const summary = await summarizer.summarize(transcript, {
        length: 'short',
        format: 'paragraph'
      })
      
      return {
        url,
        title: info.title,
        summary
      }
    })
  ).then(results => results.filter(Boolean) as Array<{ url: string; title: string; summary: string }>)

  // Analyze comparison
  const combinedSummaries = summaries
    .map((s, i) => `Video ${i + 1} (${s.title}):\n${s.summary}`)
    .join('\n\n')

  const comparison = await analyzer.analyze(combinedSummaries, [
    'common themes across all videos',
    'key differences',
    'unique insights from each video'
  ])

  // Extract themes and differences
  const themesMatch = comparison.match(/common themes:(.+?)(?=key differences|$)/is)
  const differencesMatch = comparison.match(/differences:(.+?)(?=unique|$)/is)

  const commonThemes = themesMatch?.[1]
    .split(/[,\n]/)
    .map(t => t.trim())
    .filter(Boolean) || []

  const differences = differencesMatch?.[1]
    .split(/[,\n]/)
    .map(d => d.trim())
    .filter(Boolean) || []

  return {
    summaries,
    comparison,
    commonThemes,
    differences
  }
}
