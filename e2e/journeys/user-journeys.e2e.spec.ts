import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests: Complete User Journeys
 * Tests full user flows from start to finish
 */
test.describe('E2E: New User Journey - Video Summarization', () => {
  test('should complete full new user journey: visit → summarize → view results', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');
    
    // Verify homepage loads
    await expect(
      page.locator('text=/youtube|video summarizer|transform/i').first()
    ).toBeVisible();

    // Step 2: Accept cookies if present
    const cookieButton = page.getByRole('button', { name: /accept|got it|okay/i });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }

    // Step 3: Scroll to view features
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Step 4: Scroll back to input
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Step 5: Enter YouTube URL
    const urlInput = page.locator('input[type="text"]').first();
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    await urlInput.fill(testUrl);
    await expect(urlInput).toHaveValue(testUrl);

    // Step 6: Click Quick Summary
    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Step 7: Wait for processing
    await expect(
      page.locator('text=/processing|generating|analyzing/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Step 8: Wait for results
    await expect(
      page.locator('[class*="result"], [class*="summary"]').first()
    ).toBeVisible({ timeout: 30000 });

    // Step 9: Verify video info displayed
    await expect(
      page.locator('img[alt*="thumbnail"], img[src*="youtube"]').first()
    ).toBeVisible();

    // Step 10: Copy summary
    const copyButton = page.getByRole('button', { name: /copy/i }).first();
    if (await copyButton.isVisible()) {
      await copyButton.click();
      
      await expect(
        page.locator('text=/copied|success/i')
      ).toBeVisible({ timeout: 3000 });
    }

    // Step 11: Try another video
    const resetButton = page.getByRole('button', { name: /reset|clear|new/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await expect(urlInput).toHaveValue('');
    }
  });
});

test.describe('E2E: Authenticated User Journey - Premium Features', () => {
  test('should complete authenticated user journey: sign-in → upgrade → use features', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');

    // Step 2: Navigate to sign-in
    const authButton = page.getByRole('button', { name: /sign in|login|get started/i });
    await authButton.click();

    // Step 3: Sign in (using localStorage for speed)
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'premiumuser@example.com',
        name: 'Premium User',
        subscription: 'free'
      }));
    });
    await page.goto('/');

    // Verify logged in
    await expect(
      page.getByRole('button', { name: /user|profile|premium user/i })
    ).toBeVisible();

    // Step 4: View current usage in dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|premium user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify dashboard loads
    await expect(page.locator('text=/dashboard|summaries|usage/i')).toBeVisible();

    // Step 5: Navigate back to home
    const backButton = page.getByRole('button', { name: /back|home/i }).first();
    await backButton.click();

    // Step 6: Scroll to pricing
    await page.evaluate(() => {
      const pricingSection = document.querySelector('[id*="pricing"]') || 
                            document.querySelector('h2:has-text("Pricing")');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await page.waitForTimeout(1000);

    // Step 7: View pricing plans
    await expect(page.locator('text=/pricing|plans/i')).toBeVisible();

    // Step 8: Select Pro plan
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro|upgrade to pro/i }).first();
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      // Verify checkout or payment page
      await expect(
        page.locator('text=/checkout|payment|order summary/i')
      ).toBeVisible({ timeout: 5000 });
    }

    // Step 9: Return to home
    const backToHomeButton = page.getByRole('button', { name: /back|cancel/i }).first();
    if (await backToHomeButton.isVisible()) {
      await backToHomeButton.click();
    }

    // Step 10: Use summarization feature
    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    // Verify processing
    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('E2E: Documentation & Support Journey', () => {
  test('should navigate through documentation and support resources', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');

    // Step 2: Open navigation menu
    const menuButton = page.getByRole('button', { name: /menu|hamburger|navigation/i }).or(
      page.locator('[aria-label*="menu"], [data-testid="menu-button"]')
    );

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }

    // Step 3: Navigate to Documentation
    const docsLink = page.getByRole('link', { name: /documentation|docs/i }).or(
      page.locator('text=/documentation|docs/i')
    );

    if (await docsLink.isVisible()) {
      await docsLink.click();

      // Verify documentation page loads
      await expect(
        page.locator('text=/documentation|getting started|guide/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      if (await backButton.isVisible()) {
        await backButton.click();
      }
    }

    // Step 4: Navigate to API Reference
    const apiLink = page.getByRole('link', { name: /api|api reference/i }).or(
      page.locator('text=/api reference|api docs/i')
    );

    if (await apiLink.isVisible()) {
      await apiLink.click();

      // Verify API page loads
      await expect(
        page.locator('text=/api|endpoints|authentication/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      if (await backButton.isVisible()) {
        await backButton.click();
      }
    }

    // Step 5: Open customer support chat
    const chatWidget = page.locator('[data-testid="chat-widget"], [class*="chat"]').or(
      page.getByRole('button', { name: /chat|support|help/i })
    );

    if (await chatWidget.isVisible()) {
      await chatWidget.click();

      // Verify chat opens
      await expect(
        page.locator('text=/how can we help|chat with us|support/i')
      ).toBeVisible({ timeout: 3000 });

      // Close chat
      const closeButton = page.getByRole('button', { name: /close|x/i }).last();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });
});

test.describe('E2E: Multi-Language User Journey', () => {
  test('should use app in different languages', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');

    // Step 2: Find language selector
    const languageSelector = page.getByRole('button', { name: /language|english|español|français/i }).or(
      page.locator('[data-testid="language-selector"]')
    );

    if (await languageSelector.isVisible()) {
      // Step 3: Open language menu
      await languageSelector.click();
      await page.waitForTimeout(500);

      // Step 4: Select Spanish
      const spanishOption = page.getByRole('menuitem', { name: /español|spanish/i }).or(
        page.locator('text=/español|spanish/i')
      );

      if (await spanishOption.isVisible()) {
        await spanishOption.click();
        await page.waitForTimeout(1000);

        // Verify Spanish content
        await expect(
          page.locator('text=/resumen|analizar|vídeo/i')
        ).toBeVisible({ timeout: 5000 });

        // Step 5: Switch back to English
        const langSelectorAgain = page.getByRole('button', { name: /idioma|language|español/i });
        if (await langSelectorAgain.isVisible()) {
          await langSelectorAgain.click();
          await page.waitForTimeout(500);

          const englishOption = page.getByRole('menuitem', { name: /english|inglés/i });
          if (await englishOption.isVisible()) {
            await englishOption.click();
            await page.waitForTimeout(1000);

            // Verify English content
            await expect(
              page.locator('text=/summary|analyze|video/i')
            ).toBeVisible();
          }
        }
      }
    }
  });
});

