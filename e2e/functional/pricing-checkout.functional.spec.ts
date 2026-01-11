import { test, expect } from '@playwright/test';

/**
 * Functional Tests: Pricing & Checkout Workflows
 * Tests complete pricing selection and checkout processes
 */
test.describe('Functional: Pricing & Plan Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display pricing section on homepage', async ({ page }) => {
    // Scroll to pricing section
    await page.evaluate(() => {
      const pricingSection = document.querySelector('[id*="pricing"]') || 
                            document.querySelector('h2:has-text("Pricing")');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    await page.waitForTimeout(1000);

    // Verify pricing cards are visible
    await expect(
      page.locator('text=/pricing|plans|choose your plan/i')
    ).toBeVisible();

    // Verify at least 2 pricing tiers exist
    const pricingCards = page.locator('[class*="pricing-card"], [class*="plan"]');
    const count = await pricingCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show free plan features', async ({ page }) => {
    // Find free plan
    const freePlan = page.locator('text=/free/i').first().locator('..');

    // Verify free plan features
    await expect(freePlan).toBeVisible();
    await expect(
      page.locator('text=/summaries per month|basic features|limited/i').first()
    ).toBeVisible();
  });

  test('should show premium plan features', async ({ page }) => {
    // Find premium plans
    const premiumPlan = page.locator('text=/pro|premium|enterprise/i').first().locator('..');

    // Verify premium features
    await expect(premiumPlan).toBeVisible();
    await expect(
      page.locator('text=/unlimited|advanced|priority|api access/i').first()
    ).toBeVisible();
  });

  test('should handle free plan selection', async ({ page }) => {
    // Find and click free plan button
    const freePlanButton = page.getByRole('button', { name: /free|get started free/i });
    
    if (await freePlanButton.isVisible()) {
      await freePlanButton.click();

      // Verify toast or message
      await expect(
        page.locator('text=/already on free|free plan active/i')
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to checkout for paid plan', async ({ page }) => {
    // Find and click premium plan button
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro|upgrade/i }).first();
    
    await proPlanButton.click();

    // Verify navigation to checkout or auth
    await expect(
      page.locator('text=/checkout|payment|sign in to continue/i')
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Functional: Checkout Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete checkout flow for premium plan', async ({ page }) => {
    // Navigate to pricing
    await page.evaluate(() => {
      const pricingSection = document.querySelector('[id*="pricing"]') || 
                            document.querySelector('h2:has-text("Pricing")');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    await page.waitForTimeout(1000);

    // Select Pro plan
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro|upgrade to pro/i }).first();
    await proPlanButton.click();

    // Wait for checkout page
    await expect(
      page.locator('text=/checkout|payment details|order summary/i')
    ).toBeVisible({ timeout: 5000 });

    // Verify plan details are shown
    await expect(
      page.locator('text=/pro|monthly|annual/i')
    ).toBeVisible();

    // Verify price is displayed
    await expect(
      page.locator('text=/\\$|USD|price/i')
    ).toBeVisible();
  });

  test('should display order summary in checkout', async ({ page }) => {
    // Navigate to checkout (set plan in localStorage)
    await page.evaluate(() => {
      const event = new CustomEvent('show-checkout', {
        detail: { name: 'Pro', price: '$9.99', period: 'month' }
      });
      window.dispatchEvent(event);
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Click Pro plan to trigger checkout
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro/i }).first();
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      // Verify order summary
      await expect(
        page.locator('text=/order summary|plan details|total/i')
      ).toBeVisible({ timeout: 5000 });

      // Verify plan name
      await expect(page.locator('text=/pro plan/i')).toBeVisible();
    }
  });

  test('should have payment form fields', async ({ page }) => {
    // Trigger checkout
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro|upgrade/i }).first();
    
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      await page.waitForTimeout(2000);

      // Verify payment form fields exist
      const cardNumberField = page.getByLabel(/card number|credit card/i);
      const expiryField = page.getByLabel(/expiry|expiration|mm.*yy/i);
      const cvcField = page.getByLabel(/cvc|cvv|security code/i);

      // Check if at least one payment field is visible
      const hasPaymentFields = 
        (await cardNumberField.isVisible().catch(() => false)) ||
        (await expiryField.isVisible().catch(() => false)) ||
        (await cvcField.isVisible().catch(() => false)) ||
        (await page.locator('text=/payment method|payment details/i').isVisible());

      expect(hasPaymentFields).toBeTruthy();
    }
  });

  test('should allow going back from checkout', async ({ page }) => {
    // Navigate to checkout
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro/i }).first();
    
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      await page.waitForTimeout(1000);

      // Find and click back button
      const backButton = page.getByRole('button', { name: /back|cancel|return/i }).first();
      await backButton.click();

      // Verify returned to homepage
      await expect(
        page.locator('text=/youtube|video summarizer|transform/i').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should validate payment form fields', async ({ page }) => {
    // Navigate to checkout
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro/i }).first();
    
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      await page.waitForTimeout(2000);

      // Try to submit with empty fields
      const submitButton = page.getByRole('button', { name: /complete purchase|pay now|confirm/i });
      
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Verify validation errors
        await expect(
          page.locator('text=/required|please fill|invalid/i').first()
        ).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should show billing frequency options', async ({ page }) => {
    // Check if monthly/annual toggle exists
    const monthlyOption = page.getByRole('button', { name: /monthly/i }).or(
      page.getByLabel(/monthly/i)
    );
    const annualOption = page.getByRole('button', { name: /annual|yearly/i }).or(
      page.getByLabel(/annual|yearly/i)
    );

    const hasFrequencyOptions = 
      (await monthlyOption.isVisible().catch(() => false)) ||
      (await annualOption.isVisible().catch(() => false));

    if (hasFrequencyOptions) {
      // Click annual option
      if (await annualOption.isVisible()) {
        await annualOption.click();

        // Verify price updates or annual indicator
        await expect(
          page.locator('text=/year|annual|save/i')
        ).toBeVisible();
      }
    }
  });
});

