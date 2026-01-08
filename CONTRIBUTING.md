# Contributing to YouTube Video Summarizer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow naming conventions**: `feature/`, `bugfix/`, `docs/`, `refactor/`
3. **Make your changes**:
   - Write clear, concise commit messages
   - Follow existing code style
   - Add tests if applicable
   - Update documentation as needed
4. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
5. **Submit pull request** with detailed description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/youtube-video-summar.git
cd youtube-video-summar

# Install dependencies
./setup.sh

# Create branch
git checkout -b feature/your-feature-name

# Make changes and test
npm test

# Commit changes
git add .
git commit -m "feat: add your feature"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Follow component naming conventions (PascalCase)
- Keep components in separate files
- Use TypeScript interfaces for props
- Add proper error boundaries

### Git Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```
feat(api): add video metadata endpoint
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
```

## Testing Guidelines

- Write tests for new features
- Maintain test coverage above 80%
- Test edge cases and error conditions
- Use descriptive test names

```typescript
describe('Component/Feature', () => {
  it('should handle specific scenario', () => {
    // Test implementation
  });
});
```

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for functions
- Update API documentation
- Include inline comments for complex logic

## Project Structure

```
src/
├── components/    # React components
├── hooks/         # Custom hooks
├── lib/           # Utility libraries
├── services/      # API services
├── types/         # TypeScript types
└── test/          # Test utilities
```

## Labels

Use appropriate labels for issues and PRs:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `question`: Further information requested

## Review Process

1. Automated checks must pass (CI/CD)
2. Code review by maintainers
3. Address review comments
4. Approval and merge

## Release Process

Maintainers handle releases:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production

## Questions?

- Check [Documentation](README.md)
- Search [existing issues](https://github.com/AI-Empower-HQ-360/youtube-video-summar/issues)
- Open new issue with `question` label
- Email: aiempowerhq@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to YouTube Video Summarizer! 🎉
