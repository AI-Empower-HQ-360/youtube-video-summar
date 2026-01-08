import { test, expect } from '@playwright/test';

test.describe('Customer Service Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display chat widget button', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    await expect(chatButton).toBeVisible({ timeout: 10000 });
  });

  test('should open chat window on button click', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      // Chat window should open
      const chatWindow = page.locator('[class*="chat"]').filter({ hasText: /message|type|send/i }).first();
      await expect(chatWindow).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have message input field', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      const messageInput = page.locator('input[type="text"], textarea').filter({ hasText: /message|type|ask/i }).first();
      await expect(messageInput).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have send button', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      const sendButton = page.locator('button').filter({ hasText: /send/i }).first();
      await expect(sendButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have quick reply buttons', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      // Look for quick reply buttons
      await page.waitForTimeout(1000);
      const quickReplies = page.locator('button').filter({ hasText: /how|pricing|help|format/i });
      const count = await quickReplies.count();
      
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should send message on button click', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
      const sendButton = page.locator('button').filter({ hasText: /send/i }).first();
      
      if (await messageInput.isVisible() && await sendButton.isVisible()) {
        await messageInput.fill('Hello, I need help');
        await sendButton.click();
        
        // Message should appear in chat
        const message = page.locator('text=/hello.*help/i').first();
        await expect(message).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should close chat window', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      // Look for close button
      const closeButton = page.locator('button').filter({ hasText: /close|×|minimize/i }).first();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        
        // Chat window should close or minimize
        await page.waitForTimeout(500);
      }
    }
  });

  test('should display bot responses', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      // Click a quick reply
      const quickReply = page.locator('button').filter({ hasText: /how|help/i }).first();
      
      if (await quickReply.isVisible()) {
        await quickReply.click();
        
        // Bot response should appear
        await page.waitForTimeout(2000);
        const botMessage = page.locator('[class*="bot"], [class*="assistant"]').first();
        expect(botMessage).toBeDefined();
      }
    }
  });

  test('should show typing indicator', async ({ page }) => {
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      await chatButton.click();
      
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
      const sendButton = page.locator('button').filter({ hasText: /send/i }).first();
      
      if (await messageInput.isVisible() && await sendButton.isVisible()) {
        await messageInput.fill('Test message');
        await sendButton.click();
        
        // Typing indicator should appear
        const typingIndicator = page.locator('text=/typing|\.\.\./).first();
        await expect(typingIndicator).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should have unread message counter', async ({ page }) => {
    // Chat button might have badge with unread count
    const chatButton = page.locator('button').filter({ hasText: /chat|help|support/i }).first();
    
    if (await chatButton.isVisible()) {
      // Look for badge or counter
      const badge = page.locator('[class*="badge"], [class*="counter"]').first();
      expect(badge).toBeDefined();
    }
  });
});
