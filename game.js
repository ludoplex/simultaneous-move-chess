// SimChess - Simultaneous Move Chess Game Logic

class SimChess {
    constructor() {
        this.board = this.initializeBoard();
        this.selectedSquare = null;
        this.whitePendingMove = null;
        this.blackPendingMove = null;
        this.whiteConfirmed = false;
        this.blackConfirmed = false;
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.lastMoveSquares = [];
        
        this.pieceSymbols = {
            'white': {
                'king': '♔',
                'queen': '♕',
                'rook': '♖',
                'bishop': '♗',
                'knight': '♘',
                'pawn': '♙'
            },
            'black': {
                'king': '♚',
                'queen': '♛',
                'rook': '♜',
                'bishop': '♝',
                'knight': '♞',
                'pawn': '♟'
            }
        };

        this.pieceValues = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 100
        };
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up black pieces
        board[0] = [
            {type: 'rook', color: 'black'},
            {type: 'knight', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'queen', color: 'black'},
            {type: 'king', color: 'black'},
            {type: 'bishop', color: 'black'},
            {type: 'knight', color: 'black'},
            {type: 'rook', color: 'black'}
        ];
        
        for (let i = 0; i < 8; i++) {
            board[1][i] = {type: 'pawn', color: 'black'};
            board[6][i] = {type: 'pawn', color: 'white'};
        }
        
        // Set up white pieces
        board[7] = [
            {type: 'rook', color: 'white'},
            {type: 'knight', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'queen', color: 'white'},
            {type: 'king', color: 'white'},
            {type: 'bishop', color: 'white'},
            {type: 'knight', color: 'white'},
            {type: 'rook', color: 'white'}
        ];
        
        return board;
    }

    getPiece(row, col) {
        return this.board[row][col];
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPiece(fromRow, fromCol);
        if (!piece) return false;

        const targetPiece = this.getPiece(toRow, toCol);
        if (targetPiece && targetPiece.color === piece.color) return false;

        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        switch (piece.type) {
            case 'pawn':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color);
            case 'rook':
                return (rowDiff === 0 || colDiff === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'knight':
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            case 'bishop':
                return rowDiff === colDiff && this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'queen':
                return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'king':
                return rowDiff <= 1 && colDiff <= 1;
            default:
                return false;
        }
    }

    isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        const rowDiff = (toRow - fromRow) * direction;
        const colDiff = Math.abs(toCol - fromCol);

        // Forward move
        if (colDiff === 0) {
            if (rowDiff === 1 && !this.getPiece(toRow, toCol)) return true;
            if (rowDiff === 2 && fromRow === startRow && 
                !this.getPiece(toRow, toCol) && 
                !this.getPiece(fromRow + direction, fromCol)) return true;
        }

        // Capture
        if (colDiff === 1 && rowDiff === 1) {
            const target = this.getPiece(toRow, toCol);
            return target && target.color !== color;
        }

        return false;
    }

    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;

        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.getPiece(currentRow, currentCol)) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    executeSimultaneousMoves() {
        if (!this.whitePendingMove || !this.blackPendingMove) {
            return { success: false, message: 'Both players must have moves' };
        }

        const whiteMove = this.whitePendingMove;
        const blackMove = this.blackPendingMove;

        // Check if moves are valid
        if (!this.isValidMove(whiteMove.fromRow, whiteMove.fromCol, whiteMove.toRow, whiteMove.toCol)) {
            return { success: false, message: 'Invalid white move' };
        }
        if (!this.isValidMove(blackMove.fromRow, blackMove.fromCol, blackMove.toRow, blackMove.toCol)) {
            return { success: false, message: 'Invalid black move' };
        }

        const whitePiece = this.getPiece(whiteMove.fromRow, whiteMove.fromCol);
        const blackPiece = this.getPiece(blackMove.fromRow, blackMove.fromCol);

        let result = {
            success: true,
            whiteMove: this.getMoveNotation(whiteMove, whitePiece),
            blackMove: this.getMoveNotation(blackMove, blackPiece),
            conflicts: []
        };

        // Check for mutual capture (both pieces trying to capture each other)
        if (whiteMove.toRow === blackMove.fromRow && whiteMove.toCol === blackMove.fromCol &&
            blackMove.toRow === whiteMove.fromRow && blackMove.toCol === whiteMove.fromCol) {
            result.conflicts.push('Mutual capture - both pieces removed');
            this.board[whiteMove.fromRow][whiteMove.fromCol] = null;
            this.board[blackMove.fromRow][blackMove.fromCol] = null;
            this.lastMoveSquares = [
                {row: whiteMove.fromRow, col: whiteMove.fromCol},
                {row: blackMove.fromRow, col: blackMove.fromCol}
            ];
        }
        // Check for destination collision (both pieces moving to same square)
        else if (whiteMove.toRow === blackMove.toRow && whiteMove.toCol === blackMove.toCol) {
            const whiteValue = this.pieceValues[whitePiece.type];
            const blackValue = this.pieceValues[blackPiece.type];

            if (whiteValue === blackValue) {
                result.conflicts.push('Collision - both pieces removed');
                this.board[whiteMove.fromRow][whiteMove.fromCol] = null;
                this.board[blackMove.fromRow][blackMove.fromCol] = null;
            } else if (whiteValue > blackValue) {
                result.conflicts.push('Collision - Black piece removed, White moves');
                this.board[blackMove.fromRow][blackMove.fromCol] = null;
                this.board[whiteMove.toRow][whiteMove.toCol] = whitePiece;
                this.board[whiteMove.fromRow][whiteMove.fromCol] = null;
            } else {
                result.conflicts.push('Collision - White piece removed, Black moves');
                this.board[whiteMove.fromRow][whiteMove.fromCol] = null;
                this.board[blackMove.toRow][blackMove.toCol] = blackPiece;
                this.board[blackMove.fromRow][blackMove.fromCol] = null;
            }
            this.lastMoveSquares = [
                {row: whiteMove.toRow, col: whiteMove.toCol}
            ];
        }
        // Normal moves - execute both
        else {
            // Execute white move
            const capturedByWhite = this.board[whiteMove.toRow][whiteMove.toCol];
            this.board[whiteMove.toRow][whiteMove.toCol] = whitePiece;
            this.board[whiteMove.fromRow][whiteMove.fromCol] = null;

            // Execute black move
            const capturedByBlack = this.board[blackMove.toRow][blackMove.toCol];
            this.board[blackMove.toRow][blackMove.toCol] = blackPiece;
            this.board[blackMove.fromRow][blackMove.fromCol] = null;

            if (capturedByWhite) result.conflicts.push(`White captures ${capturedByWhite.type}`);
            if (capturedByBlack) result.conflicts.push(`Black captures ${capturedByBlack.type}`);

            this.lastMoveSquares = [
                {row: whiteMove.fromRow, col: whiteMove.fromCol},
                {row: whiteMove.toRow, col: whiteMove.toCol},
                {row: blackMove.fromRow, col: blackMove.fromCol},
                {row: blackMove.toRow, col: blackMove.toCol}
            ];
        }

        this.moveHistory.push(result);
        this.whitePendingMove = null;
        this.blackPendingMove = null;
        this.whiteConfirmed = false;
        this.blackConfirmed = false;

        return result;
    }

    getMoveNotation(move, piece) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const fromFile = files[move.fromCol];
        const fromRank = 8 - move.fromRow;
        const toFile = files[move.toCol];
        const toRank = 8 - move.toRow;
        
        const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
        return `${pieceSymbol}${fromFile}${fromRank}-${toFile}${toRank}`;
    }

    checkGameOver() {
        let whiteKing = false;
        let blackKing = false;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.type === 'king') {
                    if (piece.color === 'white') whiteKing = true;
                    if (piece.color === 'black') blackKing = true;
                }
            }
        }

        if (!whiteKing) return 'Black wins - White king captured!';
        if (!blackKing) return 'White wins - Black king captured!';
        return null;
    }

    reset() {
        this.board = this.initializeBoard();
        this.selectedSquare = null;
        this.whitePendingMove = null;
        this.blackPendingMove = null;
        this.whiteConfirmed = false;
        this.blackConfirmed = false;
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.lastMoveSquares = [];
    }
}

