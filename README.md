# KC Convention Center Interactive Map

React + Vite version of the interactive map.

## Setup

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Where things live

- **`public/booths.json`** — the single source of truth for every room: label,
  sidebar group, base map image path, and (once populated) booth coordinates.
  Edit this file (or have your separate admin tool write to it) and the app
  picks up the change on next reload — no other file needs to change.

- **`public/images/`** — put your map images here, matching the paths already
  referenced in `booths.json` (e.g. `images/bartle_hall/hall-a-blank.png`,
  `images/uncolored.jpg`, `images/copyright.png`) and the two top-down
  galleries (`images/top_down/bartle_hall/...`, `images/top_down/great_hall/...`).
  None of these are included yet — the app will run fine without them, the
  map area will just be blank until you add them.

- **`src/App.jsx`** — fetches `booths.json`, builds the sidebar groups/labels
  and the map layers/booth pins from it.
- **`src/BartleGallery.jsx`** / **`src/GreatHallGallery.jsx`** — the two
  top-down zoomable galleries. These are still hardcoded to specific image
  filenames (not driven by booths.json), since that data isn't in the JSON
  schema yet.
- **`src/ZoomImage.jsx`** — the magnifier-lens hover effect, shared by both
  galleries.

## Adding/renaming a room

Add an entry to `public/booths.json` under `"rooms"` with a unique key, a
`label`, a `group`, and a `baseImage` path. It will automatically appear in
the sidebar and get wired up on the map — no code changes needed.

## Deploying

```
npm run build
```

Outputs a static `dist/` folder you can host anywhere (Netlify, GitHub Pages,
S3, etc.) — `booths.json` and `images/` just need to be served alongside it.
