# 🧪 VidNote Testing Framework

## Overview

Comprehensive automation testing framework for VidNote YouTube Video Summarizer covering unit, integration, E2E, and performance testing.

## Test Architecture

```
tests/
├── unit/              # Unit tests (Vitest)
│   ├── services/      # Service layer tests
│   ├── utils/         # Utility function tests
│   ├── components/    # Component tests
│   └── hooks/         # React hooks tests
├── integration/       # Integration tests
│   ├── api/           # API integration tests
│   └── workflows/     # Multi-step workflow tests
├── e2e/               # End-to-end tests (Playwright)
│   ├── critical/      # Critical user paths
│   ├── features/      # Feature-specific tests
│   └── regression/    # Regression test suite
├── performance/       # Performance tests
│   ├── load/          # Load testing
│   └── stress/        # Stress testing
├── fixtures/          # Test data and fixtures
├── mocks/             # Mock services and data
└── helpers/           # Test utilities and helpers
```

## Quick Start

### Run All Tests
```bash
npm test                    # All unit tests
npm run test:e2e           # All E2E tests
npm run test:all           # Unit + E2E
npm run test:coverage      # With coverage report
```

### Run Specific Test Suites
```bash
# Unit Tests
npm run test:unit:services
npm run test:unit:components
npm run test:unit:utils

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e:critical
npm run test:e2e:features
npm run test:e2e:chromium    # Single browser
npm run test:e2e:headed      # With browser UI

# Performance Tests
npm run test:performance
```

### Watch Mode
```bash
npm run test:watch          # Unit tests watch mode
npm run test:e2e:ui         # Playwright UI mode
```

## Test Types

### 1. Unit Tests (Vitest)
Fast, isolated tests for individual functions, components, and hooks.

**Location**: `tests/unit/`  
**Runner**: Vitest  
**Coverage**: Services, utils, components, hooks

### 2. Integration Tests
Test interactions between multiple modules and API endpoints.

**Location**: `tests/integration/`  
**Runner**: Vitest  
**Coverage**: API endpoints, service integrations

### 3. E2E Tests (Playwright)
Full user journey tests across real browsers.

**Location**: `e2e/`  
**Runner**: Playwright  
**Browsers**: Chrome, Firefox, Safari, Edge

### 4. Performance Tests
Load, stress, and performance benchmarks.

**Location**: `tests/performance/`  
**Tools**: Playwright + custom metrics

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { extractVideoId } from '@/lib/youtube';

describe('YouTube Utils', () => {
  it('should extract video ID from standard URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('summarize YouTube video', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="url-input"]', 'https://youtube.com/watch?v=...');
  await page.click('[data-testid="generate-btn"]');
  await expect(page.locator('[data-testid="summary"]')).toBeVisible();
});
```

## Test Data

### Fixtures
Reusable test data located in `tests/fixtures/`:
- `videos.json` - Sample video data
- `transcripts.json` - Mock transcripts
- `summaries.json` - Expected AI outputs

### Mocks
Service mocks in `tests/mocks/`:
- `youtube-api.mock.ts` - YouTube API responses
- `spark-llm.mock.ts` - AI service responses
- `api-client.mock.ts` - HTTP client mocks

## CI/CD Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Push to main
- Scheduled nightly runs

### Test Reports
- HTML: `playwright-report/index.html`
- JSON: `test-results/results.json`
- Coverage: `coverage/index.html`

## Best Practices

### 1. Test Naming
```typescript
// ✅ Good: Descriptive, clear intent
test('should display error when video has no captions', ...)

// ❌ Bad: Vague, unclear
test('test1', ...)
```

### 2. Test Independence
Each test should be independent and not rely on other tests.

### 3. Use Data-Testid
Add `data-testid` attributes for stable selectors:
```tsx
<button data-testid="generate-btn">Generate</button>
```

### 4. Mock External Services
Always mock:
- API calls
- AI services (Spark, OpenAI)
- YouTube transcript API

### 5. Test User Behavior
Focus on what users do, not implementation details.

## Debugging

### Debug Unit Tests
```bash
npm run test:ui              # Vitest UI
npm run test -- --reporter=verbose
```

### Debug E2E Tests
```bash
npm run test:e2e:debug       # Playwright inspector
npm run test:e2e:headed      # See browser
npm run test:e2e:ui          # Playwright UI mode
```

### View Test Results
```bash
npm run test:e2e:report      # Open HTML report
```

## Performance Benchmarks

### Key Metrics
- Page load: < 2s
- Video ID extraction: < 100ms
- Transcript fetch: < 3s
- AI summary generation: < 10s

### Performance Tests
```bash
npm run test:performance
```

## Coverage Goals

- **Unit Tests**: > 80%
- **Integration Tests**: > 70%
- **E2E Tests**: All critical paths
- **Overall**: > 75%

## Continuous Improvement

### Adding New Tests
1. Write test for new feature/fix
2. Ensure test fails first (TDD)
3. Implement feature
4. Verify test passes
5. Update documentation

### Test Maintenance
- Review and update tests quarterly
- Remove obsolete tests
- Add regression tests for bugs
- Keep fixtures up to date

## Support

For questions or issues with testing:
1. Check this README
2. Review existing tests for examples
3. See [TESTING_GUIDE.md](../TESTING_GUIDE.md)
4. Open an issue on GitHub

---

**Last Updated**: January 2026  
**Maintained by**: AI-Empower-HQ-360 Team
