/**
 * Unit tests for SimultaneousMoveChess class
 * Tests core game logic including board initialization, move validation, and collision resolution
 */

// Import the game logic
const fs = require('fs');
const path = require('path');
const gameLogic = fs.readFileSync(path.join(__dirname, '../../game_simple.js'), 'utf8');
eval(gameLogic);

describe('SimultaneousMoveChess - Board Initialization', () => {
  let game;

  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });

  test('should initialize 8x8 board', () => {
    expect(game.board).toHaveLength(8);
    expect(game.board[0]).toHaveLength(8);
  });

  test('should place black pieces on rows 0-1', () => {
    // Row 0: Back rank
    expect(game.board[0][0]).toEqual({ type: 'rook', color: 'black' });
    expect(game.board[0][4]).toEqual({ type: 'king', color: 'black' });
    
    // Row 1: Pawns
    for (let col = 0; col < 8; col++) {
      expect(game.board[1][col]).toEqual({ type: 'pawn', color: 'black' });
    }
  });

  test('should place white pieces on rows 6-7', () => {
    // Row 6: Pawns
    for (let col = 0; col < 8; col++) {
      expect(game.board[6][col]).toEqual({ type: 'pawn', color: 'white' });
    }
    
    // Row 7: Back rank
    expect(game.board[7][0]).toEqual({ type: 'rook', color: 'white' });
    expect(game.board[7][4]).toEqual({ type: 'king', color: 'white' });
  });

  test('should have empty squares in middle rows', () => {
    for (let row = 2; row <= 5; row++) {
      for (let col = 0; col < 8; col++) {
        expect(game.board[row][col]).toBeNull();
      }
    }
  });

  test('should initialize game state correctly', () => {
    expect(game.currentPlayer).toBe('white');
    expect(game.whitePendingMove).toBeNull();
    expect(game.blackPendingMove).toBeNull();
    expect(game.whiteConfirmed).toBe(false);
    expect(game.blackConfirmed).toBe(false);
    expect(game.moveHistory).toEqual([]);
  });
});

