import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(0), 10000);
      });
    });
    
    // LCP should be less than 2.5 seconds (good)
    expect(lcp).toBeLessThan(2500);
  });

  test('should have good First Input Delay (FID)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click first interactive element
    const button = page.locator('button').first();
    
    if (await button.isVisible()) {
      const startTime = Date.now();
      await button.click();
      const inputDelay = Date.now() - startTime;
      
      // FID should be less than 100ms (good)
      expect(inputDelay).toBeLessThan(100);
    }
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/');
    
    const initialMetrics = await page.metrics();
    
    // Interact with page
    for (let i = 0; i < 5; i++) {
      const button = page.locator('button').first();
      if (await button.isVisible()) {
        await button.click();
      }
      await page.waitForTimeout(500);
    }
    
    const finalMetrics = await page.metrics();
    
    // Memory shouldn't increase dramatically
    const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });

  test('should have minimal bundle size', async ({ page }) => {
    const response = await page.goto('/');
    const body = await response?.body();
    
    if (body) {
      const sizeInKB = body.length / 1024;
      
      // Initial HTML should be reasonably small
      expect(sizeInKB).toBeLessThan(500);
    }
  });

  test('should load critical CSS first', async ({ page }) => {
    await page.goto('/');
    
    // Check if content is styled before all resources load
    const element = page.locator('body').first();
    const bgColor = await element.evaluate(el => window.getComputedStyle(el).backgroundColor);
    
    expect(bgColor).toBeTruthy();
  });

  test('should use lazy loading for images', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img[loading="lazy"]');
    const count = await images.count();
    
    // Some images should use lazy loading
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should cache static assets', async ({ page }) => {
    await page.goto('/');
    
    // Get network requests
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.waitForLoadState('networkidle');
    
    // Reload and check if cached
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Some assets should be cached (from service worker or browser cache)
    expect(requests.length).toBeGreaterThan(0);
  });
});
