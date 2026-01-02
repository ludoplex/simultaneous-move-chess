# CI/CD Configuration

## Automatic Test Execution

The test suite automatically runs on:
- ✅ All pull requests (opened, updated, or reopened)
- ✅ Pushes to `main` branch
- ✅ Pushes to `copilot/**` branches

## Test Jobs

The CI pipeline includes:

1. **Unit Tests** - Jest tests for game logic
2. **E2E Tests** - Playwright tests for UI workflows  
3. **Code Linting** - ESLint code quality checks
4. **Status Check** - Overall pass/fail status

## PR Comments

When tests run on a PR, the CI will automatically comment with:
- Test coverage summary
- E2E test results
- Linting results
- Overall status

## GitHub Branch Protection (Recommended)

To require tests to pass before merging PRs, configure branch protection:

### Steps:
1. Go to repository **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable these options:
   - ☑️ **Require status checks to pass before merging**
   - ☑️ **Require branches to be up to date before merging**
4. Select required status checks:
   - ☑️ `Unit Tests`
   - ☑️ `E2E Tests`
   - ☑️ `Lint Code`
   - ☑️ `All Tests Passed`

### Additional Recommendations:
- ☑️ Require pull request reviews before merging (1 reviewer)
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☑️ Require linear history
- ☑️ Include administrators (enforce rules for admins too)

## Viewing Test Results

### In PR:
- Check the **Checks** tab
- View automated comments with results
- Download test artifacts (Playwright reports)

### In Actions Tab:
1. Go to repository **Actions** tab
2. Select workflow run
3. View job logs
4. Download artifacts

## Test Artifacts

The CI automatically uploads:
- **Coverage reports** → Codecov
- **Playwright reports** → GitHub Artifacts (30 day retention)
- **Test screenshots** → Available on failure

## Local Testing Before PR

Before creating a PR, run tests locally:

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test suites
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run lint          # Linting

# Check coverage
npm test -- --coverage
```

## CI Failure Troubleshooting

### Unit Tests Failing
1. Run `npm test` locally
2. Check test output for specific failures
3. Fix failing tests
4. Verify coverage meets 70% threshold

### E2E Tests Failing
1. Run `npm run test:e2e` locally
2. Use `npm run test:e2e:ui` for interactive debugging
3. Check screenshots in test-results/ directory
4. Review Playwright report artifact in CI

### Linting Failing
1. Run `npm run lint` locally
2. Check ESLint errors
3. Fix code style issues
4. Ensure no console.log statements (use console.warn/error)

## CI Performance

Expected run times:
- Unit Tests: ~30 seconds
- E2E Tests: ~2-3 minutes
- Linting: ~10 seconds
- Total: ~3-4 minutes

## Skipping CI (Not Recommended)

To skip CI on a commit (use sparingly):
```bash
git commit -m "docs: update README [skip ci]"
```

Note: This should only be used for documentation-only changes.

## CI Environment

Tests run in:
- OS: Ubuntu Latest
- Node.js: 18.x
- Browsers: Chromium, Firefox, WebKit
- Devices: Desktop Chrome, Desktop Firefox, Desktop Safari, Pixel 5, iPhone 12

## Status Badges

Add to README.md:
```markdown
![Tests](https://github.com/ludoplex/simultaneous-move-chess/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/ludoplex/simultaneous-move-chess/branch/main/graph/badge.svg)](https://codecov.io/gh/ludoplex/simultaneous-move-chess)
```

## Monitoring

- Check GitHub Actions tab regularly
- Review failed test trends
- Monitor test execution time
- Keep dependencies updated

## Support

For CI issues:
1. Check workflow logs in Actions tab
2. Review TESTING.md for test documentation
3. Open issue if CI configuration needs adjustment
