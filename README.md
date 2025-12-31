# Simultaneous Move Chess

Rock Paper Scissors-like take on Chess, you must not only think 24 steps ahead of your opponent but must do so without seeing their moves in advance!

## 🎮 Play Online

Play the game at: [https://ludoplex.github.io/simultaneous-move-chess/](https://ludoplex.github.io/simultaneous-move-chess/)

## 🎯 About

Simultaneous Move Chess is a unique twist on traditional chess where both players submit their moves simultaneously. This creates exciting strategic situations where you must anticipate your opponent's moves without seeing them first!

## 🎲 Game Modes

### 1. **Local Multiplayer** - Device-Optimized!

The game automatically detects your device and recommends the best mode:

#### **Split-Screen Mode** (Best for Desktop 🖥️)
- Pokemon Stadium N64-style vertical split
- Both players sit side-by-side
- Right player's view rotated 180°
- Input moves by clicking OR typing notation (e.g., "e2-e4")
- Lock moves independently
- Dramatic "RESOLVE MOVES!" animation

#### **Camera Referee Mode** (Best for Mobile/Tablet 📱)
- **Revolutionary physical move submission!**
- Both players write moves on paper
- Stand side-by-side (can't see each other's notes)
- Referee/third party takes ONE photo of both papers
- OCR automatically reads chess notation
- Perfect for tournaments and Discord streaming!

### 2. **AI Mode** - Play Against AI
- Powered by Puter.js
- Multiple AI models to choose from
- AI makes moves simultaneously with you
- Great for practice!

### 3. **Online Mode** (Coming Soon!)
- Play against other players worldwide
- Matchmaking system
- Ranked gameplay

## 📺 Discord Streaming Features

Perfect for content creators! Click "Stream Mode" to enable:

- 🎥 Professional overlay with game info
- 📊 Live turn counter and player stats
- 🎯 Last move tracker
- 💫 Clean, readable design optimized for 1080p/720p
- 🎨 Semi-transparent, non-intrusive layout
- 🏷️ Branded watermark

**Camera Mode** is especially great for Discord streaming - viewers watch the referee capture both players' moves in real-time!

## 🎮 How to Play

### Move Input Methods

**Click Mode:** Click a piece → click destination square  
**Notation Mode:** Type moves like "e2-e4" and press Enter (Pokemon Stadium style!)  
**Camera Mode:** Write move on paper → referee captures photo

### Turn Flow

1. **Both players select moves** (simultaneously!)
2. **Lock in moves** when ready
3. **Resolve moves** - both execute at once!
4. **Conflicts resolved** automatically

## ⚔️ Conflict Resolution Rules

When both players' moves interact:

- **Mutual Capture**: Both pieces trying to capture each other = both removed
- **Square Collision**: Both pieces moving to same square = both captured
- **Swap**: Pieces trading places = both captured
- **Normal Capture**: Standard chess capture rules apply

## 🛠️ Technology

- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS for styling
- Puter.js for AI integration
- Camera API for mobile referee mode
- OCR for move detection (camera mode)
- No build process required
- Hosted on GitHub Pages

## 🚀 Local Development

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

The split-screen local multiplayer is inspired by Pokemon Stadium for Nintendo 64, which pioneered simultaneous move selection in turn-based games. Players can enter moves via chess notation (like pressing controller buttons) or by clicking.

## 📱 Platform Recommendations

- **Desktop/Laptop**: Use Split-Screen Mode for best experience
- **Mobile/Tablet**: Use Camera Referee Mode for tournament-style play
- **Discord Streaming**: Camera Mode provides the most engaging viewer experience!

## 🏆 Tournament Mode

Camera Referee Mode is perfect for organized tournaments:
- Physical move submission eliminates disputes
- Third-party verification ensures fairness
- Easy to stream and record
- Professional presentation

## 📝 License

This project is open source and available for anyone to use and modify.
