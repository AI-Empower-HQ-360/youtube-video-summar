# Testing Guide

## Overview

This project uses a comprehensive testing framework built with:
- **Vitest** - Fast unit test framework for Vite projects
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction simulation
- **happy-dom** - Lightweight DOM implementation for tests

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test
```

### Run tests once
```bash
npm run test:run
```

### Run with UI
```bash
npm run test:ui
```

### Run with coverage
```bash
npm run test:coverage
```

## Test File Structure

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           ├── button.test.tsx
│           └── input.test.tsx
├── lib/
│   └── __tests__/
│       └── youtube.test.ts
├── utils/
│   └── __tests__/
│       ├── formatters.test.ts
│       └── validators.test.ts
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── vitest-env.d.ts
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
```

### Utility Function Tests

```typescript
import { describe, it, expect } from 'vitest'
import { isValidEmail } from '../validators'

describe('isValidEmail', () => {
  it('validates correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })
  
  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
```

### Hook Tests

```typescript
import { renderHook } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  it('stores and retrieves value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })
})
```

### Async Tests

```typescript
import { waitFor } from '@testing-library/react'

it('fetches data', async () => {
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

## Test Patterns

### Arrange-Act-Assert (AAA)

```typescript
it('increments counter', () => {
  // Arrange
  render(<Counter />)
  const button = screen.getByRole('button')
  
  // Act
  fireEvent.click(button)
  
  // Assert
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### User Event (Preferred)

```typescript
import { userEvent } from '@testing-library/user-event'

it('types in input', async () => {
  const user = userEvent.setup()
  render(<Input />)
  
  await user.type(screen.getByRole('textbox'), 'Hello')
  expect(screen.getByRole('textbox')).toHaveValue('Hello')
})
```

## Custom Test Utilities

Located in `src/test/utils.tsx`:

```typescript
import { renderWithProviders } from '@/test/utils'

// Renders with all context providers
renderWithProviders(<Component />)
```

## Mocking

### Mock Functions

```typescript
import { vi } from 'vitest'

const mockFn = vi.fn()
mockFn.mockReturnValue('mocked')
```

### Mock Modules

```typescript
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
}))
```

### Mock Window APIs

Already configured in `setup.ts`:
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`

## Coverage

Generate coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in:
- `coverage/` directory (HTML report)
- Terminal output (text summary)

### Coverage Goals

- **Statements**: >80%
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%

## Best Practices

1. **Test Behavior, Not Implementation**
   - Test what the user sees and does
   - Avoid testing internal state

2. **Use Descriptive Test Names**
   - Clearly describe what is being tested
   - Use 'should' or 'when' patterns

3. **Keep Tests Independent**
   - Each test should run in isolation
   - Use `beforeEach` for common setup

4. **Use Testing Library Queries**
   - Prefer `getByRole` and `getByLabelText`
   - Avoid `getByTestId` unless necessary

5. **Test Accessibility**
   - Ensure components have proper roles
   - Test keyboard navigation
   - Verify ARIA attributes

6. **Mock External Dependencies**
   - Mock API calls
   - Mock timers if needed
   - Keep mocks simple

## Debugging Tests

### Run single test file
```bash
npm test -- src/utils/__tests__/validators.test.ts
```

### Run single test
```bash
npm test -- -t "validates email"
```

### Debug with console
```typescript
import { screen } from '@testing-library/react'

screen.debug() // Prints DOM
```

### Use Vitest UI
```bash
npm run test:ui
```

## Continuous Integration

Tests run automatically on:
- Every push to GitHub
- Pull request creation
- Pre-commit hooks (if configured)

## Troubleshooting

### Tests timeout
Increase timeout in `vitest.config.ts`:
```typescript
test: {
  testTimeout: 10000
}
```

### Module not found
Check path aliases in `tsconfig.json` and `vitest.config.ts`

### DOM queries fail
Ensure component is rendered and query is correct:
```typescript
screen.debug() // See what's rendered
screen.logTestingPlaygroundURL() // Get query suggestions
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
