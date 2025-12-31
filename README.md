# Simultaneous Move Chess

Rock Paper Scissors-like take on Chess, you must not only think 24 steps ahead of your opponent but must do so without seeing their moves in advance!

## 🎮 Play Online

Play the game at: [https://ludoplex.github.io/simultaneous-move-chess/](https://ludoplex.github.io/simultaneous-move-chess/)

## 🎯 About

Simultaneous Move Chess is a unique twist on traditional chess where both players submit their moves simultaneously. This creates exciting strategic situations where you must anticipate your opponent's moves without seeing them first!

## 🎲 How to Play

### Game Modes

1. **Local Multiplayer** - Pokemon Stadium N64-style split-screen!
   - Screen splits vertically
   - Both players face their own side (right player rotated 180°)
   - Select moves by clicking pieces OR typing chess notation (e.g., "e2-e4")
   - Lock in your move when ready
   - Both moves resolve simultaneously!

2. **AI Mode** - Play against AI powered by Puter.js
   - Choose from multiple AI models
   - AI makes moves simultaneously with you

3. **Online Mode** - Play against other players (coming soon!)

### Move Input Methods

**Click Mode:** Click a piece, then click destination square  
**Notation Mode:** Type moves like "e2-e4" and press Enter (Pokemon Stadium button-press style!)

### Turn Flow

1. Both players select their move (simultaneously in local mode!)
2. Lock in move when ready
3. When both locked, press "RESOLVE MOVES!"
4. Both moves execute at once with conflict resolution

## ⚔️ Conflict Resolution Rules

When both players' moves interact, the following rules apply:

- **Mutual Capture**: If both pieces try to capture each other, both are removed
- **Square Collision**: If both pieces move to the same square, both pieces are captured
- **Swap**: If pieces trade places, both are captured
- **Normal Capture**: If one piece captures an opponent's piece that isn't moving, standard capture applies

## 🛠️ Technology

- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS for styling
- Puter.js for AI integration
- No build process required
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

## 🎮 Pokemon Stadium Inspiration

The local multiplayer mode is inspired by Pokemon Stadium for Nintendo 64, which pioneered simultaneous move selection in turn-based games. Players can enter moves via chess notation (like pressing controller buttons) or by clicking, with true split-screen simultaneous gameplay!

## 📝 License

This project is open source and available for anyone to use and modify.
