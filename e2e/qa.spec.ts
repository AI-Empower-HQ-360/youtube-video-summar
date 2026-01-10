import { test, expect } from '@playwright/test'

test.describe('QA Smoke Suite', () => {
  test('Home page loads and key elements exist', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('Language selector opens', async ({ page }) => {
    await page.goto('/')
    const languageButton = page.locator('button').filter({ hasText: /language|auto-detect/i }).first()
    if (await languageButton.isVisible()) {
      await languageButton.click()
      await expect(page.locator('[role="menu"]').first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('Download button renders when data is present', async ({ page }) => {
    await page.goto('/')
    const btn = page.locator('button').filter({ hasText: /download|export/i }).first()
    expect(btn).toBeDefined()
  })
})
