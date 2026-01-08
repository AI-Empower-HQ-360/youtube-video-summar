/**
 * @label Enhanced Video Summary Component
 * @description Example component using AI agents for video analysis
 */

import { useState } from 'react'
import { useAISummary } from '../hooks/useAISummary'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LanguageSelectorPair } from './LanguageSelector'
import { DownloadButton } from './DownloadButton'

export function EnhancedVideoSummary() {
  const [url, setUrl] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState<string>('auto')
  const [targetLanguage, setTargetLanguage] = useState<string>('en')
  
  const {
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
  } = useAISummary()

  const handleFullAnalysis = async () => {
    if (!url) return
    
    await processVideo(url, {
      includeKeyPoints: true,
      includeThemes: true,
      includeSentiment: true,
      includeQA: true,
      includeRecommendations: true,
      summaryLength: 'medium',
      summaryFormat: 'structured',
      sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
      targetLanguage: targetLanguage || undefined
    })
  }

  const handleQuickSummary = async () => {
    if (!url) return
    await quickSummary(url)
  }

  const handleExtractKeyPoints = async () => {
    if (!url) return
    await extractKeyPoints(url)
  }

  const handleAskQuestion = async () => {
    if (!url || !question) return
    const response = await askQuestion(url, question)
    setAnswer(response)
  }

  const handleReset = () => {
    reset()
    setUrl('')
    setQuestion('')
    setAnswer('')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI-Powered YouTube Video Analysis</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🌐 Multi-language support: Summarize videos in any language and get results in your preferred language
        </p>
        
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button onClick={handleReset} variant="outline" disabled={isProcessing}>
            Reset
          </Button>
        </div>

        {/* Language Selection */}
        <LanguageSelectorPair
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceChange={setSourceLanguage}
          onTargetChange={setTargetLanguage}
        />

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleFullAnalysis}
            disabled={!url || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Full Analysis'}
          </Button>
          <Button
            onClick={handleQuickSummary}
            disabled={!url || isProcessing}
            variant="secondary"
          >
            Quick Summary
          </Button>
          <Button
            onClick={handleExtractKeyPoints}
            disabled={!url || isProcessing}
            variant="secondary"
          >
            Extract Key Points
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Summary Display */}
        {summary && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Summary</h3>
              <DownloadButton
                data={{ summary }}
                metadata={{
                  title: 'Video Summary',
                  date: new Date().toLocaleDateString()
                }}
                variant="outline"
                size="sm"
              />
            </div>
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {/* Full Result Display */}
        {result && (
          <div className="space-y-4">
            {/* Download Button - Top of Results */}
            <div className="flex justify-end">
              <DownloadButton
                data={result}
                metadata={{
                  title: result.title,
                  url: url,
                  date: new Date().toLocaleDateString(),
                  detectedLanguage: result.detectedLanguage,
                  targetLanguage: result.targetLanguage
                }}
                variant="default"
                showLabel={true}
              />
            </div>

            {/* Video Info */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full max-w-md rounded-lg"
              />
            </div>

            {/* Key Points */}
            {result.keyPoints.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Themes */}
            {result.themes.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Main Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {result.themes.map((theme, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment */}
            {result.sentiment && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Sentiment</h3>
                <p className="capitalize">{result.sentiment}</p>
              </div>
            )}

            {/* Q&A Pairs */}
            {result.qaPairs.length > 0 && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Questions & Answers</h3>
                <div className="space-y-3">
                  {result.qaPairs.map((qa, index) => (
                    <div key={index} className="border-l-4 border-indigo-400 pl-3">
                      <p className="font-semibold text-indigo-900">Q: {qa.question}</p>
                      <p className="text-gray-700 mt-1">A: {qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-decimal list-inside space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Processing Time: {result.metadata.processingTime}ms</p>
              <p>Model: {result.metadata.model}</p>
              {result.detectedLanguage && (
                <p>Detected Language: {result.detectedLanguage.toUpperCase()}</p>
              )}
              {result.targetLanguage && (
                <p>Output Language: {result.targetLanguage.toUpperCase()}</p>
              )}
              <p>Timestamp: {new Date(result.metadata.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Key Points Only Display */}
        {!result && keyPoints.length > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Key Points</h3>
              <DownloadButton
                data={{ keyPoints }}
                metadata={{
                  title: 'Video Key Points',
                  date: new Date().toLocaleDateString()
                }}
                variant="outline"
                size="sm"
              />
            </div>
            <ul className="list-disc list-inside space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Q&A Section */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold">Ask a Question</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="What question do you have about this video?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!url || isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!url || !question || isProcessing}
            >
              Ask
            </Button>
          </div>
          {answer && (
            <div className="p-3 bg-white border border-slate-300 rounded">
              <p className="font-semibold text-slate-900 mb-1">Answer:</p>
              <p className="text-slate-700">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
