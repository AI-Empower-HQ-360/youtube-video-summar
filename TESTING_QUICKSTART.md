# 🚀 VidNote Testing Quick Start

## ⚡ Run Tests Immediately

```bash
# Run everything
./run-tests.sh

# Run specific test types
./run-tests.sh --unit              # Unit tests only
./run-tests.sh --integration       # Integration tests only
./run-tests.sh --e2e              # E2E tests only

# With coverage
./run-tests.sh --unit --coverage

# Watch mode for development
npm run test:watch

# E2E with browser visible
./run-tests.sh --e2e --headed --browser=chromium
```

## 📁 Project Structure

```
VidNote/
├── tests/
│   ├── fixtures/          # Test data
│   │   ├── videos.ts      # Sample video data
│   │   ├── transcripts.ts # Sample transcripts
│   │   └── summaries.ts   # Expected AI outputs
│   ├── mocks/             # Service mocks
│   │   ├── youtube-api.mock.ts
│   │   ├── spark-llm.mock.ts
│   │   └── api-client.mock.ts
│   ├── helpers/           # Test utilities
│   │   └── test-utils.ts
│   ├── unit/              # Unit tests
│   │   ├── services/
│   │   ├── components/
│   │   └── utils/
│   └── integration/       # Integration tests
│       └── api/
├── e2e/                   # E2E tests (Playwright)
│   ├── home.spec.ts
│   ├── video-summarization.spec.ts
│   └── ...
└── run-tests.sh           # Test runner script
```

## 🎯 What's Included

### ✅ Test Fixtures
- Sample video data (with/without captions)
- Mock transcripts (short, medium, long, technical)
- Expected AI outputs (summaries, key points, Q&A)

### ✅ Mocks & Stubs
- YouTube API mock (transcript fetching, metadata)
- Spark LLM mock (AI response generation)
- API client mock (HTTP requests)

### ✅ Test Utilities
- Wait helpers (`waitFor`, `waitForElement`)
- Mock factories (localStorage, clipboard)
- Test wrappers and providers

### ✅ Test Scripts
- Comprehensive npm scripts for all test types
- Shell script for complex test scenarios
- GitHub Actions CI/CD workflow

### ✅ Example Tests
- Unit: YouTube utils testing
- Integration: API endpoint testing
- E2E: Full user journeys (in existing e2e/)

## 📝 Writing Your First Test

### 1. Unit Test Example

Create `tests/unit/services/my-service.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/services/my-service';

describe('MyService', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

Run: `npm run test:unit:services`

### 2. Integration Test Example

Create `tests/integration/api/my-endpoint.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { MockYouTubeAPI } from '../../mocks/youtube-api.mock';

describe('My API Endpoint', () => {
  it('should handle request', async () => {
    const result = await MockYouTubeAPI.fetchTranscript('video-id');
    expect(result).toBeTruthy();
  });
});
```

Run: `npm run test:integration`

### 3. E2E Test Example

Create `e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('my feature works', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="my-button"]');
  await expect(page.locator('.result')).toBeVisible();
});
```

Run: `npm run test:e2e`

## 🔍 Debugging Tests

```bash
# Unit tests with UI
npm run test:ui

# E2E with Playwright inspector
npm run test:e2e:debug

# E2E with visible browser
npm run test:e2e:headed

# View E2E reports
npm run test:e2e:report
```

## 📊 Coverage Reports

```bash
# Generate coverage
npm run test:coverage

# View in browser
open coverage/index.html
```

## 🤖 CI/CD

Tests run automatically on:
- **Push to main/develop**
- **Pull requests**
- **Daily at midnight** (scheduled)

View results in GitHub Actions tab.

## 💡 Tips

1. **Use Fixtures**: Import from `tests/fixtures/` for consistent test data
2. **Mock External Services**: Always use mocks for YouTube, AI services
3. **Data TestIDs**: Add `data-testid` to components for stable E2E selectors
4. **Watch Mode**: Use `npm run test:watch` during development
5. **Test Isolation**: Each test should be independent

## 🎓 Learn More

- [Full Testing Guide](tests/README.md)
- [Test Fixtures Documentation](tests/fixtures/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## 🆘 Troubleshooting

**Tests failing?**
1. Run `npm install` to ensure dependencies are up to date
2. Check environment variables in `.env.local`
3. Ensure servers are stopped before E2E tests
4. Clear `node_modules/.vite` cache if needed

**E2E flaky?**
1. Increase timeouts in `playwright.config.ts`
2. Add explicit waits with `waitFor` helpers
3. Run in headed mode to debug: `--headed`

---

**Happy Testing! 🧪✨**
