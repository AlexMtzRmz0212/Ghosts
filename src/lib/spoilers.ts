import { GHOSTS } from '../data/ghosts';
import type { Episode, EpisodeId, Fact, Ghost, GhostStatus, Prop, StatusChange } from '../data/types';

// Every slide reads ghost data through these selectors, so nothing from a later episode
// can show up on an earlier slide. Episode ids sort chronologically as strings.
const atOrBefore = (a: EpisodeId, b: EpisodeId) => a <= b;

export const isIntroduced = (ghost: Ghost, ep: EpisodeId) => atOrBefore(ghost.timeline[0].ep, ep);

/** Latest status change at or before `ep`, or undefined if the ghost isn't introduced yet. */
export function statusAt(ghost: Ghost, ep: EpisodeId): StatusChange | undefined {
  return ghost.timeline.filter((c) => atOrBefore(c.ep, ep)).at(-1);
}

/**
 * The icons a ghost wears at `ep`: the latest one a timeline entry has set (or their first), plus
 * the one the show has added since.
 */
export const propsAt = (ghost: Ghost, ep: EpisodeId): Prop[] => [
  ghost.timeline.filter((c) => c.prop && atOrBefore(c.ep, ep)).at(-1)?.prop ?? ghost.prop,
  ...(ghost.extra ?? []),
  ...(ghost.moments?.filter((m) => m.eps.includes(ep)).map((m) => m.prop) ?? []),
  ...(ghost.reveal && atOrBefore(ghost.reveal.ep, ep) ? [ghost.reveal.prop] : []),
  ...(ghost.timeline.filter((c) => c.asleep !== undefined && atOrBefore(c.ep, ep)).at(-1)?.asleep ? (['asleep'] as const) : []),
];

/** Where a ghost stands on the TV at `ep`: their own spot, unless a trip has moved them. */
export const spotAt = (ghost: Ghost, ep: EpisodeId) =>
  ghost.timeline.filter((c) => c.spot !== undefined && atOrBefore(c.ep, ep)).at(-1)?.spot ?? ghost.spot;

export const ghostsAt =(ep: EpisodeId) => GHOSTS.filter((g) => isIntroduced(g, ep));

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

export type ChangeKind = 'appears' | 'returns' | 'leaves' | 'crosses-over' | 'learned' | 'sleeps';

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
      // A move while still "home" reads as leaving (to somewhere else) or coming back.
      const home = c.status === 'home';
      const kind: ChangeKind =
        i === 0
          ? 'appears'
          : home && c.asleep !== undefined
            ? c.asleep
              ? 'sleeps'
              : 'returns'
            : home && c.spot !== undefined
              ? c.spot
                ? 'leaves'
                : 'returns'
              : KIND_FOR[c.status];
      changes.push({ kind, ghost, text: c.note });
    });
    for (const f of ghost.facts) {
      if (f.revealedIn === ep.id && ghost.timeline[0].ep !== ep.id) {
        changes.push({ kind: 'learned', ghost, text: f.text });
      }
    }
  }
  return changes;
}
