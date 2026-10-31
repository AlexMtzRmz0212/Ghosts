# Ghosts

A fan-made scroll-down presentation of the CBS show *Ghosts*: every episode's intro screen with clickable hotspots, plus a timeline of how long each ghost has been dead. Each slide only shows what the show had revealed by that episode.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Space / arrow keys move one slide; links like `#s02e05` go straight to an episode.

## Where things live

- `src/data/episodes.ts`: episode titles, air dates, and house-level notes
- `src/data/ghosts.ts`: ghosts, their years, and facts tagged with the episode that reveals them
- `src/assets/intros/`: drop real intro screenshots here (see the README in that folder)
