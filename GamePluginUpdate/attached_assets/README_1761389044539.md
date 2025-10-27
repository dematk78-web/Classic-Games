# DailyLiife Classic Games WordPress Plugin

**Version:** 1.7.0  
**Author:** DailyLiife Games  
**License:** GPL v2 or later  
**Requires at least:** WordPress 6.0  
**Requires PHP:** 7.4

## Description

DailyLiife Classic Games brings four classic card and puzzle games to your WordPress site with smooth gameplay, beautiful graphics, and intuitive controls.

### Included Games

1. **Solitaire (Klondike)** - Classic single-player card game with 1-card or 3-card draw modes
2. **FreeCell** - Strategic card game where all cards are visible from the start
3. **Spider Solitaire** - Challenging solitaire variant with 1, 2, or 4 suit difficulty levels
4. **Emoji Minesweeper** - Classic minesweeper with fun animated emojis

## Features

- ⏱️ **Built-in timer** - Tracks your game time automatically
- 🔊 **Sound effects** - Engaging audio feedback with mute toggle
- ↩️ **Undo functionality** - Reverse your moves
- 🎯 **Auto-play** - Automatic card placement for faster gameplay
- ⭐ **Star rating system** - Performance-based ratings
- 🖱️ **Multiple input methods** - Drag-and-drop or click-to-move
- 📱 **Fully responsive** - Perfect on desktop, tablet, and mobile
- 🎨 **HD graphics** - Eye-catching colors and smooth animations

## Installation

1. Upload the `dailyliife-classic-games` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use shortcodes to add games to any page or post

## Shortcodes

### Solitaire
```
[dailyliife_solitaire]
[dailyliife_solitaire mode="three"]
```

### FreeCell
```
[dailyliife_freecell]
```

### Spider Solitaire
```
[dailyliife_spider]
[dailyliife_spider suits="2"]
[dailyliife_spider suits="4"]
```

### Minesweeper
```
[dailyliife_minesweeper]
[dailyliife_minesweeper mode="classic" difficulty="hard"]
```

## What's New in v1.7.0

### Spider Solitaire Enhancements
- **Difficulty Selection Modal** - Choose between 1, 2, or 4 suits when starting a new game
- **Card Completion Animations** - Beautiful cascading animations when a complete K-A stack is removed

### UI/UX Improvements
- **Unified Sound Toggle** - Single flat icon design replacing the dual icon system across all games
- **Auto-Play Styling** - Consistent button appearance with gradient states (blue → green when active)
- **Enhanced Mobile Responsiveness** - Improved card scaling and layout on small screens
- **No Horizontal Scrolling** - Perfect viewport fit on all device sizes

### Performance & Functionality
- **Timer Reset Fix** - Proper timer reset to 0:00 on new game across all games
- **First Move Timer** - Timer now starts only on the first card move

## Support

For issues, questions, or feature requests, please visit our support page or contact us directly.

## Credits

Developed with ❤️ by the DailyLiife Games team.

## License

This plugin is licensed under GPL v2 or later.