test.describe('E2E: Mobile User Journey', () => {
  test.use({ 
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
  });

  test('should complete mobile user journey', async ({ page }) => {
    // Step 1: Visit homepage on mobile
    await page.goto('/');

    // Step 2: Verify mobile-optimized layout
    await expect(page.locator('body')).toBeVisible();

    // Step 3: Open mobile menu
    const mobileMenuButton = page.getByRole('button', { name: /menu|hamburger|☰/i }).or(
      page.locator('[aria-label*="menu"], button[class*="menu"]')
    );

    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      // Verify menu opens
      await expect(
        page.locator('[role="dialog"], [class*="mobile-menu"]').or(
          page.locator('nav:visible')
        )
      ).toBeVisible();

      // Close menu
      const closeButton = page.getByRole('button', { name: /close|x/i }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }

    // Step 4: Enter URL on mobile
    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.tap();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Step 5: Generate summary on mobile
    const generateButton = page.getByRole('button', { name: /quick summary|summarize/i });
    await generateButton.tap();

    // Step 6: Verify loading state
    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Step 7: Scroll to view results (mobile)
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, 500));

    // Step 8: Verify mobile-optimized results display
    await expect(
      page.locator('[class*="result"], [class*="summary"]').first()
    ).toBeVisible({ timeout: 30000 });
  });
});

test.describe('E2E: Error Recovery Journey', () => {
  test('should recover from errors and continue using app', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');

    // Step 2: Try invalid URL
    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.fill('not-a-valid-url');

    const generateButton = page.getByRole('button', { name: /quick summary|summarize/i });
    
    // Verify button disabled or error shown
    const isDisabled = await generateButton.isDisabled();
    expect(isDisabled).toBeTruthy();

    // Step 3: Clear and enter valid URL
    await urlInput.clear();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Step 4: Verify button now enabled
    await expect(generateButton).toBeEnabled();

    // Step 5: Generate summary
    await generateButton.click();

    // Step 6: Wait for processing
    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Step 7: Simulate network issue (go offline)
    await page.context().setOffline(true);
    await page.waitForTimeout(2000);

    // Step 8: Try to generate another summary (should fail)
    const resetButton = page.getByRole('button', { name: /reset|clear/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();
    }

    await urlInput.fill('https://www.youtube.com/watch?v=9bZkp7q19f0');
    await generateButton.click();

    // Verify error message
    await expect(
      page.locator('text=/network error|connection failed|offline/i')
    ).toBeVisible({ timeout: 10000 });

    // Step 9: Recover - go back online
    await page.context().setOffline(false);
    await page.waitForTimeout(1000);

    // Step 10: Try again successfully
    const retryButton = page.getByRole('button', { name: /retry|try again/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
    } else {
      await generateButton.click();
    }

    // Verify processing resumes
    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('E2E: Power User Journey - Multiple Features', () => {
  test('should use multiple features in single session', async ({ page }) => {
    // Step 1: Visit and authenticate
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'poweruser@example.com',
        name: 'Power User',
        subscription: 'pro'
      }));
    });
    await page.reload();

    // Step 2: Generate Quick Summary
    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    const quickSummaryBtn = page.getByRole('button', { name: /quick summary/i });
    await quickSummaryBtn.click();

    await page.waitForTimeout(5000);

    // Step 3: Generate Full Analysis
    const fullAnalysisBtn = page.getByRole('button', { name: /full analysis/i });
    if (await fullAnalysisBtn.isVisible()) {
      await fullAnalysisBtn.click();
      await page.waitForTimeout(3000);
    }

    // Step 4: Generate Key Points
    const keyPointsBtn = page.getByRole('button', { name: /key points/i });
    if (await keyPointsBtn.isVisible()) {
      await keyPointsBtn.click();
      await page.waitForTimeout(3000);
    }

    // Step 5: Copy all sections
    const copyButtons = page.getByRole('button', { name: /copy/i });
    const count = await copyButtons.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      await copyButtons.nth(i).click();
      await page.waitForTimeout(1000);
    }

    // Step 6: View dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|power user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify usage stats updated
    await expect(page.locator('text=/summaries|usage|videos/i')).toBeVisible();

    // Step 7: Navigate back
    const backButton = page.getByRole('button', { name: /back|home/i }).first();
    await backButton.click();

    // Step 8: Process another video
    await urlInput.clear();
    await urlInput.fill('https://www.youtube.com/watch?v=9bZkp7q19f0');
    await quickSummaryBtn.click();

    await expect(
      page.locator('text=/processing|generating/i').first()
    ).toBeVisible({ timeout: 5000 });
  });
});
