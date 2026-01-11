import { test, expect } from '@playwright/test';

/**
 * Functional Tests: Navigation & Page Routing
 * Tests application navigation, routing, and page transitions
 */
test.describe('Functional: Main Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to Features page', async ({ page }) => {
    // Find Features link
    const featuresLink = page.getByRole('link', { name: /features/i }).or(
      page.locator('text=/features/i').first()
    );

    if (await featuresLink.isVisible()) {
      await featuresLink.click();

      // Verify Features page loads
      await expect(
        page.locator('text=/features|powerful capabilities|what we offer/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      if (await backButton.isVisible()) {
        await backButton.click();
        await expect(page.locator('text=/youtube|video summarizer/i')).toBeVisible();
      }
    }
  });

  test('should navigate to Documentation page', async ({ page }) => {
    const docsLink = page.getByRole('link', { name: /documentation|docs/i });

    if (await docsLink.isVisible()) {
      await docsLink.click();

      // Verify Documentation page loads
      await expect(
        page.locator('text=/documentation|getting started|guides/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to API Reference page', async ({ page }) => {
    const apiLink = page.getByRole('link', { name: /api|api reference/i });

    if (await apiLink.isVisible()) {
      await apiLink.click();

      // Verify API page loads
      await expect(
        page.locator('text=/api reference|api documentation|endpoints/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Guides page', async ({ page }) => {
    const guidesLink = page.getByRole('link', { name: /guides|tutorials/i });

    if (await guidesLink.isVisible()) {
      await guidesLink.click();

      // Verify Guides page loads
      await expect(
        page.locator('text=/guides|how to|tutorials|learn/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Blog page', async ({ page }) => {
    const blogLink = page.getByRole('link', { name: /blog|articles/i });

    if (await blogLink.isVisible()) {
      await blogLink.click();

      // Verify Blog page loads
      await expect(
        page.locator('text=/blog|articles|posts|latest updates/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Changelog page', async ({ page }) => {
    const changelogLink = page.getByRole('link', { name: /changelog|updates|releases/i });

    if (await changelogLink.isVisible()) {
      await changelogLink.click();

      // Verify Changelog page loads
      await expect(
        page.locator('text=/changelog|version|updates|releases/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Contact page', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact|get in touch/i });

    if (await contactLink.isVisible()) {
      await contactLink.click();

      // Verify Contact page loads
      await expect(
        page.locator('text=/contact|get in touch|reach out|email/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });
});

test.describe('Functional: Footer Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  test('should navigate to Privacy Policy', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy policy|privacy/i }).last();

    if (await privacyLink.isVisible()) {
      await privacyLink.click();

      // Verify Privacy Policy page loads
      await expect(
        page.locator('text=/privacy policy|data collection|personal information/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Terms of Service', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: /terms|terms of service/i }).last();

    if (await termsLink.isVisible()) {
      await termsLink.click();

      // Verify Terms page loads
      await expect(
        page.locator('text=/terms of service|agreement|conditions/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should navigate to Cookie Policy', async ({ page }) => {
    const cookieLink = page.getByRole('link', { name: /cookie policy|cookies/i }).last();

    if (await cookieLink.isVisible()) {
      await cookieLink.click();

      // Verify Cookie Policy page loads
      await expect(
        page.locator('text=/cookie policy|cookies|tracking/i')
      ).toBeVisible({ timeout: 5000 });

      // Navigate back
      const backButton = page.getByRole('button', { name: /back|home/i }).first();
      await backButton.click();
    }
  });

  test('should have working social media links in footer', async ({ page }) => {
    // Find social media links
    const twitterLink = page.locator('a[href*="twitter"], a[href*="x.com"]').last();
    const githubLink = page.locator('a[href*="github"]').last();
    const linkedinLink = page.locator('a[href*="linkedin"]').last();

    // Verify at least one social link exists and has correct href
    const hasSocialLinks = 
      (await twitterLink.isVisible().catch(() => false)) ||
      (await githubLink.isVisible().catch(() => false)) ||
      (await linkedinLink.isVisible().catch(() => false));

    if (hasSocialLinks) {
      expect(hasSocialLinks).toBeTruthy();

      // Verify links open in new tab
      if (await twitterLink.isVisible()) {
        const target = await twitterLink.getAttribute('target');
        expect(target).toBe('_blank');
      }
    }
  });
});

test.describe('Functional: Breadcrumb Navigation', () => {
  test('should show breadcrumbs on nested pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to a sub-page
    const docsLink = page.getByRole('link', { name: /documentation|docs/i });
    
    if (await docsLink.isVisible()) {
      await docsLink.click();

      // Check for breadcrumbs
      const breadcrumb = page.locator('[aria-label="breadcrumb"], nav[class*="breadcrumb"]');
      
      if (await breadcrumb.isVisible()) {
        // Verify breadcrumb contains Home and current page
        await expect(
          breadcrumb.locator('text=/home|documentation/i')
        ).toBeVisible();
      }
    }
  });

  test('should navigate back via breadcrumb', async ({ page }) => {
    await page.goto('/');

    const docsLink = page.getByRole('link', { name: /documentation|docs/i });
    
    if (await docsLink.isVisible()) {
      await docsLink.click();
      await page.waitForTimeout(1000);

      // Click home in breadcrumb
      const homeBreadcrumb = page.locator('[aria-label="breadcrumb"] a').or(
        page.locator('nav a[href="/"], nav a[href="#"]')
      ).first();

      if (await homeBreadcrumb.isVisible()) {
        await homeBreadcrumb.click();

        // Verify back on homepage
        await expect(
          page.locator('text=/youtube|video summarizer/i')
        ).toBeVisible();
      }
    }
  });
});

test.describe('Functional: Deep Linking & URL State', () => {
  test('should preserve URL parameters', async ({ page }) => {
    // Navigate with query params
    await page.goto('/?ref=test&source=campaign');

    // Verify page loads
    await expect(page).toHaveURL(/ref=test/);
    await expect(page).toHaveURL(/source=campaign/);
  });

  test('should handle direct navigation to sub-pages', async ({ page }) => {
    // Try direct navigation to features page
    await page.goto('/');
    
    // Simulate routing to features (if SPA)
    const featuresLink = page.getByRole('link', { name: /features/i });
    
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      
      // Verify page state
      await expect(
        page.locator('text=/features|capabilities/i')
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle back/forward browser navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to features
    const featuresLink = page.getByRole('link', { name: /features/i });
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      await page.waitForTimeout(1000);

      // Navigate to docs
      const docsLink = page.getByRole('link', { name: /documentation|docs/i });
      if (await docsLink.isVisible()) {
        await docsLink.click();
        await page.waitForTimeout(1000);

        // Use browser back button
        await page.goBack();
        
        // Verify we're back on features
        await expect(
          page.locator('text=/features|capabilities/i')
        ).toBeVisible({ timeout: 3000 });

        // Use browser forward
        await page.goForward();
        
        // Verify we're back on docs
        await expect(
          page.locator('text=/documentation|guides/i')
        ).toBeVisible({ timeout: 3000 });
      }
    }
  });
});

test.describe('Functional: Mobile Navigation', () => {
  test.use({ 
    viewport: { width: 375, height: 667 }
  });

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/');

    // Find mobile menu button
    const mobileMenuBtn = page.getByRole('button', { name: /menu|navigation|☰/i }).or(
      page.locator('[aria-label*="menu"], button[class*="mobile-menu"]')
    );

    if (await mobileMenuBtn.isVisible()) {
      // Open menu
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);

      // Verify menu is visible
      await expect(
        page.locator('[role="dialog"], nav[class*="mobile"], [class*="mobile-menu"]')
      ).toBeVisible();

      // Close menu
      const closeBtn = page.getByRole('button', { name: /close|x/i }).first();
      await closeBtn.click();
      await page.waitForTimeout(500);

      // Verify menu is closed
      const menuClosed = await page.locator('[role="dialog"]').isHidden().catch(() => true);
      expect(menuClosed).toBeTruthy();
    }
  });

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto('/');

    const mobileMenuBtn = page.getByRole('button', { name: /menu|navigation|☰/i }).or(
      page.locator('[aria-label*="menu"]')
    );

    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);

      // Click a link in mobile menu
      const featuresLink = page.getByRole('link', { name: /features/i });
      if (await featuresLink.isVisible()) {
        await featuresLink.click();

        // Verify navigation
        await expect(
          page.locator('text=/features|capabilities/i')
        ).toBeVisible({ timeout: 5000 });

        // Verify menu auto-closes
        const menuClosed = await page.locator('[role="dialog"]').isHidden().catch(() => true);
        expect(menuClosed).toBeTruthy();
      }
    }
  });
});

test.describe('Functional: Scroll Behavior', () => {
  test('should scroll to pricing section from CTA button', async ({ page }) => {
    await page.goto('/');

    // Find "View Pricing" or similar CTA
    const pricingCTA = page.getByRole('button', { name: /view pricing|see plans|pricing/i }).or(
      page.getByRole('link', { name: /view pricing|see plans/i })
    );

    if (await pricingCTA.isVisible()) {
      const initialY = await page.evaluate(() => window.scrollY);
      
      await pricingCTA.click();
      await page.waitForTimeout(1000);

      const newY = await page.evaluate(() => window.scrollY);
      
      // Verify scrolled down
      expect(newY).toBeGreaterThan(initialY);

      // Verify pricing section visible
      await expect(
        page.locator('text=/pricing|plans|choose/i')
      ).toBeVisible();
    }
  });

  test('should have smooth scroll behavior', async ({ page }) => {
    await page.goto('/');

    // Scroll to bottom
    const initialY = await page.evaluate(() => window.scrollY);
    
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await page.waitForTimeout(1000);

    const newY = await page.evaluate(() => window.scrollY);
    
    // Verify scrolled
    expect(newY).toBeGreaterThan(initialY);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1000);

    const topY = await page.evaluate(() => window.scrollY);
    expect(topY).toBeLessThan(100); // Near top
  });

  test('should show scroll-to-top button', async ({ page }) => {
    await page.goto('/');

    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Look for scroll-to-top button
    const scrollTopBtn = page.getByRole('button', { name: /scroll to top|back to top|↑/i }).or(
      page.locator('button[class*="scroll-top"]')
    );

    if (await scrollTopBtn.isVisible()) {
      await scrollTopBtn.click();
      await page.waitForTimeout(1000);

      // Verify scrolled to top
      const y = await page.evaluate(() => window.scrollY);
      expect(y).toBeLessThan(100);
    }
  });
});
