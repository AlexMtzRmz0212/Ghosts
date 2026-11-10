import type { Episode, Hotspot } from '../data/types';
import { GHOSTS } from '../data/ghosts';
import { spotAt, statusAt } from './spoilers';

// Screenshots dropped into src/assets/intros/ (named s01e01.jpg, .png or .webp) are shown on the
// TV for that episode, over the drawn art. See src/assets/intros/README.md.
const SCREENSHOTS = import.meta.glob<string>('../assets/intros/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function screenshotFor(ep: Episode): string | undefined {
  const match = Object.entries(SCREENSHOTS).find(([path]) => path.split('/').pop()!.startsWith(ep.id + '.'));
  return match?.[1];
}

export interface Spot extends Hotspot {
  /** Stable across episodes, so a spot can fade in and out instead of being replaced. */
  key: string;
  /** Whether the spot is on screen at this episode. */
  on: boolean;
}

/** Ghosts that appear in the drawn art. Ghosts marked `haunts: 'elsewhere'` never do. */
export const ART_GHOSTS = GHOSTS.filter((g) => g.haunts !== 'elsewhere');

/** Spots for an episode: hand-placed ones if the episode has them, else generated from the drawn art. */
export function spotsFor(ep: Episode): Spot[] {
  if (ep.hotspots) return ep.hotspots.map((h, i) => ({ ...h, key: `custom-${i}`, on: true }));
  const bnbOpen = ep.id >= 's02e01';
  const house: Spot = {
    key: 'house',
    on: true,
    x: 50,
    y: 31,
    label: bnbOpen ? 'Woodstone B&B' : 'Woodstone Mansion',
    explanation: bnbOpen
      ? 'Sam and Jay’s inn. The living guests check in; the dead residents never check out.'
      : 'A crumbling country estate in upstate New York. Sam inherits it and plans to turn it into a B&B.',
  };
  const ghosts = ART_GHOSTS.map<Spot>((g) => ({
    key: g.id,
    on: statusAt(g, ep.id)?.status === 'home',
    ...spotAt(g, ep.id),
    label: g.name,
    explanation: g.era,
    ghostId: g.id,
  }));
  return [house, ...ghosts];
}
