# SimChess - Simultaneous Move Chess

Rock Paper Scissors like take on Chess, you must not only think 24 steps ahead of your opponent but must do so without seeing their moves in advance!

## 🎮 Play Online

Play the game at: [https://ludoplex.github.io/simultaneous-move-chess/](https://ludoplex.github.io/simultaneous-move-chess/)

## 🎯 About

SimChess is a unique twist on traditional chess where both players submit their moves simultaneously. This creates exciting strategic situations where you must anticipate your opponent's moves without seeing them first!

## 🎲 How to Play

1. **White's Turn**: White player selects a piece and destination, then confirms the move
2. **Black's Turn**: Black player selects a piece and destination, then confirms the move
3. **Submit**: When both players have confirmed, click "Submit Both Moves"
4. **Resolution**: Both moves execute simultaneously with conflict resolution rules applied

## ⚔️ Conflict Resolution Rules

When both players' moves interact, the following rules apply:

- **Mutual Capture**: If both pieces try to capture each other, both are removed
- **Square Collision**: If both pieces move to the same square, the higher-value piece wins
  - Piece values: Pawn (1), Knight (3), Bishop (3), Rook (5), Queen (9), King (100)
  - If same value, both pieces are removed
- **Normal Capture**: If one piece captures an opponent's piece that isn't moving, standard capture applies

## 🛠️ Technology

- Pure HTML, CSS, and JavaScript
- No dependencies or build process required
- Responsive design for desktop and mobile
- Hosted on GitHub Pages

## 🚀 Local Development

To run locally:

```bash
# Clone the repository
git clone https://github.com/ludoplex/simultaneous-move-chess.git
cd simultaneous-move-chess

# Start a local server (Python 3)
python3 -m http.server 8000

# Or use Node.js
npx http-server

# Open http://localhost:8000 in your browser
```

## 📝 License

This project is open source and available for anyone to use and modify.
