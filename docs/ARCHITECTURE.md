# Architecture

The application is a Vite single-page React app. `App` switches among home, play, and results views while Zustand persists the selected mode, difficulty, and region across the transition.

The globe uses React Three Fiber. The sphere is a Three.js mesh and country boundary line segments are generated once from Natural Earth TopoJSON. Click coordinates are converted to longitude/latitude and checked with a planar point-in-polygon routine against the same country geometry. This keeps selection data and borders synchronized.

Quiz data is intentionally separate from geometry: `data/countries.ts` holds names, capitals, ISO codes, and regions. `utils/game.ts` produces a shuffled session and decoy options.
