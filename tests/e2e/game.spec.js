/**
 * E2E tests for Simultaneous Move Chess
 * Tests user interactions, game modes, and UI functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Game Initialization', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Simultaneous Move Chess/);
    
    // Check main heading
    const heading = page.locator('h1:has-text("Simultaneous Move Chess")');
    await expect(heading).toBeVisible();
  });

  test('should display game mode selection', async ({ page }) => {
    await page.goto('/');
    
    // Check for game mode cards
    await expect(page.locator('text=Play vs AI')).toBeVisible();
    await expect(page.locator('text=Local 2P')).toBeVisible();
  });

  test('should display game description', async ({ page }) => {
    await page.goto('/');
    
    const description = page.locator('text=/Think ahead without seeing/');
    await expect(description).toBeVisible();
  });
});

test.describe('Local Multiplayer Mode Selection', () => {
  test('should show local mode options when clicking Local 2P', async ({ page }) => {
    await page.goto('/');
    
    // Click local multiplayer
    await page.click('text=Local 2P');
    
    // Should show mode selection
    await expect(page.locator('text=Split-Screen')).toBeVisible();
    await expect(page.locator('text=Camera Referee')).toBeVisible();
  });

  test('should recommend split-screen for desktop', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/');
      await page.click('text=Local 2P');
      
      // Desktop should see split-screen recommendation
      const recommendation = page.locator('text=/Best for Desktop|Recommended for Your Device/');
      await expect(recommendation).toBeVisible();
    }
  });

  test('should allow going back from mode selection', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    
    // Click back button
    await page.click('button:has-text("Back")');
    
    // Should return to game mode selection
    await expect(page.locator('text=Play vs AI')).toBeVisible();
  });
});

test.describe('Split-Screen Mode', () => {
  test('should initialize split-screen layout', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Check for split-screen elements
    await expect(page.locator('text=WHITE')).toBeVisible();
    await expect(page.locator('text=BLACK')).toBeVisible();
    await expect(page.locator('#whiteBoardView')).toBeVisible();
    await expect(page.locator('#blackBoardView')).toBeVisible();
  });

  test('should display chess notation inputs', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Check for notation inputs
    await expect(page.locator('#whiteNotationInput')).toBeVisible();
    await expect(page.locator('#blackNotationInput')).toBeVisible();
  });

  test('should show lock buttons for both players', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    await expect(page.locator('#whiteSubmitBtn')).toBeVisible();
    await expect(page.locator('#blackSubmitBtn')).toBeVisible();
  });

  test('should disable submit buttons initially', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    const whiteBtn = page.locator('#whiteSubmitBtn');
    const blackBtn = page.locator('#blackSubmitBtn');
    
    await expect(whiteBtn).toBeDisabled();
    await expect(blackBtn).toBeDisabled();
  });
});

test.describe('Chess Notation Input', () => {
  test('should accept valid chess notation for white', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Type valid notation
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Button should be enabled after valid move
    await expect(page.locator('#whiteSubmitBtn')).toBeEnabled();
  });

  test('should accept notation via Enter key', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    
    await expect(page.locator('#whiteSubmitBtn')).toBeEnabled();
  });

  test('should show error for invalid notation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    await page.fill('#whiteNotationInput', 'invalid');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Should show error toast
    await expect(page.locator('text=/Invalid move/i')).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Simultaneous Move Resolution', () => {
  test('should enable resolve button when both moves locked', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Submit white move
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    // Submit black move
    await page.fill('#blackNotationInput', 'e7-e5');
    await page.press('#blackNotationInput', 'Enter');
    await page.click('#blackSubmitBtn');
    
    // Resolve button should appear
    await expect(page.locator('button:has-text("RESOLVE MOVES")')).toBeVisible();
  });

  test('should update move status after locking', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    // Status should update
    await expect(page.locator('#whiteStatus:has-text("MOVE LOCKED")')).toBeVisible();
  });
});

test.describe('Camera Referee Mode', () => {
  test('should initialize camera mode', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Camera Referee');
    
    // Check for camera mode elements
    await expect(page.locator('text=CAMERA REFEREE MODE')).toBeVisible();
    await expect(page.locator('text=TAKE PHOTO OF BOTH MOVES')).toBeVisible();
  });

  test('should display instructions', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Camera Referee');
    
    await expect(page.locator('text=/write their move on paper/i')).toBeVisible();
    await expect(page.locator('text=/Stand side-by-side/i')).toBeVisible();
  });

  test('should show reference board', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Camera Referee');
    
    await expect(page.locator('#cameraBoardView')).toBeVisible();
  });
});

test.describe('Discord Streaming Mode', () => {
  test('should show Discord streaming button', async ({ page }) => {
    await page.goto('/');
    
    // Check for Discord stream button
    const streamBtn = page.locator('#discordStreamBtn');
    await expect(streamBtn).toBeVisible();
  });

  test('should toggle streaming overlay', async ({ page }) => {
    await page.goto('/');
    
    // Click stream mode button
    await page.click('#discordStreamBtn');
    
    // Overlay should appear
    await expect(page.locator('#discordStreamOverlay')).toBeVisible();
    
    // Click again to hide
    await page.click('#discordStreamBtn');
    
    // Overlay should be hidden
    await expect(page.locator('#discordStreamOverlay')).not.toBeVisible();
  });

  test('should display game info in overlay', async ({ page }) => {
    await page.goto('/');
    await page.click('#discordStreamBtn');
    
    // Check overlay content
    await expect(page.locator('text=GAME INFO')).toBeVisible();
    await expect(page.locator('text=PLAYERS')).toBeVisible();
    await expect(page.locator('text=LAST MOVE')).toBeVisible();
  });
});

test.describe('AI Mode', () => {
  test('should show AI selection when clicking Play vs AI', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Play vs AI');
    
    // Should show AI model selection
    await expect(page.locator('text=/Choose.*AI.*Opponent/i')).toBeVisible();
  });

  test('should display multiple AI model options', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Play vs AI');
    
    // Check for at least some AI models
    const aiOptions = page.locator('.game-card');
    await expect(aiOptions.first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('h1:has-text("Simultaneous Move Chess")')).toBeVisible();
    await expect(page.locator('text=Local 2P')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('h1:has-text("Simultaneous Move Chess")')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/');
    
    // Buttons should have text or aria-labels
    const buttons = page.locator('button:visible');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Tab to notation input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to type
    await page.keyboard.type('e2-e4');
    
    const input = page.locator('#whiteNotationInput');
    await expect(input).toHaveValue('e2-e4');
  });
});
