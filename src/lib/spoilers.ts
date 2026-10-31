import { GHOSTS } from '../data/ghosts';
import type { Episode, EpisodeId, Fact, Ghost, GhostStatus, StatusChange } from '../data/types';

// Every slide reads ghost data through these selectors, so nothing from a later episode
// can show up on an earlier slide. Episode ids sort chronologically as strings.
const atOrBefore = (a: EpisodeId, b: EpisodeId) => a <= b;

export const isIntroduced = (ghost: Ghost, ep: EpisodeId) => atOrBefore(ghost.timeline[0].ep, ep);

/** Latest status change at or before `ep`, or undefined if the ghost isn't introduced yet. */
export function statusAt(ghost: Ghost, ep: EpisodeId): StatusChange | undefined {
  return ghost.timeline.filter((c) => atOrBefore(c.ep, ep)).at(-1);
}

export const ghostsAt = (ep: EpisodeId) => GHOSTS.filter((g) => isIntroduced(g, ep));

export const factsAt = (ghost: Ghost, ep: EpisodeId): Fact[] =>
  ghost.facts.filter((f) => atOrBefore(f.revealedIn, ep));

/** Decimal year of a date, e.g. 2021-10-07 -> 2021.77. */
export function yearOf(isoDate: string) {
  const d = new Date(isoDate + 'T12:00:00Z');
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const end = Date.UTC(d.getUTCFullYear() + 1, 0, 1);
  return d.getUTCFullYear() + (d.getTime() - start) / (end - start);
}

/** Whole years between death and the episode's air date, if the show gives a death year. */
export const yearsAsGhost = (ghost: Ghost, airDate: string) =>
  ghost.died === undefined ? undefined : Math.floor(yearOf(airDate) - ghost.died);

export type ChangeKind = 'appears' | 'returns' | 'leaves' | 'crosses-over' | 'learned';

export interface Change {
  kind: ChangeKind;
  ghost: Ghost;
  text: string;
}

const KIND_FOR: Record<GhostStatus, ChangeKind> = { home: 'returns', away: 'leaves', gone: 'crosses-over' };

/** What the viewer learns in exactly this episode. */
export function changesIn(ep: Episode): Change[] {
  const changes: Change[] = [];
  for (const ghost of GHOSTS) {
    ghost.timeline.forEach((c, i) => {
      if (c.ep !== ep.id) return;
      changes.push({ kind: i === 0 ? 'appears' : KIND_FOR[c.status], ghost, text: c.note });
    });
    for (const f of ghost.facts) {
      if (f.revealedIn === ep.id && ghost.timeline[0].ep !== ep.id) {
        changes.push({ kind: 'learned', ghost, text: f.text });
      }
    }
  }
  return changes;
}