test.describe('Functional: Payment Processing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle successful payment simulation', async ({ page }) => {
    // This test would require test payment credentials or mock
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro/i }).first();
    
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      await page.waitForTimeout(2000);

      // Fill payment form with test data
      const cardNumberField = page.getByLabel(/card number|credit card/i);
      if (await cardNumberField.isVisible()) {
        await cardNumberField.fill('4242 4242 4242 4242');

        const expiryField = page.getByLabel(/expiry|expiration/i);
        await expiryField.fill('12/25');

        const cvcField = page.getByLabel(/cvc|cvv/i);
        await cvcField.fill('123');

        // Submit payment
        const submitButton = page.getByRole('button', { name: /complete purchase|pay now|confirm/i });
        await submitButton.click();

        // Verify success or processing state
        await expect(
          page.locator('text=/processing|success|thank you|payment received/i')
        ).toBeVisible({ timeout: 15000 });
      }
    }
  });

  test('should handle payment card validation', async ({ page }) => {
    // Navigate to checkout
    const proPlanButton = page.getByRole('button', { name: /choose pro|get pro/i }).first();
    
    if (await proPlanButton.isVisible()) {
      await proPlanButton.click();

      await page.waitForTimeout(2000);

      // Try invalid card number
      const cardNumberField = page.getByLabel(/card number|credit card/i);
      if (await cardNumberField.isVisible()) {
        await cardNumberField.fill('1234');

        // Move focus to trigger validation
        await page.keyboard.press('Tab');

        // Verify validation error
        await expect(
          page.locator('text=/invalid card|card number invalid/i')
        ).toBeVisible({ timeout: 3000 });
      }
    }
  });
});

test.describe('Functional: Subscription Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set authenticated user with subscription
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'testuser@example.com',
        name: 'Test User',
        subscription: 'pro'
      }));
    });
    await page.reload();
  });

  test('should display current subscription in dashboard', async ({ page }) => {
    // Navigate to dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|test user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify subscription info
    await expect(
      page.locator('text=/pro plan|current plan|subscription/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should allow plan upgrade', async ({ page }) => {
    // Navigate to dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|test user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Look for upgrade button
    const upgradeButton = page.getByRole('button', { name: /upgrade|change plan/i });
    
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();

      // Verify navigation to pricing or checkout
      await expect(
        page.locator('text=/pricing|choose plan|upgrade to/i')
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
