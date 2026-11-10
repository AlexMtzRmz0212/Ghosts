import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { EPISODES, EPISODE_NOTES, SEASONS } from '../data/episodes';
import { changesIn, type ChangeKind } from '../lib/spoilers';
import { fmtDate } from '../lib/format';
import { useI18n } from '../i18n';
import { BridgeContext } from '../deck/bridge';
import { Tv } from './Tv';
import { StageTimeline, TIMELINE_ASPECT } from './StageTimeline';

/** Screens of scrolling it takes to move one episode. */
export const STAGE_STEP = 0.28;
/** Extra screens of scroll the stage needs on top of its own height. */
export const STAGE_SCREENS = EPISODES.length * STAGE_STEP;

const N = EPISODES.length;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const SEASON_START = SEASONS.map((s) => EPISODES.findIndex((e) => e.season === s.number));
const SEASON_COUNT = SEASONS.map((s) => EPISODES.filter((e) => e.season === s.number).length);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const KIND_LABEL = {
  appears: 'Arrives',
  returns: 'Back',
  leaves: 'Leaves',
  'crosses-over': 'Sucked off',
  learned: 'We learn',
  sleeps: 'Asleep',
} as const satisfies Record<ChangeKind, string>;

/**
 * One TV for the whole show. The slide is tall and its contents stick to the screen: scrolling
 * moves through episodes while the TV, the notes and the timeline stay put and animate.
 */
