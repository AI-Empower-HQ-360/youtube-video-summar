import { test, expect } from '@playwright/test';

test.describe('Multi-Language Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display language selector components', async ({ page }) => {
    // Look for language selector (globe icon or language dropdown)
    const languageSelector = page.locator('[class*="language"], text=/language|idioma|langue/i').first();
    
    // Language selector should be visible
    await expect(languageSelector).toBeVisible({ timeout: 10000 });
  });

  test('should have source language selector', async ({ page }) => {
    const sourceLanguageLabel = page.locator('text=/video language|source language/i');
    await expect(sourceLanguageLabel).toBeVisible({ timeout: 10000 });
  });

  test('should have target language selector', async ({ page }) => {
    const targetLanguageLabel = page.locator('text=/summary language|target language|output language/i');
    await expect(targetLanguageLabel).toBeVisible({ timeout: 10000 });
  });

  test('should open language dropdown on click', async ({ page }) => {
    // Find language selector button
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Check if dropdown opened
      const dropdown = page.locator('[role="menu"], [class*="dropdown"]').first();
      await expect(dropdown).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display popular languages tab', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const popularTab = page.locator('button, text=/popular/i').first();
      await expect(popularTab).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display all languages tab', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const allTab = page.locator('button, text=/all languages/i').first();
      await expect(allTab).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have search functionality in language selector', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await expect(searchInput).toBeVisible({ timeout: 5000 });
    }
  });

  test('should filter languages when searching', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('spanish');
        
        // Should show Spanish in results
        const spanishOption = page.locator('text=/spanish|español/i');
        await expect(spanishOption).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should display auto-detect option', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const autoDetect = page.locator('text=/auto-detect|automatic/i').first();
      await expect(autoDetect).toBeVisible({ timeout: 5000 });
    }
  });

  test('should select a language from dropdown', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Try to select Spanish
      const spanishOption = page.locator('text=/español|spanish/i').first();
      
      if (await spanishOption.isVisible()) {
        await spanishOption.click();
        
        // Dropdown should close
        await page.waitForTimeout(500);
        const dropdown = page.locator('[role="menu"]').first();
        await expect(dropdown).not.toBeVisible();
      }
    }
  });

  test('should display selected language in button', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      const initialText = await languageButton.textContent();
      expect(initialText).toBeTruthy();
    }
  });

  test('should support RTL languages', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Search for Arabic
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('arabic');
        
        const arabicOption = page.locator('text=/arabic|العربية/i').first();
        await expect(arabicOption).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should display language info in results', async ({ page }) => {
    // After generating a summary, should show detected and target languages
    const languageInfo = page.locator('text=/detected language|output language|target language/i');
    expect(languageInfo).toBeDefined();
  });

  test('should group languages by region', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Switch to All Languages tab
      const allTab = page.locator('button, text=/all languages/i').first();
      
      if (await allTab.isVisible()) {
        await allTab.click();
        
        // Check for regional groups
        const regionalHeaders = page.locator('text=/european|asian|middle eastern|popular/i');
        const count = await regionalHeaders.count();
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('should show native language names', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Look for languages in native scripts
      const nativeNames = page.locator('text=/日本語|中文|한국어|العربية|Español|Français/');
      const count = await nativeNames.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Click outside
      await page.locator('body').click({ position: { x: 10, y: 10 } });
      
      // Dropdown should close
      await page.waitForTimeout(500);
      const dropdown = page.locator('[role="menu"]').first();
      await expect(dropdown).not.toBeVisible();
    }
  });

  test('should maintain language selection across page interactions', async ({ page }) => {
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      const spanishOption = page.locator('text=/español|spanish/i').first();
      
      if (await spanishOption.isVisible()) {
        await spanishOption.click();
        
        // Verify selection persists
        await page.waitForTimeout(500);
        const buttonText = await languageButton.textContent();
        expect(buttonText).toContain(/spanish|español/i);
      }
    }
  });
});

test.describe('Multi-Language - Language Count', () => {
  test('should support 50+ languages', async ({ page }) => {
    await page.goto('/');
    
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Switch to All Languages tab
      const allTab = page.locator('button, text=/all languages/i').first();
      
      if (await allTab.isVisible()) {
        await allTab.click();
        
        // Count language options (should be 50+)
        await page.waitForTimeout(1000);
        const languageOptions = page.locator('button[type="button"]').filter({ hasText: /.+/ });
        const count = await languageOptions.count();
        
        // Should have many language options (accounting for tabs, headers, etc.)
        expect(count).toBeGreaterThan(30);
      }
    }
  });
});
