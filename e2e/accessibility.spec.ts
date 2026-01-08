import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // First focusable element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');
    
    // Check that inputs have associated labels
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const id = await input.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = await label.count() > 0;
        
        // Either has a label or aria-label
        expect(labelExists || ariaLabel).toBeTruthy();
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have proper ARIA roles', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper roles
    const nav = page.locator('nav');
    if (await nav.count() > 0) {
      const role = await nav.getAttribute('role');
      expect(role === 'navigation' || role === null).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const contrastViolations = contrastResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Check for sr-only elements or aria-labels
    const ariaLabels = await page.locator('[aria-label]').count();
    const ariaDescribedBy = await page.locator('[aria-describedby]').count();
    
    expect(ariaLabels + ariaDescribedBy).toBeGreaterThan(0);
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should not have duplicate IDs', async ({ page }) => {
    await page.goto('/');
    
    const duplicateIdResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();
    
    const duplicateIdViolations = duplicateIdResults.violations.filter(
      v => v.id === 'duplicate-id'
    );
    
    expect(duplicateIdViolations).toHaveLength(0);
  });
});

test.describe('Accessibility - Language Selector', () => {
  test('language selector should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find language selector and navigate with keyboard
    const languageButton = page.locator('button').filter({ hasText: /auto-detect|english|select language/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.focus();
      await page.keyboard.press('Enter');
      
      // Dropdown should open
      const dropdown = page.locator('[role="menu"]').first();
      await expect(dropdown).toBeVisible({ timeout: 5000 });
      
      // Should be able to navigate with arrow keys
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      
      // Close with Escape
      await page.keyboard.press('Escape');
      await expect(dropdown).not.toBeVisible();
    }
  });
});
