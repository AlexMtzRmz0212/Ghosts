# Intro screenshots

Drop one screenshot per episode here, named by episode id:

- `s01e01.jpg` (also `.png`, `.webp`)
- `s02e10.png`

The deck picks them up on the next `npm run dev` reload and shows them instead of the drawn placeholder.

## Placing hotspots on a real screenshot

1. Open the deck with `?edit` in the URL, e.g. `http://localhost:5173/?edit#s01e01`.
2. Click a spot on the screenshot. Its position (`{ x: 41.2, y: 33.5 }`) is copied to your clipboard.
3. Add the episode to `HOTSPOTS` in `src/data/episodes.ts`. Give a hotspot a `ghostId` to show that ghost's card (facts, years a ghost) instead of the plain explanation.
