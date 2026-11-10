import type { CSSProperties } from 'react';
import type { Episode } from '../data/types';
import { ART_GHOSTS } from '../lib/hotspots';
import { visualAt } from '../lib/stage';
import { propsAt, spotAt } from '../lib/spoilers';
import { useI18n } from '../i18n';
import { GhostFigure } from '../components/GhostFigure';

/**
 * The drawn house. It is one picture for the whole show: every ghost is always in it, and an
 * episode only decides who is visible. CSS then walks ghosts in, out or up the beam.
 */
export function TvArt({ ep }: { ep: Episode }) {
  const { ui } = useI18n();
  const bnbOpen = ep.id >= 's02e01';
  return (
    <svg viewBox="0 0 1600 900" className="placeholder" role="img" aria-label={ui('Drawing of Woodstone Mansion with its ghosts')}>
      <defs>
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--night-deep)" />
          <stop offset="1" stopColor="var(--night)" />
        </linearGradient>
        <linearGradient id="ph-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--beam)" stopOpacity="0" />
          <stop offset="0.4" stopColor="var(--beam)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--beam)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#ph-sky)" />
      <path className="ph-trees" d="M0 800V560l70-110 60 90 70-150 80 170 60-90 50 80V800ZM1340 800V600l60-120 50 70 60-140 60 160 30-40V800Z" />

      {/* The Farnsbys' house next door, at the right edge */}
      <path className="ph-neighbor" d="M1440 800V640l80-70 80 70v160Z" />
      <rect className="ph-window lit" x="1500" y="660" width="34" height="44" />

      {/* Shed (Redcoats) and the lawn */}
      <path className="ph-shed" d="M60 800V640l70-60 70 60v160Z" />
      <rect className="ph-ground" y="800" width="1600" height="100" />

      {/* The house */}
      <path className="ph-roof" d="M370 320 600 170h400l230 150Z" />
      <path className="ph-gable" d="M690 300 800 120l110 180Z" />
      <rect className="ph-tower" x="1010" y="160" width="130" height="200" />
      <path className="ph-roof" d="M995 170 1075 70l80 100Z" />
      <rect className="ph-house" x="380" y="300" width="840" height="470" />
      <rect className="ph-foundation" x="370" y="760" width="860" height="40" />
      <rect className="ph-window" x="782" y="176" width="36" height="46" rx="18" />
      {[592, 800, 1008].map((x) => (
        <rect key={`u${x}`} className="ph-window lit" x={x - 40} y={350} width={80} height={110} />
      ))}
      {[592, 1008].map((x) => (
        <rect key={`g${x}`} className="ph-window lit" x={x - 44} y={520} width={88} height={120} />
      ))}
      <rect className="ph-door" x="755" y="560" width="90" height="200" />
      <path className="ph-porch" d="M660 520h280l30 30H630ZM650 550h14v210h-14ZM936 550h14v210h-14Z" />
      <rect className="ph-grate" x="680" y="768" width="56" height="24" />

      {/* The B&B sign goes up when the inn opens in season 2. */}
      <g className="ph-sign-fade" data-on={bnbOpen || undefined}>
        <g className="ph-sign" transform="translate(1240 690)">
          <path d="M0 110V0" />
          <rect x="-4" y="6" width="120" height="44" rx="3" />
          <text x="56" y="35" textAnchor="middle">
            B&amp;B
          </text>
        </g>
      </g>

      <g className="ph-ghosts">
        {ART_GHOSTS.map((g) => {
          const spot = spotAt(g, ep.id);
          const x = spot.x * 16;
          const y = spot.y * 9;
          return (
            <g
              key={g.id}
              className="ph-ghost"
              data-state={visualAt(g, ep)}
              data-fade={g.fadesAway || undefined}
              style={{ transform: `translate(${x}px, ${y}px)`, ['--dx' as string]: spot.x < 50 ? -1 : 1 } as CSSProperties}
            >
              <rect className="ph-beam" x={-46} y={-y} width={92} height={y + 46} fill="url(#ph-beam)" />
              <g className="ph-ghost-body">
                <GhostFigure props={propsAt(g, ep.id)} x={0} y={0} />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
