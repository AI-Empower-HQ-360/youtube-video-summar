/**
 * @label Mock API Client
 * @description Mock Axios API client for testing
 */

import { vi } from 'vitest';
import { mockAPIResponses } from './youtube-api.mock';
import { mockAIResponses } from '../fixtures/summaries';

/**
 * @label Create Mock API Client
 * @description Creates a mocked version of the API client
 */
export function createMockAPIClient() {
  return {
    get: vi.fn((url: string) => {
      if (url.includes('/health')) {
        return Promise.resolve({
          data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: 1000,
          },
        });
      }

      if (url.includes('/youtube/transcript/')) {
        const videoId = url.split('/').pop();
        if (videoId === 'dQw4w9WgXcQ') {
          return Promise.resolve({ data: mockAPIResponses.transcriptSuccess });
        }
        return Promise.reject(new Error('Captions are disabled'));
      }

      return Promise.reject(new Error('Not found'));
    }),

    post: vi.fn((url: string, data: any) => {
      if (url.includes('/summary/generate')) {
        return Promise.resolve({ data: mockAIResponses.summary });
      }

      if (url.includes('/summary/keypoints')) {
        return Promise.resolve({ data: mockAIResponses.keyPoints });
      }

      if (url.includes('/summary/qa')) {
        return Promise.resolve({ data: mockAIResponses.qa });
      }

      if (url.includes('/summary/complete')) {
        return Promise.resolve({ data: mockAIResponses.complete });
      }

      if (url.includes('/youtube/validate')) {
        return Promise.resolve({
          data: {
            success: true,
            data: { valid: true },
          },
        });
      }

      return Promise.reject(new Error('Not found'));
    }),

    put: vi.fn(),
    delete: vi.fn(),
  };
}

/**
 * @label Mock Axios
 * @description Mock the axios module
 */
export const mockAxios = {
  create: vi.fn(() => createMockAPIClient()),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
