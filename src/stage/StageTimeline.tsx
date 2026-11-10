import type { Episode, Ghost } from '../data/types';
import { EPISODES } from '../data/episodes';
import { GHOSTS } from '../data/ghosts';
import { isIntroduced, statusAt, yearOf } from '../lib/spoilers';
import { useTween } from '../lib/stage';
import { useI18n } from '../i18n';

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

const CENTURIES = Array.from({ length: 11 }, (_, i) => 1000 + i * 100);
const LABELED = new Set([1000, 1500, 1800, 1900, 2000]);
const airYear = (id: string) => yearOf(EPISODES.find((e) => e.id === id)!.airDate);

type Dated = Ghost & { born: number; died: number };

/** Every ghost with a known lifetime, in the order their rows sit: earliest death first. */
const DATED = GHOSTS.filter((g): g is Dated => g.born !== undefined && g.died !== undefined).sort((a, b) => a.died - b.died);

const W = 500;
const LABEL_W = 225;
// Right edges of the number columns in the label area: age at death, years dead, total.
const COL_AGE = 118;
const COL_DEAD = 168;
const COL_TOTAL = 213;
const ROW_H = 25;
const TOP = 34;
const AXIS_H = 22;
const PLOT_W = W - LABEL_W - 12;
const x = (year: number) => LABEL_W + scale(year) * PLOT_W;
const BAR_H = 9;
const heightFor = (rows: number) => TOP + rows * ROW_H + AXIS_H;
/** Width over height of the chart once every ghost is on it: the box that holds it is always this shape. */
export const TIMELINE_ASPECT = W / heightFor(DATED.length);

/**
 * One timeline for the whole show. A ghost's row slides in when the show introduces them, rows
 * below make room, and the bars grow as the "now" line glides to the new air date.
 */
export function StageTimeline({ ep }: { ep: Episode }) {
  const { lang, locale } = useI18n();
  const es = lang === 'es';
  const fmt = new Intl.NumberFormat(locale);
  const now = useTween(yearOf(ep.airDate));
  const visible = DATED.filter((g) => isIntroduced(g, ep.id));
  // The chart is only as tall as the cast so far, and grows (zooming out) as ghosts arrive.
  const H = heightFor(useTween(visible.length, 750));

  return (
    <svg
      className="stage-timeline"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMin meet"
      role="img"
      aria-label={es ? `Cronología de los fantasmas hasta la temporada ${ep.season}, episodio ${ep.number}` : `Ghost timeline as of season ${ep.season}, episode ${ep.number}`}
    >
      {CENTURIES.map((t) => (
        <g key={t} className="tick">
          <line x1={x(t)} x2={x(t)} y1={TOP - 8} y2={H - AXIS_H + 2} />
          {LABELED.has(t) && (
            <text x={x(t)} y={H - 6} textAnchor="middle">
              {t}
            </text>
          )}
        </g>
      ))}

      <g className="col-heads">
        <text x={COL_AGE} y={TOP - 14} textAnchor="end">
          {es ? 'edad' : 'age'}
        </text>
        <text x={COL_DEAD} y={TOP - 14} textAnchor="end">
          {es ? 'muerto' : 'dead'}
        </text>
        <text x={COL_TOTAL} y={TOP - 14} textAnchor="end">
          total
        </text>
      </g>

      {DATED.map((g) => {
        const status = statusAt(g, ep.id);
        const on = status !== undefined;
        // A row that isn't introduced yet waits where it will slot in, so the others part to make room.
        const slot = on ? visible.indexOf(g) : visible.filter((v) => v.died < g.died).length;
        const gone = status?.status === 'gone';
        const away = status?.status === 'away';
        const end = gone && status ? airYear(status.ep) : now;
        const awayFrom = away && status ? airYear(status.ep) : null;
        const years = Math.max(0, Math.floor(end - g.died));
        // Age at death, and the whole time they have existed (life plus afterlife). A "~" means an estimate.
        const age = g.died - g.born;
        const ageTilde = g.approx ? '~' : '';
        const total = age + years;
        const cy = ROW_H / 2;
        const ghostEnd = awayFrom ?? end;
        return (
          <g key={g.id} className={`tl-row row-${status?.status ?? 'hidden'}`} data-on={on || undefined} style={{ transform: `translateY(${TOP + slot * ROW_H}px)` }}>
            <title>
              {g.name}
              {gone ? (es ? ': cruzó al más allá' : ': crossed over') : away ? (es ? ': lejos de la casa' : ': away from the house') : ''}
              {es
                ? `. Murió a los ${ageTilde}${age}; lleva ${g.approx === 'both' ? '~' : ''}${fmt.format(years)} años muerto; ${ageTilde}${fmt.format(total)} en total.`
                : `. Died at ${ageTilde}${age}; dead ${g.approx === 'both' ? '~' : ''}${fmt.format(years)} years; ${ageTilde}${fmt.format(total)} in all.`}
            </title>
            <text className="row-name" x={0} y={cy + 5}>
              {g.name.split(' ')[0]}
            </text>
            <text className="row-age" x={COL_AGE} y={cy + 4} textAnchor="end">
              {ageTilde}
              {age}
            </text>
            <text className="row-years" x={COL_DEAD} y={cy + 4} textAnchor="end">
              {g.approx === 'both' ? '~' : ''}
              {fmt.format(years)}
            </text>
            <text className="row-total" x={COL_TOTAL} y={cy + 4} textAnchor="end">
              {ageTilde}
              {fmt.format(total)}
            </text>
            <rect className="bar-alive" x={x(g.born)} y={cy - BAR_H / 2} width={Math.max(2, x(g.died) - x(g.born))} height={BAR_H} rx={BAR_H / 2} />
            <rect className="bar-ghost" x={x(g.died)} y={cy - BAR_H / 2} width={Math.max(2, x(ghostEnd) - x(g.died))} height={BAR_H} rx={BAR_H / 2} />
            {awayFrom !== null && <line className="bar-away" x1={x(awayFrom)} x2={x(end)} y1={cy} y2={cy} />}
            {gone && <rect className="bar-beam" x={x(end) - 3} y={cy - ROW_H / 2} width={6} height={ROW_H} rx={3} />}
          </g>
        );
      })}

      <line className="now-line" x1={x(now)} x2={x(now)} y1={TOP - 14} y2={H - AXIS_H + 2} />
      <text className="now-label" x={x(now) - 6} y={TOP - 18} textAnchor="end">
        S{ep.season}E{ep.number}
      </text>
    </svg>
  );
}
