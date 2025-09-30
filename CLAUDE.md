# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based Pokemon battle game built with vanilla HTML, CSS, and JavaScript. Features a retro pixel-art aesthetic with turn-based combat mechanics, type effectiveness system, and multiple screens (start menu, pokemon selection, battle interface, instructions).

## File Structure

- `index.html` - Main HTML with all game screens (start, selection, instructions, battle)
- `style.css` - Complete styling with pixel-art theme, custom fonts, and animations
- `script.js` - Game logic, battle system, audio management, and UI state
- `public/` - Assets directory containing:
  - `fonts/` - Custom pixel fonts (NeuePixel, TN, Ark)
  - `images/` - Sprites, backgrounds, effects, icons
  - `sounds/` - Background music and sound effects (.ogg format)

## Running the Game

Open `index.html` directly in a browser. No build process or local server required (though some browsers may block audio autoplay without user interaction).

## Architecture

### Game State Management
- `gameState` object (script.js:184) tracks current battle state: player/enemy Pokemon, current turn, battle end status
- `pokemonData` object (script.js:124) contains base stats, HP, attack, defense, sprite paths, and move sets for all Pokemon
- Type effectiveness chart (script.js:192) defines damage multipliers between types

### Audio System
- `sounds` object (script.js:2) manages all audio files with separate volume levels for music vs effects
- `playSound()` and `playMusic()` functions handle audio playback with sound toggle support
- Background music changes per screen (menu, town, battle, instructions)

### Battle System
- Turn-based combat with player attacking first, then enemy counter-attack
- Damage calculation (script.js:302) uses Pokemon formula considering attack, defense, move power, and type effectiveness
- Status moves (Growl, Tail Whip) reduce opponent stats
- Health bars update with color changes (green → orange → red with blinking)

### Screen Flow
1. Start screen → Pokemon selection or instructions
2. Pokemon selection → Battle screen (with random enemy selection)
3. Battle ends → Confirmation dialog to restart or return to menu

## Key Functions

- `initGame()` (script.js:201) - Initialize battle display and messages
- `updateDisplay()` (script.js:207) - Sync UI with game state (HP, sprites, names)
- `executeAttack()` (script.js:302) - Calculate damage, apply effects, update display with animations
- `enemyTurn()` (script.js:361) - AI selects random attack and executes it
- `endBattle()` (script.js:382) - Handle win/lose conditions with sound effects
- `selectPokemon()` (script.js:486) - Set player choice and random enemy, start battle

## Styling Approach

- Pixel-art rendering enforced globally with `image-rendering: pixelated`
- Custom "pixel border" effect using pseudo-elements and gradients
- Button states use transform + box-shadow for 3D press effect
- Health bars use repeating linear gradients for striped appearance
- Thai language UI text throughout

## Adding New Pokemon

1. Add entry to `pokemonData` with stats, sprite path, and 4 moves
2. Add corresponding type to `typeChart` if new type introduced
3. Update `getDefenderType()` to return correct type for new Pokemon
4. Add sprite files to `public/images/effects/`
5. Add selection card to `.pokemon-options` in HTML if starter Pokemon

## Audio Notes

- All audio files are .ogg format for broad browser compatibility
- Music loops enabled on background tracks (script.js:19-22)
- Sound toggle affects all audio playback via `soundEnabled` flag
- Random battle sounds (`score`, `score2`) play on each attack