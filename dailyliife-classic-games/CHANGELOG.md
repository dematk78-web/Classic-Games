# Changelog

All notable changes to DailyLiife Classic Games will be documented in this file.

## [1.7.0] - 2025-10-24

### Added
- **Spider Solitaire Difficulty Modal**: In-game popup to select difficulty (1, 2, or 4 suits) when clicking "New Game"
- **Card Completion Animations**: Smooth cascading fade and slide animation when a complete K-A stack is removed in Spider Solitaire
- **Enhanced Mobile Responsiveness**: Improved card scaling across all breakpoints (480px, 768px, 1024px, 1200px)
- **Overflow Control**: Added `overflow-x: hidden` to prevent horizontal scrolling on mobile devices

### Changed
- **Sound Toggle Icon**: Replaced dual sound-on/sound-off SVG system with single flat volume icon that changes opacity when muted
- **Auto-Play Button**: Updated styling to use consistent gradient pattern (blue base, green when active) matching other game buttons
- **Timer Functionality**: Timer now properly resets to 0:00 on new game across all games
- **Timer Start Behavior**: Timer starts only on first move instead of immediately on game load
- **Plugin Name**: Corrected to "DailyLiife Classic Games" (intentional double 'i') throughout all files

### Fixed
- Timer not resetting to zero when starting a new game
- Sound icon inconsistency across different game templates
- Mobile viewport issues causing horizontal scrolling on small screens
- Card size scaling on tablets and mobile devices

### Technical
- Updated all version numbers from 1.5.0 to 1.7.0 across PHP, CSS, and JS files
- Improved CSS organization for sound toggle states
- Enhanced modal system for game difficulty selection
- Better animation timing and sequencing for card stack completion

## [1.5.0] - Previous Release

Initial stable release with four classic games:
- Solitaire (Klondike)
- FreeCell
- Spider Solitaire
- Emoji Minesweeper

### Features
- Drag-and-drop card movement
- Click-to-move functionality
- Timer and move counter
- Undo functionality
- Auto-play for card games
- Sound effects with toggle
- Star rating system
- Responsive design
- Multiple game modes and difficulties
