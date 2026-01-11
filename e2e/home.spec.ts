import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('should load the home page successfully', async ({ page }) => {
    // Wait for React to render
    await page.waitForSelector('h1, h2, [role="main"]', { timeout: 10000 });
    await expect(page).toHaveTitle(/VidNote|YouTube Video Summarizer/i);
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    // App uses header element with navigation buttons instead of nav element
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Check for sign-in or dashboard button in header
    const signInButton = page.getByRole('button', { name: /sign in|dashboard/i });
    await expect(signInButton).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have customer service chat widget', async ({ page }) => {
    // Look for chat button with MessageSquare icon - it has fixed positioning
    const chatWidget = page.locator('.fixed.bottom-6.right-6, [class*="fixed"][class*="bottom"]').first();
    await expect(chatWidget).toBeVisible({ timeout: 10000 });
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should load without network errors', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.waitForLoadState('networkidle');
    
    expect(failedRequests).toHaveLength(0);
  });
});
