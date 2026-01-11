import { test, expect } from '@playwright/test';

/**
 * Functional Tests: Complete Video Summarization Workflows
 * Tests end-to-end video summarization functionality with real user scenarios
 */
test.describe('Functional: Video Summarization - Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full video summarization workflow', async ({ page }) => {
    // Step 1: Enter YouTube URL
    const urlInput = page.locator('input[type="text"]').first();
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    await urlInput.fill(testUrl);
    await expect(urlInput).toHaveValue(testUrl);

    // Step 2: Verify URL validation passes
    await expect(urlInput).not.toHaveClass(/error|invalid/);

    // Step 3: Click Quick Summary button
    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await expect(quickSummaryBtn).toBeVisible();
    await quickSummaryBtn.click();

    // Step 4: Verify loading state
    await expect(
      page.locator('text=/processing|generating|analyzing/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Step 5: Wait for summary to load
    await expect(
      page.locator('[data-testid="summary-result"]').or(page.locator('text=/summary|key points/i'))
    ).toBeVisible({ timeout: 30000 });

    // Step 6: Verify summary content is displayed
    const summarySection = page.locator('[class*="result"], [class*="summary"]').first();
    await expect(summarySection).toBeVisible();

    // Step 7: Verify video information is displayed
    await expect(
      page.locator('img[alt*="thumbnail"], img[src*="youtube"]').first()
    ).toBeVisible();
  });

  test('should generate all content types (Quick Summary, Full Analysis, Key Points)', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    // Test Quick Summary
    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();
    
    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });
    
    await page.waitForTimeout(2000); // Allow processing to complete

    // Test Full Analysis
    const fullAnalysisBtn = page.getByRole('button', { name: /full analysis/i });
    if (await fullAnalysisBtn.isVisible()) {
      await fullAnalysisBtn.click();
      await expect(
        page.locator('text=/processing|generating/i').first()
      ).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(2000);
    }

    // Test Key Points
    const keyPointsBtn = page.getByRole('button', { name: /key points/i });
    if (await keyPointsBtn.isVisible()) {
      await keyPointsBtn.click();
      await expect(
        page.locator('text=/processing|generating/i').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle video URL with various YouTube formats', async ({ page }) => {
    const urlFormats = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    ];

    const urlInput = page.locator('input[type="text"]').first();

    for (const url of urlFormats) {
      // Clear previous input
      await urlInput.clear();
      await urlInput.fill(url);

      // Verify URL is accepted
      const generateButton = page.getByRole('button', { name: /quick summary|summarize/i });
      await expect(generateButton).toBeEnabled();

      // Clear for next iteration
      const resetButton = page.getByRole('button', { name: /reset|clear/i });
      if (await resetButton.isVisible()) {
        await resetButton.click();
      }
    }
  });

  test('should reject invalid YouTube URLs', async ({ page }) => {
    const invalidUrls = [
      'not-a-url',
      'https://www.google.com',
      'https://vimeo.com/123456',
      'youtube.com',
      'www.youtube.com',
    ];

    const urlInput = page.locator('input[type="text"]').first();

    for (const url of invalidUrls) {
      await urlInput.clear();
      await urlInput.fill(url);

      // Verify button is disabled or error shown
      const generateButton = page.getByRole('button', { name: /quick summary|summarize/i });
      
      const isDisabled = await generateButton.isDisabled();
      const hasError = await page.locator('text=/invalid|error/i').isVisible().catch(() => false);
      
      expect(isDisabled || hasError).toBeTruthy();

      // Clear for next iteration
      await urlInput.clear();
    }
  });

  test('should display video metadata (title, thumbnail)', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Wait for video info to load
    await page.waitForTimeout(3000);

    // Verify thumbnail is displayed
    const thumbnail = page.locator('img[alt*="thumbnail"], img[src*="youtube"]').first();
    await expect(thumbnail).toBeVisible({ timeout: 10000 });

    // Verify video title is displayed
    await expect(
      page.locator('text=/Never Gonna Give You Up|Rick Astley/i').or(
        page.locator('[data-testid="video-title"]')
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('should allow copying generated content', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Wait for summary to be generated
    await page.waitForTimeout(5000);

    // Find and click copy button
    const copyButton = page.getByRole('button', { name: /copy/i }).first();
    await copyButton.click();

    // Verify success feedback (copied icon or toast)
    await expect(
      page.locator('text=/copied|success/i').or(
        page.locator('[data-testid="check-icon"]')
      )
    ).toBeVisible({ timeout: 3000 });
  });

  test('should reset form and clear results', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    await page.waitForTimeout(3000);

    // Click reset button
    const resetButton = page.getByRole('button', { name: /reset|clear|start over/i });
    await resetButton.click();

    // Verify form is reset
    await expect(urlInput).toHaveValue('');

    // Verify results are cleared
    const summarySection = page.locator('[class*="result"], [class*="summary"]').first();
    const isHidden = await summarySection.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });
});

