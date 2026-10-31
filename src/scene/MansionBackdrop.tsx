import { useEffect, useRef, useState } from 'react';

const FLOORS = 8;

/**
 * Fixed scenery behind the deck. Each floor of the house has its own wall; when the
 * reader changes floor, a band of floorboards passes the screen in the direction of travel.
 */
export function MansionBackdrop({ floor }: { floor: number }) {
  const prev = useRef(floor);
  const [pass, setPass] = useState<{ key: number; dir: 'down' | 'up' } | null>(null);

  useEffect(() => {
    if (floor === prev.current) return;
    setPass({ key: Date.now(), dir: floor > prev.current ? 'down' : 'up' });
    prev.current = floor;
  }, [floor]);

  return (
    <div className="backdrop" aria-hidden="true">
      {Array.from({ length: FLOORS }, (_, f) => (
        <div key={f} className={`wall wall-${f}`} data-on={f === floor || undefined}>
          {f === 0 && <NightSky />}
          {f === 7 && <Grounds />}
        </div>
      ))}
      {pass && <div key={pass.key} className={`floorboards floorboards-${pass.dir}`} />}
      <div className="vignette" />
    </div>
  );
}

// Fixed star positions so the sky doesn't reshuffle on every render.
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: ((i * 53.3) % 55) + 2,
  r: i % 7 === 0 ? 1.6 : 0.9,
}));

function NightSky() {
  return (
    <svg className="sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x * 16} cy={s.y * 9} r={s.r} className="star" style={{ animationDelay: `${(i % 9) * 0.7}s` }} />
      ))}
      <circle cx="1290" cy="150" r="54" className="moon" />
      <circle cx="1312" cy="138" r="54" className="moon-bite" />
      {/* Woodstone's roofline: towers, gables and chimneys. */}
      <path
        className="roofline-fill"
        d="M0 900V760h180l40-60h60v-40h30v40h70l90-120 90 120h40V560l70-90 70 90v120h60l110-150 110 150h60v-60h30v60h70l60-80 60 80h170v80h60V900Z"
      />
      <g className="roof-windows">
        <rect x="575" y="610" width="22" height="34" rx="11" />
        <rect x="905" y="600" width="26" height="40" rx="13" className="lit" />
        <rect x="1160" y="690" width="20" height="30" rx="10" />
        <circle cx="440" cy="660" r="14" className="lit" />
      </g>
    </svg>
  );
}

function Grounds() {
  return (
    <svg className="sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      <path className="treeline" d="M0 900V640l60-90 50 70 60-130 70 120 50-60 80 110 60-150 70 140 50-50 70 90 90-120 60 80 70-140 80 150 60-60 70 100 80-130 70 110 60-70 80 90 80-140 60 120 40-30V900Z" />
      <path className="lawn" d="M0 900V800c300-40 700-50 1000-30s450 10 600-10v140Z" />
      {/* The old well, bottom right. */}
      <g className="well" transform="translate(1260 700)">
        <rect x="0" y="40" width="120" height="70" rx="4" />
        <path d="M-10 40h140M10 40V-20M110 40V-20M-6 -20h132L60 -60Z" />
      </g>
    </svg>
  );
}