describe('SimultaneousMoveChess - Move Validation', () => {
  let game;

  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });

  describe('Pawn Moves', () => {
    test('should allow pawn to move one square forward', () => {
      const valid = game.isValidMove(6, 0, 5, 0); // White pawn a2 to a3
      expect(valid).toBe(true);
    });

    test('should allow pawn to move two squares forward from starting position', () => {
      const valid = game.isValidMove(6, 0, 4, 0); // White pawn a2 to a4
      expect(valid).toBe(true);
    });

    test('should not allow pawn to move backwards', () => {
      const valid = game.isValidMove(6, 0, 7, 0); // White pawn backwards
      expect(valid).toBe(false);
    });

    test('should allow pawn to capture diagonally', () => {
      // Place black piece for capture
      game.board[5][1] = { type: 'pawn', color: 'black' };
      const valid = game.isValidMove(6, 0, 5, 1); // White pawn captures
      expect(valid).toBe(true);
    });

    test('should not allow pawn to capture forward', () => {
      game.board[5][0] = { type: 'pawn', color: 'black' };
      const valid = game.isValidMove(6, 0, 5, 0); // White pawn blocked
      expect(valid).toBe(false);
    });
  });

  describe('Knight Moves', () => {
    test('should allow valid L-shaped knight moves', () => {
      const valid1 = game.isValidMove(7, 1, 5, 0); // White knight b1 to a3
      const valid2 = game.isValidMove(7, 1, 5, 2); // White knight b1 to c3
      expect(valid1).toBe(true);
      expect(valid2).toBe(true);
    });

    test('should not allow non-L-shaped knight moves', () => {
      const valid = game.isValidMove(7, 1, 5, 1); // Straight move
      expect(valid).toBe(false);
    });

    test('should allow knight to jump over pieces', () => {
      // Knights can jump, so this should work despite pieces in the way
      const valid = game.isValidMove(7, 1, 5, 2);
      expect(valid).toBe(true);
    });
  });

  describe('Rook Moves', () => {
    test('should allow rook to move horizontally', () => {
      // Clear path for rook
      game.board[7] = [null, null, null, null, null, null, null, { type: 'rook', color: 'white' }];
      const valid = game.isValidMove(7, 7, 7, 0);
      expect(valid).toBe(true);
    });

    test('should allow rook to move vertically', () => {
      // Clear column
      for (let row = 0; row < 7; row++) {
        game.board[row][0] = null;
      }
      const valid = game.isValidMove(7, 0, 0, 0);
      expect(valid).toBe(true);
    });

    test('should not allow rook to move diagonally', () => {
      game.board[7] = [{ type: 'rook', color: 'white' }, null, null, null, null, null, null, null];
      const valid = game.isValidMove(7, 0, 5, 2);
      expect(valid).toBe(false);
    });

    test('should not allow rook to jump over pieces', () => {
      const valid = game.isValidMove(7, 0, 5, 0); // Pawn blocking at row 6
      expect(valid).toBe(false);
    });
  });

  describe('Bishop Moves', () => {
    test('should allow bishop to move diagonally', () => {
      // Clear path
      game.board[6][3] = null;
      game.board[5][4] = null;
      const valid = game.isValidMove(7, 2, 4, 5);
      expect(valid).toBe(true);
    });

    test('should not allow bishop to move horizontally', () => {
      const valid = game.isValidMove(7, 2, 7, 5);
      expect(valid).toBe(false);
    });
  });

  describe('Queen Moves', () => {
    test('should allow queen to move horizontally', () => {
      game.board[7] = [null, null, null, { type: 'queen', color: 'white' }, null, null, null, null];
      const valid = game.isValidMove(7, 3, 7, 7);
      expect(valid).toBe(true);
    });

    test('should allow queen to move diagonally', () => {
      game.board[6][3] = null;
      game.board[5][4] = null;
      const valid = game.isValidMove(7, 3, 5, 5);
      expect(valid).toBe(true);
    });
  });

  describe('King Moves', () => {
    test('should allow king to move one square in any direction', () => {
      game.board[4][4] = { type: 'king', color: 'white' };
      
      expect(game.isValidMove(4, 4, 3, 4)).toBe(true); // Up
      expect(game.isValidMove(4, 4, 5, 4)).toBe(true); // Down
      expect(game.isValidMove(4, 4, 4, 3)).toBe(true); // Left
      expect(game.isValidMove(4, 4, 4, 5)).toBe(true); // Right
      expect(game.isValidMove(4, 4, 3, 3)).toBe(true); // Diagonal
    });

    test('should not allow king to move more than one square', () => {
      game.board[4][4] = { type: 'king', color: 'white' };
      expect(game.isValidMove(4, 4, 2, 4)).toBe(false); // Two squares
    });
  });

  test('should not allow moving to square with own piece', () => {
    const valid = game.isValidMove(7, 0, 6, 0); // Rook to own pawn
    expect(valid).toBe(false);
  });
});

