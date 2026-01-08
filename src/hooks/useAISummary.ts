/**
 * @label Use AI Summary Hook
 * @description Enhanced custom hook using AI agents for video summarization
 */

import { useState, useCallback } from 'react'
import { processYouTubeVideo, quickYouTubeSummary, generateVideoKeyPoints, askVideoQuestion } from '../lib/youtube-ai'
import type { VideoSummaryResult, AnalysisOptions } from '../lib/youtube-ai'

// ============================================
// TYPES
// ============================================

interface UseAISummaryReturn {
  result: VideoSummaryResult | null
  summary: string
  keyPoints: string[]
  isProcessing: boolean
  error: string | null
  processVideo: (url: string, options?: AnalysisOptions) => Promise<void>
  quickSummary: (url: string) => Promise<void>
  extractKeyPoints: (url: string) => Promise<void>
  askQuestion: (url: string, question: string) => Promise<string>
  reset: () => void
}

// ============================================
// HOOK
// ============================================

/**
 * @label Use AI Summary Hook
 * @description Enhanced video processing with AI agents
 */
export const useAISummary = (): UseAISummaryReturn => {
  const [result, setResult] = useState<VideoSummaryResult | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * @label Process Full Video Analysis
   * @description Complete video analysis with all features
   */
  const processVideo = useCallback(async (url: string, options?: AnalysisOptions) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const analysisResult = await processYouTubeVideo(url, options)
      
      setResult(analysisResult)
      setSummary(analysisResult.summary)
      setKeyPoints(analysisResult.keyPoints)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process video'
      setError(errorMessage)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * @label Quick Summary
   * @description Fast summary generation
   */
  const quickSummary = useCallback(async (url: string) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const summaryText = await quickYouTubeSummary(url)
      setSummary(summaryText)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate summary'
      setError(errorMessage)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * @label Extract Key Points
   * @description Extract key points from video
   */
  const extractKeyPoints = useCallback(async (url: string) => {
    try {
      setIsProcessing(true)
      setError(null)
      
      const points = await generateVideoKeyPoints(url)
      setKeyPoints(points)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to extract key points'
      setError(errorMessage)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * @label Ask Question
   * @description Ask a question about the video
   */
  const askQuestion = useCallback(async (url: string, question: string): Promise<string> => {
    try {
      setIsProcessing(true)
      setError(null)
      
      return await askVideoQuestion(url, question)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to answer question'
      setError(errorMessage)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * @label Reset State
   * @description Clear all state
   */
  const reset = useCallback(() => {
    setResult(null)
    setSummary('')
    setKeyPoints([])
    setError(null)
  }, [])

  return {
    result,
    summary,
    keyPoints,
    isProcessing,
    error,
    processVideo,
    quickSummary,
    extractKeyPoints,
    askQuestion,
    reset
  }
}
