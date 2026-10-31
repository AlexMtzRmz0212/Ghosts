import { useState, type MouseEvent } from 'react';
import type { Episode } from '../data/types';
import { ghostById } from '../data/ghosts';
import { changesIn } from '../lib/spoilers';
import { ghostsInFrame, hotspotsFor, screenshotFor } from '../lib/hotspots';
import { GhostFigure } from './GhostFigure';
import { GhostCard } from './GhostCard';

const EDIT_MODE = new URLSearchParams(location.search).has('edit');

export function IntroFrame({ ep }: { ep: Episode }) {
  const [open, setOpen] = useState<number | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const shot = screenshotFor(ep);
  const hotspots = hotspotsFor(ep);
  const changes = changesIn(ep);
  const isNew = (id?: string) => changes.some((c) => c.kind === 'appears' && c.ghost.id === id);
  const departing = changes.filter((c) => c.kind === 'leaves' || c.kind === 'crosses-over');

  // ?edit: click anywhere on the frame to get a hotspot position for episodes.ts.
  const pick = (e: MouseEvent<HTMLDivElement>) => {
    if (!EDIT_MODE) return;
    const r = e.currentTarget.getBoundingClientRect();
    const xy = `{ x: ${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}, y: ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)} }`;
    setPicked(xy);
    navigator.clipboard?.writeText(xy).catch(() => {});
    console.log(ep.id, xy);
  };

  const current = open === null ? null : hotspots[open];
  const currentGhost = current?.ghostId ? ghostById(current.ghostId) : undefined;

  return (
    <figure className="intro">
      <div className="intro-frame" onClick={pick}>
        {shot ? (
          <img src={shot} alt={`Intro screen for ${ep.title}`} />
        ) : (
          <PlaceholderArt ep={ep} departing={departing.map((d) => ({ id: d.ghost.id, crossed: d.kind === 'crosses-over' }))} />
        )}

        {hotspots.map((h, i) => (
          <button
            key={`${h.label}-${i}`}
            type="button"
            className="hotspot"
            data-new={isNew(h.ghostId) || undefined}
            data-open={open === i || undefined}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            aria-label={h.label}
            aria-expanded={open === i}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(open === i ? null : i);
            }}
          >
            <span className="hotspot-label">{h.label}</span>
          </button>
        ))}

        {current && (
          <div className="hotspot-card" data-side={current.x > 55 ? 'left' : 'right'} style={{ ['--hx' as string]: `${current.x}%` }}>
            <button type="button" className="hotspot-close" onClick={() => setOpen(null)} aria-label="Close">
              ×
            </button>
            {currentGhost ? (
              <GhostCard ghost={currentGhost} ep={ep} />
            ) : (
              <>
                <h4>{current.label}</h4>
                <p>{current.explanation}</p>
              </>
            )}
          </div>
        )}

        {EDIT_MODE && <div className="edit-chip">{picked ?? 'Edit mode: click to copy a hotspot position'}</div>}
      </div>
      <figcaption>
        {shot ? 'Intro screen' : 'Placeholder art until the real intro screenshot is added'}. Tap a glowing spot to see who or what it is.
      </figcaption>
    </figure>
  );
}

function PlaceholderArt({ ep, departing }: { ep: Episode; departing: { id: string; crossed: boolean }[] }) {
  const bnbOpen = ep.id >= 's02e01';
  return (
    <svg viewBox="0 0 1600 900" className="placeholder" role="img" aria-label="Drawing of Woodstone Mansion with its ghosts">
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
      {bnbOpen && (
        <g className="ph-sign" transform="translate(1240 690)">
          <path d="M0 110V0" />
          <rect x="-4" y="6" width="120" height="44" rx="3" />
          <text x="56" y="35" textAnchor="middle">B&amp;B</text>
        </g>
      )}

      {ghostsInFrame(ep).map((g) => (
        <GhostFigure key={g.id} prop={g.prop} x={g.spot.x * 16} y={g.spot.y * 9} />
      ))}

      {departing.map(({ id, crossed }) => {
        const g = ghostById(id)!;
        const x = g.spot.x * 16;
        const y = g.spot.y * 9;
        return (
          <g key={id} className={crossed ? 'ph-departing crossed' : 'ph-departing'}>
            {crossed && <rect x={x - 46} y={0} width={92} height={y + 46} fill="url(#ph-beam)" className="ph-beam" />}
            <GhostFigure prop={g.prop} x={x} y={y} />
          </g>
        );
      })}

      <text className="ph-code" x="1560" y="60" textAnchor="end">
        S{ep.season} E{ep.number}
      </text>
    </svg>
  );
}
