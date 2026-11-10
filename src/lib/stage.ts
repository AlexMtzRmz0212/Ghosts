import { useEffect, useRef, useState } from 'react';
import type { Episode, Ghost, GhostStatus } from '../data/types';
import { statusAt } from './spoilers';

/** What the TV shows for a ghost at an episode. `hidden` means not introduced yet (or never drawn). */
export type Visual = 'hidden' | GhostStatus;

export function visualAt(ghost: Ghost, ep: Episode): Visual {
  if (ghost.haunts === 'elsewhere') return 'hidden';
  return statusAt(ghost, ep.id)?.status ?? 'hidden';
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Eases a number towards `target`, so things that depend on it (bars, counters) glide instead of jump. */
export function useTween(target: number, ms = 900) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (current.current === target) return;
    if (reducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      current.current = from + (target - from) * eased;
      setValue(current.current);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);

  return value;
}
