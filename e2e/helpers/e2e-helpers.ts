import { Page, expect } from '@playwright/test';

/**
 * E2E Test Helpers
 * Reusable utility functions for end-to-end testing
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Authenticate user by setting localStorage
   */
  async authenticateUser(user: { 
    email: string; 
    name: string; 
    subscription?: string;
  }) {
    await this.page.evaluate((userData) => {
      localStorage.setItem('vidnote-current-user', JSON.stringify(userData));
    }, user);
    await this.page.reload();
  }

  /**
   * Sign out current user
   */
  async signOut() {
    const userMenu = this.page.getByRole('button', { name: /user|profile/i });
    await userMenu.click();

    const signOutButton = this.page.getByRole('menuitem', { name: /sign out|logout/i });
    await signOutButton.click();
  }

  /**
   * Navigate to a specific page
   */
  async navigateTo(pageName: 'dashboard' | 'features' | 'documentation' | 'api' | 'pricing') {
    const navigationMap = {
      dashboard: () => this.navigateToDashboard(),
      features: () => this.clickLink(/features/i),
      documentation: () => this.clickLink(/documentation|docs/i),
      api: () => this.clickLink(/api/i),
      pricing: () => this.scrollToPricing(),
    };

    await navigationMap[pageName]();
  }

  /**
   * Navigate to dashboard via user menu
   */
  private async navigateToDashboard() {
    const userMenu = this.page.getByRole('button', { name: /user|profile/i });
    await userMenu.click();

    const dashboardLink = this.page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();
  }

  /**
   * Click a navigation link
   */
  private async clickLink(pattern: RegExp) {
    const link = this.page.getByRole('link', { name: pattern });
    if (await link.isVisible()) {
      await link.click();
    }
  }

  /**
   * Scroll to pricing section
   */
  private async scrollToPricing() {
    await this.page.evaluate(() => {
      const pricingSection = document.querySelector('[id*="pricing"]') || 
                            document.querySelector('h2:has-text("Pricing")');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Fill video URL and verify validation
   */
  async enterVideoUrl(url: string, shouldBeValid: boolean = true) {
    const urlInput = this.page.locator('input[type="text"]').first();
    await urlInput.fill(url);
    
    if (shouldBeValid) {
      const button = this.page.getByRole('button', { name: /quick summary|summarize/i });
      await expect(button).toBeEnabled({ timeout: 3000 });
    }
    
    return urlInput;
  }

  /**
   * Generate summary for a video
   */
  async generateSummary(url: string, type: 'quick' | 'full' | 'keypoints' = 'quick') {
    await this.enterVideoUrl(url);

    const buttonMap = {
      quick: /quick summary/i,
      full: /full analysis/i,
      keypoints: /key points/i,
    };

    const button = this.page.getByRole('button', { name: buttonMap[type] });
    await button.click();

    // Wait for processing
    await expect(
      this.page.locator('text=/processing|generating|analyzing/i').first()
    ).toBeVisible({ timeout: 5000 });
  }

  /**
   * Wait for summary to complete
   */
  async waitForSummaryCompletion(timeout: number = 30000) {
    await expect(
      this.page.locator('[class*="result"], [class*="summary"]').first()
    ).toBeVisible({ timeout });
  }

  /**
   * Reset the form
   */
  async resetForm() {
    const resetButton = this.page.getByRole('button', { name: /reset|clear|start over/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();
    }
  }

  /**
   * Copy content from a section
   */
  async copyContent(sectionIndex: number = 0) {
    const copyButtons = this.page.getByRole('button', { name: /copy/i });
    await copyButtons.nth(sectionIndex).click();

    // Verify copied feedback
    await expect(
      this.page.locator('text=/copied|success/i')
    ).toBeVisible({ timeout: 3000 });
  }

  /**
   * Select a pricing plan
   */
  async selectPlan(planName: 'free' | 'pro' | 'premium' | 'enterprise') {
    await this.scrollToPricing();

    const buttonPattern = new RegExp(`choose ${planName}|get ${planName}|${planName}`, 'i');
    const planButton = this.page.getByRole('button', { name: buttonPattern }).first();
    
    await planButton.click();
  }

  /**
   * Open mobile menu
   */
  async openMobileMenu() {
    const menuButton = this.page.getByRole('button', { name: /menu|hamburger|☰/i }).or(
      this.page.locator('[aria-label*="menu"]')
    );

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Close mobile menu
   */
  async closeMobileMenu() {
    const closeButton = this.page.getByRole('button', { name: /close|x/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Switch language
   */
  async switchLanguage(language: 'English' | 'Español' | 'Français') {
    const languageSelector = this.page.getByRole('button', { name: /language/i });
    
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      await this.page.waitForTimeout(500);

      const languageOption = this.page.getByRole('menuitem', { name: new RegExp(language, 'i') });
      await languageOption.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Open customer support chat
   */
  async openChat() {
    const chatWidget = this.page.locator('[data-testid="chat-widget"]').or(
      this.page.getByRole('button', { name: /chat|support/i })
    );

    if (await chatWidget.isVisible()) {
      await chatWidget.click();
    }
  }

  /**
   * Close customer support chat
   */
  async closeChat() {
    const closeButton = this.page.getByRole('button', { name: /close/i }).last();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  /**
   * Accept cookies
   */
  async acceptCookies() {
    const cookieButton = this.page.getByRole('button', { name: /accept|got it|okay/i });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string) {
    await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);
    await this.page.waitForTimeout(500);
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(timeout: number = 5000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get localStorage item
   */
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((storageKey) => {
      return localStorage.getItem(storageKey);
    }, key);
  }

  /**
   * Set localStorage item
   */
  async setLocalStorageItem(key: string, value: string) {
    await this.page.evaluate(({ storageKey, storageValue }) => {
      localStorage.setItem(storageKey, storageValue);
    }, { storageKey: key, storageValue: value });
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Simulate network condition
   */
  async setNetworkCondition(condition: 'online' | 'offline' | 'slow') {
    if (condition === 'offline') {
      await this.page.context().setOffline(true);
    } else if (condition === 'online') {
      await this.page.context().setOffline(false);
    } else if (condition === 'slow') {
      await this.page.route('**/*', route => {
        setTimeout(() => route.continue(), 2000);
      });
    }
  }

  /**
   * Verify toast message
   */
  async verifyToast(pattern: RegExp, timeout: number = 5000) {
    await expect(
      this.page.locator('[role="status"], [class*="toast"], [class*="notification"]').filter({ hasText: pattern })
    ).toBeVisible({ timeout });
  }

  /**
   * Verify error message
   */
  async verifyError(pattern: RegExp) {
    await expect(
      this.page.locator('text=/error|invalid|failed/i').filter({ hasText: pattern })
    ).toBeVisible({ timeout: 5000 });
  }

  /**
   * Fill and submit sign-up form
   */
  async signUp(name: string, email: string, password: string) {
    await this.page.getByLabel(/name/i).fill(name);
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).first().fill(password);

    const submitButton = this.page.getByRole('button', { name: /sign up|create account/i });
    await submitButton.click();
  }

  /**
   * Fill and submit sign-in form
   */
  async signIn(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);

    const submitButton = this.page.getByRole('button', { name: /sign in|login/i });
    await submitButton.click();
  }

  /**
   * Verify page loaded
   */
  async verifyPageLoaded(pageIdentifier: RegExp) {
    await expect(
      this.page.locator(`text=${pageIdentifier}`).first()
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get element count
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Wait for animation to complete
   */
  async waitForAnimation(duration: number = 1000) {
    await this.page.waitForTimeout(duration);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const userData = await this.getLocalStorageItem('vidnote-current-user');
    return userData !== null;
  }

  /**
   * Navigate back
   */
  async goBack() {
    const backButton = this.page.getByRole('button', { name: /back|return/i }).first();
    if (await backButton.isVisible()) {
      await backButton.click();
    } else {
      await this.page.goBack();
    }
  }

  /**
   * Refresh page
   */
  async refresh() {
    await this.page.reload();
  }

  /**
   * Verify responsive design
   */
  async verifyResponsiveLayout(expectedWidth: number, expectedHeight: number) {
    const viewportSize = this.page.viewportSize();
    expect(viewportSize?.width).toBe(expectedWidth);
    expect(viewportSize?.height).toBe(expectedHeight);
  }

  /**
   * Fill payment form
   */
  async fillPaymentForm(cardNumber: string, expiry: string, cvc: string) {
    const cardNumberField = this.page.getByLabel(/card number/i);
    if (await cardNumberField.isVisible()) {
      await cardNumberField.fill(cardNumber);
    }

    const expiryField = this.page.getByLabel(/expiry|expiration/i);
    if (await expiryField.isVisible()) {
      await expiryField.fill(expiry);
    }

    const cvcField = this.page.getByLabel(/cvc|cvv/i);
    if (await cvcField.isVisible()) {
      await cvcField.fill(cvc);
    }
  }

  /**
   * Expand accordion section
   */
  async expandAccordion(index: number = 0) {
    const accordionTrigger = this.page.locator('[role="button"][aria-expanded]').nth(index);
    if (await accordionTrigger.isVisible()) {
      const isExpanded = await accordionTrigger.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await accordionTrigger.click();
        await this.waitForAnimation(500);
      }
    }
  }

  /**
   * Collapse accordion section
   */
  async collapseAccordion(index: number = 0) {
    const accordionTrigger = this.page.locator('[role="button"][aria-expanded]').nth(index);
    if (await accordionTrigger.isVisible()) {
      const isExpanded = await accordionTrigger.getAttribute('aria-expanded');
      if (isExpanded === 'true') {
        await accordionTrigger.click();
        await this.waitForAnimation(500);
      }
    }
  }
}

/**
 * Create test helper instance
 */
export function createTestHelpers(page: Page): TestHelpers {
  return new TestHelpers(page);
}

/**
 * Wait for condition with timeout
 */
export async function waitFor(
  condition: () => Promise<boolean>,
  timeout: number = 10000,
  interval: number = 500
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Retry action with exponential backoff
 */
export async function retryWithBackoff<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
