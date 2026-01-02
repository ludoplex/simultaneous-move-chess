# Test Suite for Simultaneous Move Chess

This directory contains comprehensive tests for the Simultaneous Move Chess application.

## Test Structure

```
tests/
├── unit/              # Unit tests for game logic
├── integration/       # Integration tests
├── e2e/              # End-to-end tests with Playwright
└── setup.js          # Jest configuration and mocks
```

## Test Categories

### Unit Tests (`tests/unit/`)
Tests isolated game logic components:
- Board initialization
- Move validation (pawns, knights, rooks, bishops, queens, kings)
- Simultaneous move resolution
- Collision detection (mutual capture, square collision, value-based resolution)
- Game state management
- Move notation generation

### Integration Tests (`tests/integration/`)
Tests interaction between components:
- Complete game flow
- Device detection and recommendations
- Move validation with UI
- State persistence
- Error handling
- Performance benchmarks

### End-to-End Tests (`tests/e2e/`)
Tests complete user workflows:
- Game initialization and mode selection
- Split-screen mode functionality
- Camera referee mode
- Chess notation input
- Discord streaming overlay
- AI mode selection
- Responsive design across devices
- Accessibility features

## Running Tests

### Prerequisites
```bash
npm install
```

### Run All Tests
```bash
npm run test:all
```

### Run Unit Tests Only
```bash
npm test
```

### Run Unit Tests in Watch Mode
```bash
npm run test:watch
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run E2E Tests with UI
```bash
npm run test:e2e:ui
```

### Run Linter
```bash
npm run lint
```

## Test Coverage

The test suite aims for comprehensive coverage:
- **Unit Tests**: 70%+ coverage of game logic
- **E2E Tests**: All major user flows
- **Integration Tests**: Critical component interactions

### View Coverage Report
```bash
npm test -- --coverage
```

Coverage report will be generated in `coverage/` directory.

## Writing Tests

### Unit Test Example
```javascript
describe('Chess Move Validation', () => {
  let game;
  
  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });
  
  test('should allow pawn to move forward', () => {
    const valid = game.isValidMove(6, 0, 5, 0);
    expect(valid).toBe(true);
  });
});
```

### E2E Test Example
```javascript
test('should start split-screen game', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Local 2P');
  await page.click('text=Split-Screen');
  
  await expect(page.locator('#whiteBoardView')).toBeVisible();
});
```

## Test Data

Tests use the standard chess starting position:
```
8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
6 . . . . . . . .
5 . . . . . . . .
4 . . . . . . . .
3 . . . . . . . .
2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
  a b c d e f g h
```

## Continuous Integration

Tests are designed to run in CI environments:
- Playwright runs in headless mode by default
- Retries configured for flaky tests
- Screenshots captured on failure
- HTML report generated

## Debugging Tests

### Debug E2E Tests
```bash
npx playwright test --debug
```

### View E2E Test Report
```bash
npx playwright show-report
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/game.spec.js
```

### Run Tests Matching Pattern
```bash
npx playwright test -g "split-screen"
```

## Test Utilities

### Mocks
- `localStorage` and `sessionStorage` mocked for unit tests
- `navigator.mediaDevices` mocked for camera tests
- `navigator.userAgent` configurable for device detection tests

### Fixtures
- Clean game state before each test
- Standard chess board configuration
- Mock AI responses (when needed)

## Known Issues

- Camera API tests require mock implementation (OCR not fully testable)
- Some timing-dependent tests may need adjustment for slower CI environments
- Discord streaming overlay tests depend on specific DOM structure

## Contributing

When adding new features:
1. Write unit tests for game logic
2. Add E2E tests for user interactions
3. Update integration tests if components interact
4. Maintain test coverage above 70%
5. Ensure all tests pass before committing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Chess Notation Guide](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