// UI Controller
class GameUI {
    constructor() {
        this.game = new SimChess();
        this.boardElement = document.getElementById('chess-board');
        this.currentTurnElement = document.getElementById('current-turn');
        this.gameStatusElement = document.getElementById('game-status');
        this.whiteMoveText = document.getElementById('white-move-text');
        this.blackMoveText = document.getElementById('black-move-text');
        this.historyList = document.getElementById('history-list');

        this.confirmMoveBtn = document.getElementById('confirm-move');
        this.clearMoveBtn = document.getElementById('clear-move');
        this.submitMovesBtn = document.getElementById('submit-moves');
        this.resetGameBtn = document.getElementById('reset-game');

        this.setupEventListeners();
        this.renderBoard();
        this.updateUI();
    }

    setupEventListeners() {
        this.confirmMoveBtn.addEventListener('click', () => this.confirmMove());
        this.clearMoveBtn.addEventListener('click', () => this.clearSelection());
        this.submitMovesBtn.addEventListener('click', () => this.submitMoves());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                // Highlight last move squares
                if (this.game.lastMoveSquares.some(s => s.row === row && s.col === col)) {
                    square.classList.add('last-move');
                }

                const piece = this.game.getPiece(row, col);
                if (piece) {
                    const pieceSpan = document.createElement('span');
                    pieceSpan.className = 'piece';
                    pieceSpan.textContent = this.game.pieceSymbols[piece.color][piece.type];
                    square.appendChild(pieceSpan);
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                this.boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        const piece = this.game.getPiece(row, col);

        // If no piece is selected
        if (!this.game.selectedSquare) {
            if (piece && piece.color === this.game.currentPlayer) {
                this.game.selectedSquare = {row, col};
                this.renderBoard();
                this.highlightSquare(row, col, 'selected');
                this.highlightValidMoves(row, col);
                this.updateStatus(`Selected ${piece.type} - click destination`);
            }
        }
        // If a piece is already selected
        else {
            const fromRow = this.game.selectedSquare.row;
            const fromCol = this.game.selectedSquare.col;

            // Clicking same square deselects
            if (fromRow === row && fromCol === col) {
                this.game.selectedSquare = null;
                this.renderBoard();
                this.updateStatus('Select a piece to move');
            }
            // Selecting another piece of same color
            else if (piece && piece.color === this.game.currentPlayer) {
                this.game.selectedSquare = {row, col};
                this.renderBoard();
                this.highlightSquare(row, col, 'selected');
                this.highlightValidMoves(row, col);
                this.updateStatus(`Selected ${piece.type} - click destination`);
            }
            // Making a move
            else {
                if (this.game.isValidMove(fromRow, fromCol, row, col)) {
                    const move = {fromRow, fromCol, toRow: row, toCol: col};
                    
                    if (this.game.currentPlayer === 'white') {
                        this.game.whitePendingMove = move;
                        this.updateMoveDisplay('white', move);
                        this.confirmMoveBtn.disabled = false;
                    } else {
                        this.game.blackPendingMove = move;
                        this.updateMoveDisplay('black', move);
                        this.confirmMoveBtn.disabled = false;
                    }

                    this.game.selectedSquare = null;
                    this.renderBoard();
                    this.updateStatus('Move ready - confirm or clear');
                } else {
                    this.updateStatus('Invalid move - try again');
                }
            }
        }
    }

    highlightSquare(row, col, className) {
        const square = this.boardElement.children[row * 8 + col];
        square.classList.add(className);
    }

    highlightValidMoves(fromRow, fromCol) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.game.isValidMove(fromRow, fromCol, row, col)) {
                    this.highlightSquare(row, col, 'target');
                }
            }
        }
    }

    updateMoveDisplay(color, move) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const fromFile = files[move.fromCol];
        const fromRank = 8 - move.fromRow;
        const toFile = files[move.toCol];
        const toRank = 8 - move.toRow;
        const notation = `${fromFile}${fromRank} → ${toFile}${toRank}`;

        if (color === 'white') {
            this.whiteMoveText.textContent = notation;
        } else {
            this.blackMoveText.textContent = notation;
        }
    }

    confirmMove() {
        if (this.game.currentPlayer === 'white' && this.game.whitePendingMove) {
            this.game.whiteConfirmed = true;
            this.game.currentPlayer = 'black';
            this.updateStatus('White move confirmed - Black\'s turn');
        } else if (this.game.currentPlayer === 'black' && this.game.blackPendingMove) {
            this.game.blackConfirmed = true;
            this.updateStatus('Black move confirmed - ready to submit');
        }

        this.confirmMoveBtn.disabled = true;
        this.updateUI();
    }

    clearSelection() {
        if (this.game.currentPlayer === 'white' && !this.game.whiteConfirmed) {
            this.game.whitePendingMove = null;
            this.whiteMoveText.textContent = 'No move selected';
        } else if (this.game.currentPlayer === 'black' && !this.game.blackConfirmed) {
            this.game.blackPendingMove = null;
            this.blackMoveText.textContent = 'No move selected';
        }

        this.game.selectedSquare = null;
        this.confirmMoveBtn.disabled = true;
        this.renderBoard();
        this.updateStatus('Select a piece to move');
    }

    submitMoves() {
        const result = this.game.executeSimultaneousMoves();

        if (result.success) {
            this.addToHistory(result);
            this.renderBoard();
            
            const gameOver = this.game.checkGameOver();
            if (gameOver) {
                this.updateStatus(gameOver);
                alert(gameOver);
            } else {
                this.game.currentPlayer = 'white';
                this.updateStatus('Moves executed! White\'s turn');
            }

            this.whiteMoveText.textContent = 'No move selected';
            this.blackMoveText.textContent = 'No move selected';
        } else {
            this.updateStatus(result.message);
            alert(result.message);
        }

        this.updateUI();
    }

    addToHistory(result) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (result.conflicts.length > 0) {
            historyItem.classList.add('conflict');
        }

        let content = `<strong>Turn ${this.game.moveHistory.length}:</strong><br>`;
        content += `White: ${result.whiteMove}<br>`;
        content += `Black: ${result.blackMove}`;
        
        if (result.conflicts.length > 0) {
            content += `<br><em>${result.conflicts.join(', ')}</em>`;
        }

        historyItem.innerHTML = content;
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
    }

    updateUI() {
        this.currentTurnElement.textContent = this.game.currentPlayer === 'white' ? 
            "White's Turn" : "Black's Turn";

        const bothConfirmed = this.game.whiteConfirmed && this.game.blackConfirmed;
        this.submitMovesBtn.disabled = !bothConfirmed;
    }

    updateStatus(message) {
        this.gameStatusElement.textContent = message;
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.game.reset();
            this.renderBoard();
            this.updateUI();
            this.whiteMoveText.textContent = 'No move selected';
            this.blackMoveText.textContent = 'No move selected';
            this.historyList.innerHTML = '';
            this.updateStatus('Select a piece to move');
            this.confirmMoveBtn.disabled = true;
            this.submitMovesBtn.disabled = true;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});
