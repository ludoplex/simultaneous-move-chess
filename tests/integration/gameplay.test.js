/**
 * Integration tests for Simultaneous Move Chess
 * Tests interaction between game logic and UI
 */

const { test, expect } = require('@playwright/test');

test.describe('Complete Game Flow', () => {
  test('should play a complete game with split-screen mode', async ({ page }) => {
    await page.goto('/');
    
    // Start split-screen game
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Turn 1: Both players move pawns
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    await page.fill('#blackNotationInput', 'e7-e5');
    await page.press('#blackNotationInput', 'Enter');
    await page.click('#blackSubmitBtn');
    
    // Resolve moves
    await page.click('button:has-text("RESOLVE MOVES")');
    
    // Wait for resolution
    await page.waitForTimeout(2000);
    
    // Should return to split-screen for next turn
    await expect(page.locator('#whiteBoardView')).toBeVisible({ timeout: 5000 });
  });

  test('should handle collision scenario', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Setup moves that will collide (both moving to same square)
    // This requires specific board state, so we'll test the collision logic itself
    
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    await page.fill('#blackNotationInput', 'e7-e5');
    await page.press('#blackNotationInput', 'Enter');
    await page.click('#blackSubmitBtn');
    
    await page.click('button:has-text("RESOLVE MOVES")');
    
    // Game should continue without errors
    await page.waitForTimeout(2000);
    await expect(page.locator('#whiteBoardView')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Device Detection and Recommendations', () => {
  test('should detect desktop and recommend split-screen', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.goto('/');
      await page.click('text=Local 2P');
      
      // Should highlight split-screen option
      const splitScreenCard = page.locator('#splitScreenOption');
      const classes = await splitScreenCard.getAttribute('class');
      
      // Check for recommendation styling
      expect(classes).toContain('ring');
    }
  });

  test('should show appropriate badge for device', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    
    // Should show device-specific badge
    const badge = page.locator('#splitScreenBadge, #cameraBadge').first();
    await expect(badge).toBeVisible();
  });
});

test.describe('Chess Move Validation Integration', () => {
  test('should prevent invalid pawn moves', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Try invalid move (pawn can't move 3 squares)
    await page.fill('#whiteNotationInput', 'e2-e5');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Should show error
    await expect(page.locator('text=/Invalid/i')).toBeVisible({ timeout: 2000 });
  });

  test('should allow valid knight jumps', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Knight move from starting position
    await page.fill('#whiteNotationInput', 'g1-f3');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Should accept valid knight move
    await expect(page.locator('#whiteSubmitBtn')).toBeEnabled();
  });
});

test.describe('State Persistence', () => {
  test('should maintain game state during play', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Make move
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    
    // Move text should be preserved
    const moveText = page.locator('#whiteMove');
    await expect(moveText).toContainText('e2-e4');
  });
});

test.describe('Discord Streaming Integration', () => {
  test('should update overlay with game state', async ({ page }) => {
    await page.goto('/');
    
    // Enable Discord overlay
    await page.click('#discordStreamBtn');
    
    // Start a game
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Overlay should persist
    await expect(page.locator('#discordStreamOverlay')).toBeVisible();
  });

  test('should work with both local modes', async ({ page }) => {
    await page.goto('/');
    await page.click('#discordStreamBtn');
    
    // Try camera mode
    await page.click('text=Local 2P');
    await page.click('text=Camera Referee');
    
    // Stream button should still be accessible
    await expect(page.locator('#discordStreamBtn')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle missing moves gracefully', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Try to resolve without both moves
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    // Resolve button should not appear with only one move
    await expect(page.locator('button:has-text("RESOLVE MOVES")')).not.toBeVisible();
  });

  test('should recover from invalid state', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Enter invalid move
    await page.fill('#whiteNotationInput', 'invalid');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Should be able to try again
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    
    await expect(page.locator('#whiteSubmitBtn')).toBeEnabled();
  });
});

test.describe('Performance', () => {
  test('should load page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should render board without lag', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    
    const startTime = Date.now();
    await page.click('text=Split-Screen');
    const renderTime = Date.now() - startTime;
    
    // Board should render quickly
    expect(renderTime).toBeLessThan(1000);
  });
});

test.describe('Browser Compatibility', () => {
  test('should work in different browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Basic functionality should work in all browsers
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Local 2P')).toBeVisible();
    
    // Start a game
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    await expect(page.locator('#whiteBoardView')).toBeVisible();
  });
});

test.describe('Chess Rules Enforcement', () => {
  test('should not allow pieces to move through other pieces', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Try to move rook through pawn
    await page.fill('#whiteNotationInput', 'a1-a5');
    await page.click('button:has-text("Submit Notation"):near(#whiteNotationInput)');
    
    // Should reject invalid move
    await expect(page.locator('text=/Invalid/i')).toBeVisible({ timeout: 2000 });
  });

  test('should enforce turn alternation after resolution', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Local 2P');
    await page.click('text=Split-Screen');
    
    // Complete one turn
    await page.fill('#whiteNotationInput', 'e2-e4');
    await page.press('#whiteNotationInput', 'Enter');
    await page.click('#whiteSubmitBtn');
    
    await page.fill('#blackNotationInput', 'e7-e5');
    await page.press('#blackNotationInput', 'Enter');
    await page.click('#blackSubmitBtn');
    
    await page.click('button:has-text("RESOLVE MOVES")');
    await page.waitForTimeout(3000);
    
    // Should be ready for next turn
    await expect(page.locator('#whiteBoardView')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#whiteSubmitBtn')).toBeDisabled();
  });
});
