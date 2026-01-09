/**
 * Common test utilities and helpers
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render function with common providers
 * Extend this as you add more providers (Theme, Query, etc.)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Wrapper component with all providers
  const AllProviders = ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Mock data generators
 */
export const mockYouTubeVideo = {
  id: 'dQw4w9WgXcQ',
  title: 'Test Video Title',
  description: 'Test video description',
  duration: 180,
  thumbnail: 'https://example.com/thumb.jpg',
  channelTitle: 'Test Channel',
  publishedAt: '2024-01-01T00:00:00Z',
  viewCount: 1000000,
  likeCount: 50000,
}

export const mockSummary = {
  id: '123',
  videoId: 'dQw4w9WgXcQ',
  content: 'This is a test summary of the video content.',
  keyPoints: [
    'First key point',
    'Second key point',
    'Third key point',
  ],
  createdAt: '2024-01-01T00:00:00Z',
  model: 'gpt-4',
}

/**
 * Delay utility for testing async operations
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create mock API response
 */
export function mockApiResponse<T>(data: T, delay = 0) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/**
 * Create mock API error
 */
export function mockApiError(message: string, status = 400, delay = 0) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = new Error(message) as any
      error.response = { status, data: { message } }
      reject(error)
    }, delay)
  })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
