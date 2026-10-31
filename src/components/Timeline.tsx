import type { Episode, Ghost } from '../data/types';
import { EPISODES } from '../data/episodes';
import { ghostsAt, statusAt, yearOf } from '../lib/spoilers';

// The axis runs at normal scale where ghosts lived and died, and is squeezed across the empty
// stretches: before Sasappis, and between Sasappis and Isaac. A squeezed year takes up
// SQUEEZE of the width of a normal year.
const SQUEEZE = 0.12;
const SEGMENTS = [
  { from: 950, to: 1480, squeezed: true },
  { from: 1480, to: 1530, squeezed: false },
  { from: 1530, to: 1730, squeezed: true },
  { from: 1730, to: 2032, squeezed: false },
];
const weight = (seg: (typeof SEGMENTS)[number], years = seg.to - seg.from) => years * (seg.squeezed ? SQUEEZE : 1);
const TOTAL = SEGMENTS.reduce((sum, seg) => sum + weight(seg), 0);

/** Position of a year along the axis, 0 to 1. */
function scale(year: number) {
  let before = 0;
  for (const seg of SEGMENTS) {
    if (year <= seg.to) return (before + weight(seg, Math.max(0, year - seg.from))) / TOTAL;
    before += weight(seg);
  }
  return 1;
}

// One grid line per century everywhere; in squeezed stretches they just sit closer together.
// Only the ones with room for a label get one.
const CENTURIES = Array.from({ length: 11 }, (_, i) => 1000 + i * 100);
const LABELED = new Set([1000, 1500, 1800, 1900, 2000]);
const fmt = new Intl.NumberFormat('en-US');
const airYear = (id: string) => yearOf(EPISODES.find((e) => e.id === id)!.airDate);

interface Props {
  ep: Episode;
  compact?: boolean;
}

/** Lifetimes and ghost-years of everyone introduced by `ep`, measured to its air date. */
export function Timeline({ ep, compact = false }: Props) {
  const now = yearOf(ep.airDate);
  const ghosts = ghostsAt(ep.id)
    .filter((g): g is Ghost & { born: number; died: number } => g.born !== undefined && g.died !== undefined)
    .filter((g) => !compact || g.main)
    .sort((a, b) => a.died - b.died);

  const W = compact ? 460 : 1000;
  const labelW = compact ? 170 : 250;
  const rowH = compact ? 28 : 36;
  const top = compact ? 26 : 50;
  const plotW = W - labelW - 20;
  const H = top + ghosts.length * rowH + (compact ? 8 : 34);
  const x = (year: number) => labelW + scale(year) * plotW;
  const nowX = x(now);
  const plotTop = top - 8;
  const plotBottom = H - (compact ? 4 : 26);
  const barH = compact ? 8 : 12;
  const squeezed = SEGMENTS.filter((seg) => seg.squeezed);

  return (
    <svg
      className={compact ? 'timeline compact' : 'timeline'}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Ghost timeline as of season ${ep.season}, episode ${ep.number}`}
    >
      {!compact &&
        squeezed.map((seg) => (
          <text key={seg.from} className="break-label" x={(x(seg.from) + x(seg.to)) / 2} y={top - 20} textAnchor="middle">
            {fmt.format(seg.to - seg.from)} years, squeezed
          </text>
        ))}

      {/* Axis */}
      {CENTURIES.map((t) => (
        <g key={t} className="tick">
          <line x1={x(t)} x2={x(t)} y1={plotTop} y2={plotBottom} />
          {!compact && LABELED.has(t) && (
            <text x={x(t)} y={H - 8} textAnchor="middle">
              {t}
            </text>
          )}
        </g>
      ))}

      {/* Now marker */}
      <line className="now-line" x1={nowX} x2={nowX} y1={top - 14} y2={H - (compact ? 4 : 26)} />
      <text className="now-label" x={nowX - 6} y={top - 18 + (compact ? 4 : 0)} textAnchor="end">
        {compact ? `S${ep.season}E${ep.number}` : `Season ${ep.season}, episode ${ep.number}`}
      </text>

      {ghosts.map((g, i) => {
        const y = top + i * rowH;
        const status = statusAt(g, ep.id)!;
        const end = status.status === 'gone' ? airYear(status.ep) : now;
        const awayFrom = status.status === 'away' ? airYear(status.ep) : null;
        const years = Math.floor(end - g.died);
        const cy = y + rowH / 2;
        return (
          <g key={g.id} className={`row row-${status.status}`}>
            <text className="row-name" x={0} y={cy + (compact ? 4 : 0)}>
              {g.name.split(' ')[0]}
            </text>
            <text className="row-years" x={labelW - 14} y={cy + (compact ? 4 : 0)} textAnchor="end">
              {g.approx === 'both' ? '~' : ''}
              {fmt.format(years)} yrs
            </text>
            {!compact && (
              <text className="row-sub" x={0} y={cy + 15}>
                {status.status === 'gone' ? 'Crossed over' : status.status === 'away' ? 'Away from the house' : g.approx ? `c. ${g.born}–${g.died}` : `${g.born}–${g.died}`}
              </text>
            )}
            <rect className="bar-alive" x={x(g.born)} y={cy - barH / 2} width={Math.max(2, x(g.died) - x(g.born))} height={barH} rx={barH / 2} />
            <rect
              className="bar-ghost"
              x={x(g.died)}
              y={cy - barH / 2}
              width={Math.max(2, x(awayFrom ?? end) - x(g.died))}
              height={barH}
              rx={barH / 2}
            />
            {awayFrom !== null && (
              <line className="bar-away" x1={x(awayFrom)} x2={x(end)} y1={cy} y2={cy} />
            )}
            {status.status === 'gone' && <rect className="bar-beam" x={x(end) - 3} y={cy - rowH / 2} width={6} height={rowH} rx={3} />}
          </g>
        );
      })}
    </svg>
  );
}
