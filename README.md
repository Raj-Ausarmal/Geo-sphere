# GeoSphere

An interactive 3D geography quiz built with React, TypeScript, Three.js and React Three Fiber. Rotate the globe to locate countries, test capitals, and identify flags.

## Run locally

```powershell
cd GeoSphere
npm install
npm run dev
```

Open the local address printed by Vite. For a production check, run `npm run build`.

## Features

- Interactive spherical Earth with Natural Earth country boundaries, click selection, damping, zoom, and reset.
- Country Locator, Capital Challenge, and Flag Challenge modes.
- Difficulty and continent filtering, no repeated questions within a round, score, accuracy, streak, timer, feedback, and results.
- Responsive desktop and mobile layouts.

## Data and assets

Country outlines come from the `world-atlas` Natural Earth 1:110m dataset. Flag images are requested from FlagCDN at runtime; the application needs an internet connection for flag images.

## Screenshots

Run the app locally and add product screenshots here before publishing the repository.

## Project layout

`src/components/globe` contains Three.js rendering and geographic hit testing. `src/components/game` contains reusable quiz UI. `src/data` is the curated game metadata, and `src/utils/game.ts` creates randomized questions.

## License

MIT. See [LICENSE](LICENSE).

## Local Development Setup

### Prerequisites
- Node.js
- pnpm

### Installation

pnpm install
