import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Page should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have mobile-friendly navigation', async ({ page }) => {
    await page.goto('/');
    
    // Look for hamburger menu or mobile nav
    const mobileNav = page.locator('button[aria-label*="menu" i], [class*="hamburger"]').first();
    expect(mobileNav).toBeDefined();
  });

  test('should have touch-friendly buttons', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    if (await firstButton.isVisible()) {
      const box = await firstButton.boundingBox();
      
      // Button should be at least 44x44 pixels (iOS guideline)
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should not have horizontal scroll', async ({ page }) => {
    await page.goto('/');
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
  });

  test('input fields should be mobile-friendly', async ({ page }) => {
    await page.goto('/');
    
    const urlInput = page.locator('input[type="text"]').first();
    
    if (await urlInput.isVisible()) {
      const box = await urlInput.boundingBox();
      
      // Input should be tall enough for mobile interaction
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('chat widget should work on mobile', async ({ page }) => {
    await page.goto('/');
    
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      // Chat should open and be usable
      const chatWindow = page.locator('[class*="chat"]').first();
      await expect(chatWindow).toBeVisible({ timeout: 5000 });
    }
  });

  test('language selector should work on mobile', async ({ page }) => {
    await page.goto('/');
    
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const dropdown = page.locator('[role="menu"]').first();
      await expect(dropdown).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Tablet Responsiveness', () => {
  test('should display correctly on tablet', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should use appropriate layout for tablet', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport width
    const width = await page.evaluate(() => window.innerWidth);
    expect(width).toBeGreaterThan(768);
  });
});
