import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Episode } from '../data/types';
import { SEASONS } from '../data/episodes';
import { ghostById } from '../data/ghosts';
import { screenshotFor, spotsFor } from '../lib/hotspots';
import { GhostCard } from '../components/GhostCard';
import { useI18n } from '../i18n';
import { TvArt } from './TvArt';

const EDIT_MODE = new URLSearchParams(location.search).has('edit');

/** The television. It never changes; only what is on its screen does. */
export function Tv({ ep }: { ep: Episode }) {
  const { lang, ui, tx } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  // Effects that only make sense once the page has settled, such as the beam flash for a ghost
  // who has already crossed over when someone lands on a deep link.
  const [live, setLive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLive(true), 600);
    return () => clearTimeout(t);
  }, []);

  // A burst of static when the season (the floor) changes.
  const lastSeason = useRef(ep.season);
  const [staticKey, setStaticKey] = useState(0);
  useEffect(() => {
    if (lastSeason.current !== ep.season) setStaticKey((k) => k + 1);
    lastSeason.current = ep.season;
  }, [ep.season]);

  const shot = screenshotFor(ep);
  const spots = useMemo(() => spotsFor(ep), [ep]);
  const season = SEASONS.find((s) => s.number === ep.season)!;

  // ?edit: click anywhere on the screen to get a hotspot position for episodes.ts.
  const pick = (e: MouseEvent<HTMLDivElement>) => {
    if (!EDIT_MODE) return;
    const r = e.currentTarget.getBoundingClientRect();
    const xy = `{ x: ${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}, y: ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)} }`;
    setPicked(xy);
    navigator.clipboard?.writeText(xy).catch(() => {});
    console.log(ep.id, xy);
  };

  const current = spots.find((s) => s.key === selected && s.on);
  const currentGhost = current?.ghostId ? ghostById(current.ghostId) : undefined;

  return (
    <div className="tv" data-live={live || undefined}>
      <div className="tv-body">
        <div className="tv-screen" onClick={pick}>
          <TvArt ep={ep} />
          {shot && <img key={shot} className="tv-shot" src={shot} alt={lang === 'es' ? `Pantalla de la intro de ${tx(ep.title)}` : `Intro screen for ${ep.title}`} />}

          {spots.map((h) => (
            <button
              key={h.key}
              type="button"
              className="hotspot"
              data-on={h.on || undefined}
              data-kind={h.ghostId ? 'ghost' : 'house'}
              data-open={selected === h.key || undefined}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={tx(h.label)}
              aria-expanded={selected === h.key}
              aria-hidden={!h.on || undefined}
              tabIndex={h.on ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(selected === h.key ? null : h.key);
              }}
            >
              <span className="hotspot-label">{tx(h.label)}</span>
            </button>
          ))}

          {current && (
            <div className="hotspot-card" data-side={current.x > 55 ? 'left' : 'right'} style={{ ['--hx' as string]: `${current.x}%` }}>
              <button type="button" className="hotspot-close" onClick={() => setSelected(null)} aria-label={ui('Close')}>
                ×
              </button>
              {currentGhost ? (
                <GhostCard ghost={currentGhost} ep={ep} />
              ) : (
                <>
                  <h4>{tx(current.label)}</h4>
                  <p>{tx(current.explanation)}</p>
                </>
              )}
            </div>
          )}

          <div className="tv-osd" key={ep.id} aria-hidden="true">
            S{ep.season} E{ep.number}
          </div>
          <div className="tv-banner" key={`banner-${ep.season}`} aria-hidden="true">
            <span>
              {ui('Season')} {ep.season}
            </span>
            <em>{tx(season.floor)}</em>
          </div>
          {staticKey > 0 && <div key={staticKey} className="tv-static" aria-hidden="true" />}
          {EDIT_MODE && <div className="edit-chip">{picked ?? 'Edit mode: click to copy a hotspot position'}</div>}
        </div>

        <div className="tv-chin" aria-hidden="true">
          <i className="tv-led" />
          <span>WOODSTONE</span>
          <i className="tv-speaker" />
        </div>
      </div>
      <div className="tv-feet" aria-hidden="true">
        <i />
        <i />
      </div>
    </div>
  );
}
