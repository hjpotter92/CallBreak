# Call Break Score Tracker

A Nuxt 3 app for tracking scores in the Call Break card game.

*Vibe-coded*—built iteratively with creative flow and AI assistance.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run generate   # Static output for GitHub Pages, etc.
```

## Features

- **2–6 players** with optional emoji avatars
- **Custom scoring**: bid ≥7 & hands ≥7 → 140; miss → -10×bid; exact → 10×bid; exceed by 1/2 → +1/+2; exceed by 3+ → -10×bid
- **Validation**: bids 2–13, sum ≥10; hands won sum = 13
- **Match history** persisted in localStorage
- **4 theme palettes** (Classic, Slate, Amber, Ocean) + light/dark mode
- **Target score** (default 200) with winner detection

## Tech Stack

Nuxt 3 (SPA), Pinia, Nuxt UI, Tailwind CSS, @nuxtjs/color-mode
