import type { Episode, Hotspot } from '../data/types';
import { ghostsAt, statusAt } from './spoilers';

// Screenshots dropped into src/assets/intros/ (named s01e01.jpg, .png or .webp) replace the
// drawn placeholder for that episode. See src/assets/intros/README.md.
const SCREENSHOTS = import.meta.glob<string>('../assets/intros/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function screenshotFor(ep: Episode): string | undefined {
  const match = Object.entries(SCREENSHOTS).find(([path]) => path.split('/').pop()!.startsWith(ep.id + '.'));
  return match?.[1];
}

/** Ghosts drawn in this episode's placeholder art: introduced, at home, and haunting Woodstone or next door. */
export const ghostsInFrame = (ep: Episode) =>
  ghostsAt(ep.id).filter((g) => g.haunts !== 'elsewhere' && statusAt(g, ep.id)?.status === 'home');

/** Hotspots for an episode: hand-placed ones if the episode has them, else generated from the placeholder layout. */
export function hotspotsFor(ep: Episode): Hotspot[] {
  if (ep.hotspots) return ep.hotspots;
  const bnbOpen = ep.id >= 's02e01';
  const house: Hotspot = {
    x: 50,
    y: 31,
    label: bnbOpen ? 'Woodstone B&B' : 'Woodstone Mansion',
    explanation: bnbOpen
      ? 'Sam and Jay’s inn. The living guests check in; the dead residents never check out.'
      : 'A crumbling country estate in upstate New York. Sam inherits it and plans to turn it into a B&B.',
  };
  const ghosts = ghostsInFrame(ep).map<Hotspot>((g) => ({ ...g.spot, label: g.name, explanation: g.era, ghostId: g.id }));
  return [house, ...ghosts];
}
