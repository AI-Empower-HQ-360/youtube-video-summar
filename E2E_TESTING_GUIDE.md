# End-to-End Testing Guide

## Overview

This project uses **Playwright** for comprehensive end-to-end (E2E) testing. The test suite covers all major features including multi-language support, video summarization, accessibility, and mobile responsiveness.

## 🎯 Test Coverage

### Core Features
- ✅ **Home Page** - Basic page load and navigation
- ✅ **Video Summarization** - URL input, processing, and results
- ✅ **Multi-Language Support** - 50+ languages, language selectors, translation
- ✅ **Customer Service Chat** - Chat widget, messaging, quick replies
- ✅ **Accessibility** - WCAG 2.1 AA compliance, keyboard navigation
- ✅ **Mobile Responsiveness** - Phone and tablet layouts
- ✅ **Performance** - Load times, LCP, FID, bundle size

## 🚀 Quick Start

### Installation

```bash
# Install Playwright browsers
npm run playwright:install
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run only Chromium tests
npm run test:e2e:chromium

# View test report
npm run test:e2e:report
```

### Running All Tests (Unit + E2E)

```bash
npm run test:all
```

## 📁 Test Structure

```
e2e/
├── home.spec.ts                  # Home page tests
├── video-summarization.spec.ts   # Video processing tests
├── multi-language.spec.ts        # Multi-language feature tests
├── customer-chat.spec.ts         # Chat widget tests
├── accessibility.spec.ts         # A11y and WCAG tests
├── mobile-responsive.spec.ts     # Mobile/tablet tests
└── performance.spec.ts           # Performance benchmarks
```

## 🧪 Test Scenarios

### 1. Home Page Tests (`home.spec.ts`)

Tests basic page functionality:
- Page loads successfully
- Main heading visible
- Navigation menu present
- Footer displayed
- Mobile responsiveness
- Chat widget available
- No console errors
- No network failures

### 2. Video Summarization Tests (`video-summarization.spec.ts`)

Tests video processing workflow:
- URL input field visibility
- Summarize/generate button
- Empty URL validation
- Valid YouTube URL acceptance
- Processing state display
- Reset/clear functionality
- Invalid URL handling
- Multiple action buttons
- Summary length options
- Copy to clipboard
- Video metadata display
- Q&A functionality
- Export options

### 3. Multi-Language Tests (`multi-language.spec.ts`)

Tests the new multi-language features:
- Language selector visibility
- Source language selector
- Target language selector
- Dropdown opening/closing
- Popular languages tab
- All languages tab
- Search functionality
- Language filtering
- Auto-detect option
- Language selection
- RTL language support (Arabic, Hebrew)
- Language info in results
- Regional grouping
- Native language names
- Selection persistence
- **50+ language support verification**

### 4. Customer Service Chat Tests (`customer-chat.spec.ts`)

Tests chat widget functionality:
- Chat widget button visibility
- Chat window opening
- Message input field
- Send button
- Quick reply buttons
- Message sending
- Chat window closing
- Bot responses
- Typing indicator
- Unread message counter

### 5. Accessibility Tests (`accessibility.spec.ts`)

Tests WCAG 2.1 AA compliance:
- No automatic accessibility violations (axe-core)
- Proper keyboard navigation
- Accessible form labels
- Proper heading hierarchy
- Alt text for images
- Proper ARIA roles
- Sufficient color contrast
- Screen reader support
- Accessible button names
- No duplicate IDs
- Language selector keyboard accessibility

### 6. Mobile Responsiveness Tests (`mobile-responsive.spec.ts`)

Tests mobile and tablet layouts:
- iPhone 12 display
- Mobile-friendly navigation
- Touch-friendly buttons (44x44px minimum)
- No horizontal scroll
- Mobile-friendly input fields
- Chat widget on mobile
- Language selector on mobile
- iPad Pro layout
- Appropriate tablet layout

### 7. Performance Tests (`performance.spec.ts`)

Tests performance benchmarks:
- Page load time (< 5 seconds)
- Largest Contentful Paint - LCP (< 2.5 seconds)
- First Input Delay - FID (< 100ms)
- No memory leaks
- Minimal bundle size (< 500KB HTML)
- Critical CSS loading
- Lazy loading for images
- Static asset caching

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

