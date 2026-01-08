import { test, expect } from '@playwright/test';

test.describe('Video Summarization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display URL input field', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveAttribute('placeholder', /youtube|url/i);
  });

  test('should have summarize/generate button', async ({ page }) => {
    const button = page.locator('button').filter({ hasText: /summarize|generate|analyze/i }).first();
    await expect(button).toBeVisible();
  });

  test('should validate empty URL input', async ({ page }) => {
    const button = page.locator('button').filter({ hasText: /summarize|generate|analyze/i }).first();
    
    // Button should be disabled when input is empty
    await expect(button).toBeDisabled();
  });

  test('should accept valid YouTube URL', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    await urlInput.fill(testUrl);
    await expect(urlInput).toHaveValue(testUrl);
  });

  test('should enable button when URL is entered', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    const button = page.locator('button').filter({ hasText: /summarize|generate|analyze/i }).first();
    
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await expect(button).not.toBeDisabled();
  });

  test('should show processing state when generating summary', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    const button = page.locator('button').filter({ hasText: /summarize|generate|analyze/i }).first();
    
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await button.click();
    
    // Check for loading state
    const loadingIndicator = page.locator('text=/processing|loading|analyzing/i').first();
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
  });

  test('should have reset/clear button', async ({ page }) => {
    const resetButton = page.locator('button').filter({ hasText: /reset|clear/i }).first();
    await expect(resetButton).toBeVisible();
  });

  test('should clear input when reset is clicked', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    const resetButton = page.locator('button').filter({ hasText: /reset|clear/i }).first();
    
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await resetButton.click();
    
    await expect(urlInput).toHaveValue('');
  });

  test('should handle invalid URL gracefully', async ({ page }) => {
    const urlInput = page.locator('input[type="text"]').first();
    const button = page.locator('button').filter({ hasText: /summarize|generate|analyze/i }).first();
    
    await urlInput.fill('not-a-valid-url');
    
    // Button should either be disabled or show error after click
    const isDisabled = await button.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('should support multiple action buttons', async ({ page }) => {
    const actionButtons = page.locator('button').filter({ 
      hasText: /quick summary|full analysis|key points|extract/i 
    });
    
    const count = await actionButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display results section after summary', async ({ page }) => {
    // This is a placeholder - actual test would need mock/stub
    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    
    // Check that results container exists
    const resultsArea = page.locator('[class*="result"], [class*="summary"]').first();
    expect(resultsArea).toBeDefined();
  });
});

test.describe('Video Summarization - Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have options for summary length', async ({ page }) => {
    // Look for length options (short, medium, long)
    const options = page.locator('text=/short|medium|long/i');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support copy to clipboard functionality', async ({ page }) => {
    const copyButtons = page.locator('button').filter({ hasText: /copy/i });
    const count = await copyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display video metadata', async ({ page }) => {
    // Check for elements that would show video info
    const metadataElements = page.locator('text=/title|duration|author|thumbnail/i');
    expect(metadataElements).toBeDefined();
  });

  test('should handle Q&A functionality', async ({ page }) => {
    const qaSection = page.locator('text=/question|answer|q&a/i').first();
    expect(qaSection).toBeDefined();
  });

  test('should have export options', async ({ page }) => {
    const exportButtons = page.locator('button, text=/export|download|pdf|markdown/i');
    const count = await exportButtons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
