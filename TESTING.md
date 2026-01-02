# Testing Guide for Simultaneous Move Chess

## Overview

This document provides comprehensive information about testing the Simultaneous Move Chess application. The test suite covers unit tests, integration tests, and end-to-end tests to ensure the game works correctly across all features and platforms.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run only unit tests
npm test

# Run only E2E tests
npm run test:e2e
```

## Test Architecture

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual functions and game logic in isolation

**What's Tested**:
- Chess board initialization (8x8 grid, piece placement)
- Move validation for each piece type:
  - Pawns: forward movement, captures, initial two-square move
  - Knights: L-shaped movement, jumping over pieces
  - Bishops: diagonal movement
  - Rooks: horizontal/vertical movement
  - Queens: combination of rook and bishop
  - Kings: one square in any direction
- Simultaneous move resolution:
  - Normal moves (no collision)
  - Mutual captures (both pieces capture each other)
  - Square collisions (both move to same square - lower value wins)
  - Same value collisions (both removed)
- Game state management
- Move notation (e.g., "e2-e4")

**Running**:
```bash
npm test                    # Run once
npm run test:watch          # Watch mode
npm test -- --coverage      # With coverage report
```

### 2. Integration Tests (`tests/integration/`)

**Purpose**: Test how different components work together

**What's Tested**:
- Complete game flow from start to finish
- Device detection and mode recommendations
- Move validation integrated with UI
- State persistence during gameplay
- Error handling and recovery
- Performance benchmarks
- Browser compatibility

**Running**:
```bash
npx playwright test tests/integration/
```

### 3. End-to-End Tests (`tests/e2e/`)

**Purpose**: Test complete user workflows in a real browser

**What's Tested**:
- Game initialization and loading
- Mode selection (AI, Local 2P)
- Split-screen mode:
  - Layout rendering
  - Chess notation input
  - Move locking
  - Simultaneous resolution
- Camera referee mode:
  - Instructions display
  - Camera activation
  - Photo capture flow
- Discord streaming overlay:
  - Toggle functionality
  - Overlay content
  - Integration with game modes
- Responsive design (mobile, tablet, desktop)
- Accessibility features

**Running**:
```bash
npm run test:e2e           # Headless mode
npm run test:e2e:ui        # Interactive UI mode
npx playwright test --debug # Debug mode
```

## Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Game Logic | 90%+ | TBD |
| Unit Tests | 70%+ | TBD |
| E2E Coverage | All flows | TBD |

View coverage report:
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Writing New Tests

### Unit Test Template

```javascript
describe('Feature Name', () => {
  let game;

  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });

  test('should do something specific', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = game.someMethod(input);
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### E2E Test Template

```javascript
test('should complete user workflow', async ({ page }) => {
  // Navigate
  await page.goto('/');
  
  // Interact
  await page.click('text=Button Text');
  await page.fill('#input-id', 'value');
  
  // Assert
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#result')).toHaveText('Expected');
});
```

## Test Data

### Standard Chess Starting Position
```
  a  b  c  d  e  f  g  h
8 ♜  ♞  ♝  ♛  ♚  ♝  ♞  ♜  8
7 ♟  ♟  ♟  ♟  ♟  ♟  ♟  ♟  7
6 .  .  .  .  .  .  .  .  6
5 .  .  .  .  .  .  .  .  5
4 .  .  .  .  .  .  .  .  4
3 .  .  .  .  .  .  .  .  3
2 ♙  ♙  ♙  ♙  ♙  ♙  ♙  ♙  2
1 ♖  ♘  ♗  ♕  ♔  ♗  ♘  ♖  1
  a  b  c  d  e  f  g  h
```

### Common Test Moves
- `e2-e4`: White pawn opening
- `e7-e5`: Black pawn response
- `g1-f3`: White knight development
- `b8-c6`: Black knight development

### Piece Values (for collision tests)
- Pawn: 1
- Knight/Bishop: 3
- Rook: 5
- Queen: 9
- King: 100

## Debugging Tests

### Debug Failing Unit Test
```bash
npm test -- --no-coverage --verbose
```

### Debug Failing E2E Test
```bash
# Run with UI
npx playwright test --ui

# Run specific test with debug
npx playwright test --debug tests/e2e/game.spec.js

# Run with headed browser
npx playwright test --headed
```

### View E2E Test Report
```bash
npx playwright show-report
```

### Screenshots and Videos
Failed E2E tests automatically capture:
- Screenshot at failure point
- Video recording (optional)

Location: `test-results/` directory

## Continuous Integration

Tests run automatically on:
- Push to `main` branch
- Pull requests to `main`
- Push to `copilot/**` branches

### CI Configuration
See `.github/workflows/test.yml` for:
- Unit test execution
- E2E test execution with Playwright
- Code linting
- Coverage reporting

### Viewing CI Results
1. Go to GitHub Actions tab
2. Click on latest workflow run
3. View test results and artifacts

## Common Issues and Solutions

### Issue: Tests timeout
**Solution**: Increase timeout in test file
```javascript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... rest of test
});
```

### Issue: Flaky E2E tests
**Solution**: Use proper waits
```javascript
// Bad
await page.waitForTimeout(1000);

// Good
await expect(page.locator('#element')).toBeVisible();
await page.waitForLoadState('networkidle');
```

### Issue: Camera API not mocked
**Solution**: Mock in setup.js
```javascript
global.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue(mockStream),
};
```

### Issue: Coverage too low
**Solution**: 
1. Identify uncovered lines: `npm test -- --coverage`
2. Add tests for uncovered code
3. Ensure all branches are tested

## Best Practices

### 1. Test Naming
```javascript
// Good
test('should allow pawn to move forward one square')
test('should prevent king from moving into check')

// Bad
test('pawn test')
test('works correctly')
```

### 2. Test Independence
Each test should:
- Set up its own data
- Clean up after itself
- Not depend on other tests

### 3. Assertion Quality
```javascript
// Good - specific assertions
expect(result).toBe(true);
expect(array).toHaveLength(3);
expect(text).toContain('expected string');

// Bad - vague assertions
expect(result).toBeTruthy();
```

### 4. Test Organization
```javascript
describe('Feature', () => {
  describe('Sub-feature', () => {
    test('specific behavior', () => {
      // test code
    });
  });
});
```

## Performance Testing

### Load Time Test
```javascript
test('should load page quickly', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(2000); // < 2 seconds
});
```

### Rendering Performance
Monitor board rendering speed, especially for split-screen mode.

## Accessibility Testing

### Keyboard Navigation
```javascript
test('should support keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  // ... assertions
});
```

### Screen Reader Compatibility
Check for:
- Proper heading structure
- Alt text on images
- ARIA labels on interactive elements

## Test Maintenance

### When to Update Tests
- New feature added
- Bug fixed
- API/UI changed
- Refactoring code

### Keeping Tests Fast
- Mock external services (Puter.js AI)
- Use test doubles for slow operations
- Run unit tests frequently, E2E less often

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Chess Rules Reference](https://www.chess.com/learn-how-to-play-chess)

## Support

For testing questions:
1. Check this guide
2. Review existing tests for examples
3. Check test output for specific errors
4. Open issue on GitHub repository