Key settings:
- **Test Directory**: `./e2e`
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Base URL**: `http://localhost:5173` (or `PLAYWRIGHT_BASE_URL` env var)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, Chrome
- **Reporters**: HTML, JSON, JUnit, List
- **Screenshots**: On failure only
- **Video**: Retain on failure
- **Action Timeout**: 15 seconds

### Environment Variables

```bash
# Custom base URL for testing
export PLAYWRIGHT_BASE_URL=http://localhost:3000

# Run in CI mode
export CI=true
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

Reports include:
- Test execution summary
- Screenshots of failures
- Video recordings of failures
- Trace files for debugging
- JSON and JUnit XML exports

## 🐛 Debugging Tests

### Interactive UI Mode

```bash
npm run test:e2e:ui
```

Features:
- Watch mode
- Time travel debugging
- DOM snapshots
- Network requests
- Console logs

### Debug Mode

```bash
npm run test:e2e:debug
```

Features:
- Playwright Inspector
- Step through tests
- Evaluate locators
- Edit locators live

### VS Code Debugging

1. Install **Playwright Test for VSCode** extension
2. Open test file
3. Click green play button next to test
4. Set breakpoints in test code

## 🎨 Writing New Tests

### Basic Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    const element = page.locator('selector');
    await expect(element).toBeVisible();
  });
});
```

### Best Practices

1. **Use Data Test IDs**: Add `data-testid` attributes for reliable selectors
2. **Wait for Elements**: Use `await expect().toBeVisible()` instead of hard waits
3. **Isolate Tests**: Each test should be independent
4. **Use Page Objects**: For complex pages, create page object models
5. **Test User Flows**: Test complete user journeys, not just components
6. **Mobile-First**: Always test mobile layouts
7. **Accessibility**: Include accessibility checks in all tests

### Accessibility Testing with axe-core

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have a11y violations', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page }).analyze();
  
  expect(results.violations).toEqual([]);
});
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Multi-Language Testing Strategy

The multi-language tests verify:

1. **UI Components**
   - Language selectors are visible
   - Dropdowns open/close properly
   - Search filters languages
   - Tabs switch between Popular/All

2. **Language Selection**
   - 50+ languages available
   - Auto-detect option present
   - Selection persists across interactions
   - Selected language shows in button

3. **Script Support**
   - RTL languages (Arabic, Hebrew)
   - Asian scripts (Chinese, Japanese, Korean, Thai)
   - Cyrillic script
   - Native language names displayed

4. **User Flows**
   - Select source language → Process video → See results
   - Auto-detect → Translate to target language
   - Cross-language translation verification

## 🔍 Troubleshooting

### Tests Failing Locally

1. **Update Browsers**: `npm run playwright:install`
2. **Check Base URL**: Ensure dev server is running on correct port
3. **Clear State**: Delete `test-results/` and `playwright-report/` directories
4. **Check Logs**: Run with `DEBUG=pw:api npm run test:e2e`

### Tests Passing Locally but Failing on CI

1. **Increase Timeouts**: CI environments are slower
2. **Add Retries**: Configure retries in `playwright.config.ts`
3. **Check CI Resources**: Ensure sufficient memory/CPU
4. **Disable Parallel Tests**: Set `workers: 1` on CI

### Flaky Tests

1. **Use `waitFor` Assertions**: `await expect(element).toBeVisible()`
2. **Avoid Hard Waits**: Replace `waitForTimeout()` with `waitForSelector()`
3. **Wait for Network**: Use `waitForLoadState('networkidle')`
4. **Increase Action Timeout**: Configure in `playwright.config.ts`

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [axe-core Accessibility Testing](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

When adding new features:

1. Write E2E tests for new functionality
2. Add tests to appropriate spec file or create new one
3. Update this guide with new test scenarios
4. Ensure all tests pass before submitting PR
5. Include accessibility tests for UI changes

## 📊 Current Test Stats

- **Total Test Files**: 8
- **Total Test Cases**: 100+
- **Browser Coverage**: 7 configurations
- **Mobile Devices**: 2 (iPhone 12, iPad Pro)
- **Accessibility Checks**: Automated with axe-core
- **Performance Benchmarks**: 8 metrics tracked

## 🎯 Test Execution Time

- **Full Suite**: ~5-10 minutes (all browsers)
- **Chromium Only**: ~2-3 minutes
- **UI Mode**: Interactive
- **Debug Mode**: Step-by-step

---

**Happy Testing! 🎭**

For questions or issues, please refer to the [Playwright documentation](https://playwright.dev/) or open an issue in the repository.