test.describe('Functional: Video Summarization - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);

    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Verify error message
    await expect(
      page.locator('text=/network error|connection failed|offline/i')
    ).toBeVisible({ timeout: 10000 });

    // Re-enable network
    await page.context().setOffline(false);
  });

  test('should handle video unavailable error', async ({ page }) => {
    // Use a URL that likely doesn't exist or is private
    const testUrl = 'https://www.youtube.com/watch?v=INVALID_VIDEO_ID_12345';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Verify error message
    await expect(
      page.locator('text=/unavailable|not found|cannot access|error/i')
    ).toBeVisible({ timeout: 15000 });
  });

  test('should handle timeout errors', async ({ page }) => {
    // This test would need backend support or mocking
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Check if timeout is handled (wait longer than expected)
    await page.waitForTimeout(35000);

    // Verify either success or timeout error
    const hasError = await page.locator('text=/timeout|taking too long/i').isVisible().catch(() => false);
    const hasSuccess = await page.locator('[class*="result"], [class*="summary"]').isVisible().catch(() => false);
    
    expect(hasError || hasSuccess).toBeTruthy();
  });
});

test.describe('Functional: Video Summarization - Multiple Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle multiple consecutive summarizations', async ({ page }) => {
    const urls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=9bZkp7q19f0',
    ];

    const urlInput = page.locator('input[type="text"]').first();

    for (const url of urls) {
      // Reset if needed
      const resetButton = page.getByRole('button', { name: /reset|clear/i });
      if (await resetButton.isVisible()) {
        await resetButton.click();
      }

      // Enter new URL
      await urlInput.fill(url);

      // Generate summary
      const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
      await quickSummaryBtn.click();

      // Wait for processing
      await page.waitForTimeout(5000);

      // Verify summary is generated
      await expect(
        page.locator('[class*="result"], [class*="summary"]').first()
      ).toBeVisible({ timeout: 30000 });
    }
  });

  test('should expand and collapse summary sections', async ({ page }) => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const urlInput = page.locator('input[type="text"]').first();
    
    await urlInput.fill(testUrl);

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    await page.waitForTimeout(5000);

    // Find accordion sections
    const accordionTriggers = page.locator('[role="button"][aria-expanded]');
    const count = await accordionTriggers.count();

    if (count > 0) {
      // Click to expand/collapse
      await accordionTriggers.first().click();
      await page.waitForTimeout(500);

      // Verify state changed
      const isExpanded = await accordionTriggers.first().getAttribute('aria-expanded');
      expect(isExpanded).toBeTruthy();

      // Collapse
      await accordionTriggers.first().click();
      await page.waitForTimeout(500);

      const isCollapsed = await accordionTriggers.first().getAttribute('aria-expanded');
      expect(isCollapsed).toBe('false');
    }
  });
});
