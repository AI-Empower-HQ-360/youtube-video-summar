/**
 * @label Test Helpers - Common Utilities
 * @description Shared testing utilities and helpers
 */

import React from 'react';
import { vi } from 'vitest';
import { setupMockSpark, cleanupMockSpark } from '../mocks/spark-llm.mock';

/**
 * @label Wait For
 * @description Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * @label Wait For Element
 * @description Wait for an element to appear in the DOM
 */
export async function waitForElement(
  selector: string,
  timeout: number = 5000
): Promise<Element> {
  return waitFor(
    () => {
      const element = document.querySelector(selector);
      return element !== null;
    },
    timeout
  ).then(() => document.querySelector(selector)!);
}

/**
 * @label Mock LocalStorage
 * @description Create a mock localStorage for testing
 */
export function createMockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

/**
 * @label Mock Clipboard
 * @description Create a mock clipboard API for testing
 */
export function createMockClipboard() {
  let clipboardData = '';

  return {
    writeText: vi.fn(async (text: string) => {
      clipboardData = text;
      return Promise.resolve();
    }),
    readText: vi.fn(async () => {
      return Promise.resolve(clipboardData);
    }),
  };
}

/**
 * @label Setup Test Environment
 * @description Setup common test environment mocks
 */
export function setupTestEnvironment() {
  // Mock window.spark
  setupMockSpark();

  // Mock localStorage
  const mockLocalStorage = createMockLocalStorage();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  // Mock clipboard
  const mockClipboard = createMockClipboard();
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
  });

  // Mock fetch
  global.fetch = vi.fn();

  return {
    localStorage: mockLocalStorage,
    clipboard: mockClipboard,
    fetch: global.fetch,
  };
}

/**
 * @label Cleanup Test Environment
 * @description Cleanup test environment after tests
 */
export function cleanupTestEnvironment() {
  cleanupMockSpark();
  vi.clearAllMocks();
  vi.restoreAllMocks();
}

/**
 * @label Create Test Wrapper
 * @description Create a wrapper component for testing with providers
 */
export function createTestWrapper(options: {
  initialRoute?: string;
} = {}) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
}

/**
 * @label Delay
 * @description Simple delay helper
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @label Generate Random String
 * @description Generate random string for test data
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * @label Create Test User
 * @description Create mock user data for testing
 */
export function createTestUser(overrides = {}) {
  return {
    id: generateRandomString(10),
    email: `test-${generateRandomString(5)}@example.com`,
    name: 'Test User',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