export function Stage() {
  const { lang, ui, tx, locale } = useI18n();
  const es = lang === 'es';
  const bridge = useContext(BridgeContext);
  const rootEl = useRef<HTMLDivElement>(null);

  // The side panel (timeline and notes) can slide away to give the TV the room. The choice is remembered.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('ghosts.side.collapsed') === '1';
    } catch {
      return false;
    }
  });
  const toggleSide = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem('ghosts.side.collapsed', c ? '0' : '1');
      } catch {
        /* private mode: the choice just isn't remembered */
      }
      return !c;
    });

  const [idx, setIdx] = useState(() => Math.max(0, EPISODES.findIndex((e) => e.id === decodeURIComponent(location.hash.slice(1)))));
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const pending = useRef<{ target: number; timer: number } | null>(null);

  const geometry = useCallback(() => {
    const el = rootEl.current;
    const section = el?.closest('section');
    const deck = el?.closest<HTMLElement>('.deck');
    if (!section || !deck) return null;
    return { section, deck, step: deck.clientHeight * STAGE_STEP };
  }, []);

  const scrollToIndex = useCallback(
    (i: number, behavior: ScrollBehavior = 'smooth') => {
      const g = geometry();
      if (!g) return;
      g.deck.scrollTo({ top: g.section.offsetTop + (i + 0.5) * g.step, behavior: reducedMotion() ? 'auto' : behavior });
    },
    [geometry],
  );

  // Which episode is on screen follows how far into the slide the reader has scrolled.
  useEffect(() => {
    const g = geometry();
    if (!g) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const cur = geometry();
      if (!cur) return;
      const i = clamp(Math.floor((cur.deck.scrollTop - cur.section.offsetTop) / cur.step), 0, N - 1);
      if (pending.current?.target === i) {
        clearTimeout(pending.current.timer);
        pending.current = null;
      }
      setIdx(i);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    g.deck.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      g.deck.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geometry]);

  // Lets the deck's keys and buttons move by episode.
  useEffect(() => {
    bridge.register({
      step(dir) {
        const base = pending.current?.target ?? idxRef.current;
        const next = base + dir;
        if (next < 0 || next > N - 1) return false;
        if (pending.current) clearTimeout(pending.current.timer);
        // Forget the target if the scroll never lands on it, so a stray scroll can't strand the keys.
        pending.current = { target: next, timer: window.setTimeout(() => (pending.current = null), 1200) };
        scrollToIndex(next);
        return true;
      },
      goTo(id, behavior = 'auto') {
        const i = EPISODES.findIndex((e) => e.id === id);
        if (i < 0) return false;
        scrollToIndex(i, behavior);
        return true;
      },
      enterFromEnd(behavior = 'smooth') {
        const g = geometry();
        if (g) g.deck.scrollTo({ top: g.section.offsetTop + g.section.offsetHeight - g.deck.clientHeight, behavior: reducedMotion() ? 'auto' : behavior });
      },
    });
    return () => bridge.register(null);
  }, [bridge, scrollToIndex, geometry]);

  const ep = EPISODES[idx];
  const label = `S${ep.season}E${ep.number}`;
  useEffect(() => {
    bridge.report({ id: ep.id, floor: ep.season, label, title: `${label} ${tx(ep.title)}`, index: idx, total: N });
  }, [bridge, ep, label, tx, idx]);

  const changes = changesIn(ep);
  const note = EPISODE_NOTES[ep.id];

  return (
    <div className="stage" ref={rootEl}>
      <div className="stage-sticky" data-collapsed={collapsed || undefined}>
        <button
          type="button"
          className="side-toggle"
          aria-expanded={!collapsed}
          aria-controls="stage-side"
          aria-label={collapsed ? (es ? 'Mostrar cronología y notas' : 'Show timeline and notes') : es ? 'Ocultar cronología y notas' : 'Hide timeline and notes'}
          onClick={toggleSide}
        >
          <span className="side-toggle-chev" aria-hidden="true">
            ›
          </span>
          <span className="side-toggle-label">{es ? 'Cronología' : 'Timeline'}</span>
        </button>
        <header className="stage-head">
          <div className="swap" key={ep.id}>
            <p className="ep-code">
              {es ? `Temporada ${ep.season}, episodio ${ep.number}` : `Season ${ep.season}, episode ${ep.number}`}
              <span className="ep-date">
                {' · '}
                {es ? 'Emitido el' : 'Aired'} {fmtDate(locale, ep.airDate)}
                {ep.approxDate ? (es ? ' (la misma noche que el episodio anterior)' : ' (same night as the episode before)') : ''}
              </span>
            </p>
            <h2 title={tx(ep.title)}>{tx(ep.title)}</h2>
          </div>
        </header>

        <div className="stage-tv">
          <Tv ep={ep} />
          <div className="scrub">
            <input
              type="range"
              min={0}
              max={N - 1}
              value={idx}
              aria-label={ui('Jump to episode')}
              aria-valuetext={label}
              onChange={(e) => scrollToIndex(Number(e.target.value), 'auto')}
            />
            <div className="scrub-seasons">
              {SEASONS.map((s, k) => (
                <button
                  key={s.number}
                  type="button"
                  style={{ flexGrow: SEASON_COUNT[k] }}
                  data-on={ep.season === s.number || undefined}
                  onClick={() => scrollToIndex(SEASON_START[k], 'auto')}
                  aria-label={`${ui('Season')} ${s.number}`}
                >
                  S{s.number}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="stage-side" id="stage-side" aria-hidden={collapsed || undefined} inert={collapsed || undefined}>
          {/* The chart keeps one size for the whole show; the notes under it take the leftover room, so nothing above them moves. */}
          <div className="side-title">
            <h3>{ui('Years a ghost, as of tonight')}</h3>
            <span className="info">
              <button type="button" className="info-btn" aria-describedby="timeline-help" aria-label={es ? 'Cómo leer el gráfico' : 'How to read this chart'}>
                i
              </button>
              <span className="info-tip" id="timeline-help" role="tooltip">
                {ui('Each line is a century. Where they bunch up, the years are squeezed.')} {ui('A ~ means the death year is an estimate.')}
              </span>
            </span>
          </div>
          <div className="stage-timeline-wrap" style={{ ['--tl-aspect' as string]: TIMELINE_ASPECT }}>
            <StageTimeline ep={ep} />
          </div>
          <h3 className="side-changes">{ui('What changed in the house')}</h3>
          <div className="notes swap" key={ep.id}>
            {note || changes.length > 0 ? (
              <ul className="changes">
                {note && <li className="change change-house">{tx(note)}</li>}
                {changes.map((c, i) => (
                  <li key={i} className={`change change-${c.kind}`} style={{ ['--i' as string]: i + 1 }}>
                    <span className="change-kind">{ui(KIND_LABEL[c.kind])}</span> <strong>{c.ghost.name}.</strong> {tx(c.text)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="quiet">{ui('Same ghosts as last week. Nobody new, nobody gone.')}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