describe('SimultaneousMoveChess - Simultaneous Move Resolution', () => {
  let game;

  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });

  test('should execute normal moves when no collision', () => {
    game.whitePendingMove = { fromRow: 6, fromCol: 0, toRow: 4, toCol: 0 };
    game.blackPendingMove = { fromRow: 1, fromCol: 0, toRow: 3, toCol: 0 };
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.success).toBe(true);
    expect(game.board[4][0]).toEqual({ type: 'pawn', color: 'white' });
    expect(game.board[3][0]).toEqual({ type: 'pawn', color: 'black' });
    expect(game.board[6][0]).toBeNull();
    expect(game.board[1][0]).toBeNull();
  });

  test('should handle mutual capture (both pieces removed)', () => {
    // Set up pieces that capture each other
    game.board[4][4] = { type: 'rook', color: 'white' };
    game.board[4][5] = { type: 'rook', color: 'black' };
    game.board[6][4] = null;
    game.board[1][5] = null;
    
    game.whitePendingMove = { fromRow: 4, fromCol: 4, toRow: 4, toCol: 5 };
    game.blackPendingMove = { fromRow: 4, fromCol: 5, toRow: 4, toCol: 4 };
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.conflicts).toContain('Mutual capture - both pieces removed');
    expect(game.board[4][4]).toBeNull();
    expect(game.board[4][5]).toBeNull();
  });

  test('should handle square collision - lower value piece wins', () => {
    // Pawn vs Queen - Pawn should win (lower value)
    game.board[4][4] = { type: 'pawn', color: 'white' };
    game.board[4][6] = { type: 'queen', color: 'black' };
    game.board[6][4] = null;
    game.board[1][6] = null;
    
    game.whitePendingMove = { fromRow: 4, fromCol: 4, toRow: 4, toCol: 5 };
    game.blackPendingMove = { fromRow: 4, fromCol: 6, toRow: 4, toCol: 5 };
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.conflicts.length).toBeGreaterThan(0);
    // Lower value piece (pawn) should win
    expect(game.board[4][5]).toEqual({ type: 'pawn', color: 'white' });
    expect(game.board[4][6]).toBeNull();
  });

  test('should handle same value collision (both removed)', () => {
    game.board[4][4] = { type: 'rook', color: 'white' };
    game.board[4][6] = { type: 'rook', color: 'black' };
    game.board[6][4] = null;
    game.board[1][6] = null;
    
    game.whitePendingMove = { fromRow: 4, fromCol: 4, toRow: 4, toCol: 5 };
    game.blackPendingMove = { fromRow: 4, fromCol: 6, toRow: 4, toCol: 5 };
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.conflicts).toContain('Collision - both pieces removed');
    expect(game.board[4][5]).toBeNull();
  });

  test('should require both moves to be present', () => {
    game.whitePendingMove = { fromRow: 6, fromCol: 0, toRow: 4, toCol: 0 };
    game.blackPendingMove = null;
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Both players must have moves');
  });

  test('should validate moves before execution', () => {
    game.whitePendingMove = { fromRow: 6, fromCol: 0, toRow: 2, toCol: 0 }; // Invalid pawn move
    game.blackPendingMove = { fromRow: 1, fromCol: 0, toRow: 3, toCol: 0 };
    
    const result = game.executeSimultaneousMoves();
    
    expect(result.success).toBe(false);
  });
});

describe('SimultaneousMoveChess - Game State', () => {
  let game;

  beforeEach(() => {
    game = new SimultaneousMoveChess();
  });

  test('should check for game over when king is captured', () => {
    // Remove white king
    game.board[7][4] = null;
    
    const result = game.checkGameOver();
    
    expect(result).toContain('Black wins');
  });

  test('should return null when game is not over', () => {
    const result = game.checkGameOver();
    expect(result).toBeNull();
  });

  test('should reset game to initial state', () => {
    game.currentPlayer = 'black';
    game.moveHistory = ['some move'];
    game.whitePendingMove = { fromRow: 6, fromCol: 0, toRow: 4, toCol: 0 };
    
    game.reset();
    
    expect(game.currentPlayer).toBe('white');
    expect(game.moveHistory).toEqual([]);
    expect(game.whitePendingMove).toBeNull();
    expect(game.board[7][4]).toEqual({ type: 'king', color: 'white' });
  });

  test('should generate move notation correctly', () => {
    const move = { fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 };
    const piece = { type: 'pawn', color: 'white' };
    
    const notation = game.getMoveNotation(move, piece);
    
    expect(notation).toBe('e2-e4');
  });

  test('should add moves to history', () => {
    game.whitePendingMove = { fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 };
    game.blackPendingMove = { fromRow: 1, fromCol: 4, toRow: 3, toCol: 4 };
    
    game.executeSimultaneousMoves();
    
    expect(game.moveHistory).toHaveLength(1);
    expect(game.moveHistory[0].whiteMove).toContain('e2-e4');
    expect(game.moveHistory[0].blackMove).toContain('e7-e5');
  });
});
