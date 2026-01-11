import { test, expect } from '@playwright/test';

/**
 * Functional Tests: Authentication & User Management
 * Tests complete authentication flows, session management, and user actions
 */
test.describe('Functional: Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full sign-up flow', async ({ page }) => {
    // Click sign-in/sign-up button
    const authButton = page.getByRole('button', { name: /sign in|login|get started/i });
    await authButton.click();

    // Wait for auth page to load
    await expect(page.getByText(/sign up|create account|register/i)).toBeVisible();

    // Fill in registration form
    const nameInput = page.getByLabel(/name|full name/i);
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i).first();

    await nameInput.fill('Test User');
    await emailInput.fill('testuser@example.com');
    await passwordInput.fill('SecurePass123!');

    // Submit form
    const submitButton = page.getByRole('button', { name: /sign up|create account|register/i });
    await submitButton.click();

    // Verify successful registration (toast message or redirect)
    await expect(
      page.locator('text=/success|welcome|account created/i')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should complete full sign-in flow', async ({ page }) => {
    // Navigate to auth page
    const authButton = page.getByRole('button', { name: /sign in|login/i });
    await authButton.click();

    // Switch to sign-in tab if needed
    const signInTab = page.getByRole('tab', { name: /sign in|login/i });
    if (await signInTab.isVisible()) {
      await signInTab.click();
    }

    // Fill in credentials
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await emailInput.fill('testuser@example.com');
    await passwordInput.fill('SecurePass123!');

    // Submit form
    const submitButton = page.getByRole('button', { name: /sign in|login/i });
    await submitButton.click();

    // Verify successful login
    await expect(page).toHaveURL(/dashboard|home/);
    await expect(
      page.getByText(/welcome|dashboard/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('should handle invalid credentials', async ({ page }) => {
    const authButton = page.getByRole('button', { name: /sign in|login/i });
    await authButton.click();

    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('WrongPassword');

    const submitButton = page.getByRole('button', { name: /sign in|login/i });
    await submitButton.click();

    // Verify error message
    await expect(
      page.locator('text=/invalid|incorrect|error|failed/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should complete sign-out flow', async ({ page }) => {
    // First sign in (using browser context storage)
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'testuser@example.com',
        name: 'Test User'
      }));
    });
    await page.reload();

    // Find user menu/profile dropdown
    const userMenu = page.getByRole('button', { name: /user|profile|account/i }).or(
      page.locator('[data-testid="user-menu"]')
    );
    await userMenu.click();

    // Click sign out
    const signOutButton = page.getByRole('menuitem', { name: /sign out|logout/i });
    await signOutButton.click();

    // Verify signed out state
    await expect(
      page.getByRole('button', { name: /sign in|login|get started/i })
    ).toBeVisible();

    // Verify user data cleared
    const userData = await page.evaluate(() => localStorage.getItem('vidnote-current-user'));
    expect(userData).toBeNull();
  });

  test('should persist user session across page reloads', async ({ page }) => {
    // Set user session
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'testuser@example.com',
        name: 'Test User'
      }));
    });
    await page.reload();

    // Verify user menu is visible
    await expect(
      page.getByRole('button', { name: /user|profile|test user/i })
    ).toBeVisible();

    // Reload again
    await page.reload();

    // Verify session still exists
    await expect(
      page.getByRole('button', { name: /user|profile|test user/i })
    ).toBeVisible();
  });

  test('should validate email format during sign-up', async ({ page }) => {
    const authButton = page.getByRole('button', { name: /sign in|login|get started/i });
    await authButton.click();

    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');

    const passwordInput = page.getByLabel(/password/i).first();
    await passwordInput.click(); // Trigger validation by moving focus

    // Verify validation error
    await expect(
      page.locator('text=/invalid email|valid email address/i')
    ).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    const authButton = page.getByRole('button', { name: /sign in|login|get started/i });
    await authButton.click();

    const passwordInput = page.getByLabel(/password/i).first();
    await passwordInput.fill('weak'); // Weak password

    // Verify password strength indicator or validation message
    await expect(
      page.locator('text=/weak|password too short|at least 8 characters/i')
    ).toBeVisible();
  });

  test('should access dashboard after authentication', async ({ page }) => {
    // Set authenticated state
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'testuser@example.com',
        name: 'Test User'
      }));
    });
    await page.reload();

    // Click on user menu
    const userMenu = page.getByRole('button', { name: /user|profile|test user/i });
    await userMenu.click();

    // Navigate to dashboard
    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify dashboard page loads
    await expect(page.getByText(/dashboard|my summaries|usage/i)).toBeVisible();
  });
});

test.describe('Functional: User Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set authenticated state for all tests
    await page.evaluate(() => {
      localStorage.setItem('vidnote-current-user', JSON.stringify({
        email: 'testuser@example.com',
        name: 'Test User'
      }));
    });
    await page.reload();
  });

  test('should display user information in dashboard', async ({ page }) => {
    // Navigate to dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|test user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify user info displayed
    await expect(page.getByText(/testuser@example\.com/i)).toBeVisible();
    await expect(page.getByText(/test user/i)).toBeVisible();
  });

  test('should show usage statistics in dashboard', async ({ page }) => {
    // Navigate to dashboard
    const userMenu = page.getByRole('button', { name: /user|profile|test user/i });
    await userMenu.click();

    const dashboardLink = page.getByRole('menuitem', { name: /dashboard/i });
    await dashboardLink.click();

    // Verify usage stats displayed
    await expect(
      page.locator('text=/summaries|videos processed|usage this month/i')
    ).toBeVisible();
  });
});
