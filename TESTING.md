# Testing Framework

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing.

## Test Structure

```
src/
├── test/
│   └── setup.ts           # Global test setup and mocks
├── utils/
│   └── __tests__/         # Unit tests for utilities
├── components/
│   └── ui/
│       └── __tests__/     # Component tests
```

## Available Commands

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Writing Tests

### Unit Tests

Unit tests are located in `__tests__` folders next to the files they test.

Example utility test:
```typescript
import { describe, it, expect } from 'vitest'
import { formatDuration } from '../formatters'

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(90)).toBe('1:30')
  })
})
```

### Component Tests

Component tests use React Testing Library for rendering and interactions.

Example:
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

it('should handle clicks', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  
  await userEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

## Best Practices

1. **Use descriptive test names** - Describe what the test does
2. **Test user behavior** - Focus on what users see and do
3. **Avoid implementation details** - Test the interface, not internals
4. **Keep tests isolated** - Each test should be independent
5. **Use data-testid sparingly** - Prefer semantic queries (role, label, text)

## Testing Queries Priority

1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Form inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

## Mocking

Global mocks are set up in `src/test/setup.ts`:
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`

For custom mocks, use Vitest's `vi.mock()`:
```typescript
import { vi } from 'vitest'

vi.mock('../api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' }))
}))
```

## Coverage

Coverage reports are generated in the `coverage/` directory.

Thresholds can be configured in `vitest.config.ts`:
```typescript
coverage: {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80
}
```

## CI Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

See `.github/workflows/ci.yml` for configuration.

## Debugging Tests

### VS Code
1. Install "Vitest" extension
2. Click the test icon in the gutter
3. Set breakpoints and debug

### Command Line
```bash
# Run specific test file
npm test validators.test.ts

# Run tests matching pattern
npm test -- --grep="formatDuration"

# Run in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

## Common Issues

### Tests timeout
Increase timeout in test:
```typescript
it('slow test', async () => {
  // Test code
}, 10000) // 10 seconds
```

### Async issues
Always await async operations:
```typescript
await userEvent.click(button)
await screen.findByText('Loaded')
```

### Clean up
Use cleanup utilities:
```typescript
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```
