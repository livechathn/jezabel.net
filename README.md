# jezabel.net
hacker grafiti academy
# jezabel.net - Interactive Effects Guide

## Project Overview
**jezabel.net**: Hacker's code library - JavaScript/HTML/CSS exploits and techniques

**Domain**: jezabel.net  
**Theme**: Slytherin / Hacker aesthetic  
**Colors**: Deep purple (#0d0015), Magenta (#ff00ff), Matrix Green (#00ff00)

---

## Visual Effects

### Background Animation
**Constellation Network** - Magenta/Green hacker nodes

**Effect Type**: Canvas-based particle system with connections

### Base Animation (Always Active)
- **Stars/Nodes**: Floating particles in magenta and green
- **Connections**: Lines draw between nearby nodes
- **Movement**: Gentle drift with wrapped edges
- **Brightness pulse**: Nodes fade in/out subtly
- **Cluster words**: "hack", "code", "exploit", "root", "shell" appear in dense node groups

### Mouse Hover
- **Trigger**: Mouse movement over background
- **Behavior**:
  - Lines connect mouse cursor to nearby nodes (180px radius)
  - Connection opacity based on distance
  - Color matches connected node (magenta or green)
  - Line width: 1.5px

### Click Interaction - Ultra Interactive
- **Trigger**: Click anywhere on background
- **Behavior**:
  - **Immediate flash**: Large circle (60px) at click point in green/magenta
  - **Node explosion**: 16 new nodes spawn radiating from click
  - **Push force**: Existing nodes pushed away (force × 5)
  - **Color flip**: Nodes temporarily flip color (magenta ↔ green)
  - **Scale boost**: Nodes scale 3x larger
  - **Expanding rings**: Dual rings (green + magenta) propagate outward
  - **Distance delay**: Farther nodes react later (distance × 1.5ms)
- **Duration**: 600ms color flip, rings expand to 350px
- **Visual**: Explosion of hacker energy

### Technical Details
```javascript
// Stars configuration
{
    colors: ['#ff00ff', '#00ff00'], // 50/50 split
    count: ~100-150 stars,
    radius: 1-3px,
    drift: 0.4px/frame
}

// Click explosion
{
    pushForce: × 5,
    spawnCount: 16 radiating stars,
    scaleMax: 3x,
    colorFlip: 600ms,
    rings: 2 (green + magenta)
}
```

---

## Terminal Interaction - Text Scramble

### Location
Scroll to **"access the library"** section

### Command
Type in terminal input field:
```bash
jezabel init
```
Press **Enter**

### Effect Behavior
**First execution** (text → scrambled):
- All text on page scrambles to random letters
- Same length maintained
- Spaces and punctuation preserved
- Case sensitivity maintained (uppercase → random uppercase)
- Screen flashes (opacity pulse)

**Second execution** (scrambled → text):
- Original text restored
- Same flash effect

### What Gets Scrambled
- All `<p>`, `<h1>`, `<h2>`, `<h3>` tags
- List items (`<li>`)
- Feature descriptions
- Hero text
- CTA text
- Manifesto content

### Example
```
Before: "knowledge is power. code is knowledge."
After:  "kwbxmdge hs qzwdr. rbde xs kwbxmdge."

Command again: returns to original
```

### Technical Implementation
```javascript
scrambleAlgorithm = char => {
    if (char === ' ') return ' ';
    if (char.match(/[a-z]/)) return randomLowercase();
    if (char.match(/[A-Z]/)) return randomUppercase();
    return char; // Keep punctuation
}
```

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep Purple | #0d0015 |
| Text | Light Purple | #f0e0ff |
| Accent 1 | Magenta | #ff00ff |
| Accent 2 | Matrix Green | #00ff00 |
| Dim | Muted Purple | #7a4a7a |

---

## User Experience Flow

1. **Landing**: Constellation background active, typing animation runs
2. **Exploration**: Mouse creates connection lines, natural interaction
3. **Engagement**: Clicks create hacker explosions (optional play)
4. **Discovery**: Scroll to terminal section
5. **Interaction**: Type `jezabel init` command
6. **Effect**: Page text scrambles (hacker easter egg)
7. **Restore**: Type command again to restore

---

## Design Philosophy

**Theme**: Slytherin cunning + Hacker stealth
- Code appears and disappears (no permanent trace)
- Terminal commands unlock hidden features
- RGB aesthetic (magenta = power, green = matrix/code)
- Interactive without being distracting
- Easter egg rewards curiosity

**Interaction Levels**:
- **Passive**: Background animation (always on)
- **Hover**: Connection lines (subtle)
- **Click**: Explosions (optional engagement)
- **Command**: Text scramble (hidden feature for explorers)

---

**Last Updated**: 2024-12-17  
**Status**: Live  
**Latest Version**: `jezabel-scrollable.html`
