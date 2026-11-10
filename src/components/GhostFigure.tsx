import type { Prop } from '../data/types';

/** A drawn ghost, centred on (0,0), about 90 units tall. Props are the show's visual shorthand. */
export function GhostFigure({ props, x, y }: { props: Prop[]; x: number; y: number }) {
  if (props.includes('headless')) {
    return (
      <g transform={`translate(${x} ${y})`} className="ghost-figure">
        <path className="ghost-body" d="M-22 40V-4q0-8 12-8h20q12 0 12 8V40l-7.3-8-7.4 8-7.3-8-7.3 8-7.4-8Z" />
        <path className="prop" d="M-7-12h14v-4h-14Z" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y})`} className="ghost-figure">
      <path className="ghost-body" d="M-22 40V-18a22 22 0 0 1 44 0V40l-7.3-8-7.4 8-7.3-8-7.3 8-7.4-8Z" />
      {!props.includes('asleep') && (
        <>
          <circle cx="-7" cy="-16" r="2.6" className="ghost-eye" />
          <circle cx="7" cy="-16" r="2.6" className="ghost-eye" />
        </>
      )}
      {/* Keyed on the prop, so an icon the show adds later pops in rather than snapping. */}
      {props
        .filter((p) => p !== 'none')
        .map((p) => (
          <g key={p} className="prop-pop">
            <PropMark prop={p} />
          </g>
        ))}
    </g>
  );
}

/** Sore positions (x, y, radius) for each basement ghost's look. */
const SORES: Record<string, [number, number, number][]> = {
  soresHeavy: [[-14, -7, 4.6], [13, -5, 5], [-9, 2, 3.6], [10, 7, 4], [-4, 13, 3.6], [5, 19, 4], [-6, -30, 3]],
  soresForehead: [[-8, -29, 4], [6, -31, 3], [0, -23, 2.6], [-6, 9, 3], [8, 13, 3.6]],
  soresCheeks: [[-13, -6, 4], [-8, 1, 3], [14, -8, 3.2], [3, -30, 3.6]],
  soresNeck: [[-8, 8, 4], [5, 10, 3], [10, 18, 3.6], [13, -6, 3.5]],
  soresMixed: [[-10, -28, 3], [12, -8, 4.6], [7, -1, 3], [-3, 14, 3.6]],
  soresLight: [[7, -29, 3.5], [-13, -7, 3.5], [12, -4, 3], [0, 10, 3]],
};

function PropMark({ prop }: { prop: Prop }) {
  switch (prop) {
    case 'beard':
      // A red moustache and a long beard with two braids, always worn.
      return (
        <g>
          <path className="prop-redhair" d="M-18-2C-8 5 8 5 18-2 21 14 8 27 0 31-8 27-21 14-18-2Z" />
          <path className="prop-redhair-line" d="M-5 27v12M5 27v12" />
          <circle className="prop-center" cx="-5" cy="34" r="2" />
          <circle className="prop-center" cx="5" cy="34" r="2" />
          <path className="prop-redhair" d="M-15-9Q-13-2 0-4 13-2 15-9 8-7 0-8-8-7-15-9Z" />
        </g>
      );
    case 'asleep':
      // Eyes shut, and a few z's floating up.
      return (
        <g>
          <path className="prop-shut" d="M-11-16Q-7-12-3-16M3-16Q7-12 11-16" />
          <text className="prop-zzz" x="14" y="-30">
            z
          </text>
          <text className="prop-zzz" x="22" y="-40" style={{ fontSize: 10 }}>
            z
          </text>
          <text className="prop-zzz" x="29" y="-48" style={{ fontSize: 8 }}>
            z
          </text>
        </g>
      );
    case 'neckSeam':
      // A stitched line around the neck: the mark of a head that has been put back on.
      return (
        <g>
          <path className="prop-wound" d="M-22-9Q0-4 22-9" />
          {[-15, -9, -3, 3, 9, 15].map((sx) => (
            <path key={sx} className="prop-wound prop-wound-thin" d={`M${sx} ${-8 + 3.5 * (1 - (sx / 22) ** 2) - 3}v6`} />
          ))}
        </g>
      );
    case 'feather':
      return <path className="prop prop-line" d="M18-36c10 6 10 22 2 30M18-36c-2 10 0 20 2 30" />;
    case 'notes':
      // Alberta's power: the living hear her hum.
      return (
        <g className="prop-note">
          <g transform="translate(-30 -16)">
            <ellipse cx="0" cy="0" rx="4" ry="3" transform="rotate(-20)" />
            <path d="M3.4-1V-14l6 3" />
          </g>
          <g transform="translate(-40 -36) scale(0.8)">
            <ellipse cx="0" cy="0" rx="4" ry="3" transform="rotate(-20)" />
            <path d="M3.4-1V-14l6 3" />
          </g>
        </g>
      );
    case 'flowers':
      // Flower's power: anyone who walks through her feels high. Flowers bloom all around her.
      return (
        <g>
          {(
            [
              [31, -34, '#ffd34d', 6.5],
              [-31, 10, '#ff8fb8', 7],
              [32, 14, '#a98bff', 7],
              [-27, 33, '#ffd34d', 6],
              [29, 35, '#ffa24d', 6],
            ] as const
          ).map(([fx, fy, color, r]) => (
            <g key={`${fx}${fy}`} transform={`translate(${fx} ${fy})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} className="prop-bloom" fill={color} cx={r * 0.62 * Math.sin((a * Math.PI) / 180)} cy={-r * 0.62 * Math.cos((a * Math.PI) / 180)} r={r * 0.52} />
              ))}
              <circle className="prop-center" r={r * 0.36} />
            </g>
          ))}
        </g>
      );
    case 'hippyglasses':
      // Round, tinted granny glasses.
      return (
        <g>
          <circle className="prop-lens" cx="-8" cy="-15.5" r="8" />
          <circle className="prop-lens" cx="8" cy="-15.5" r="8" />
          <path className="prop-lens-glint" d="M-12.5-19.5Q-10.5-21.5-8-21.5M3.5-19.5Q5.5-21.5 8-21.5" />
          <path className="prop-frame" d="M-0.3-17Q0-19 0.3-17M-16-16L-22-18M16-16L22-18" />
        </g>
      );
    case 'bleed':
      // Patience's power: walls bleed. Drips run down around her.
      return (
        <g className="prop-blood">
          <path d="M-30-14C-27-8-25-5-30-1-35-5-33-8-30-14Z" />
          <path d="M-31 6C-28 12-26 15-31 19-36 15-34 12-31 6Z" />
          <path d="M31-6C34 0 36 3 31 7 26 3 28 0 31-6Z" />
          <path d="M33 16C35 20 36 22 33 25 30 22 31 20 33 16Z" />
        </g>
      );
    case 'clover':
      // Hetty's power: the living can see her on St. Patrick's Day.
      return (
        <g className="prop-clover" transform="translate(30 -42)">
          <circle cx="-4" cy="-3" r="4.4" />
          <circle cx="4" cy="-3" r="4.4" />
          <circle cx="0" cy="-9" r="4.4" />
          <path className="prop-clover-stem" d="M0 0 3 8" />
        </g>
      );
    case 'suitcase':
      // Joan's power: she can leave the grounds and stay away.
      return (
        <g transform="translate(30 24)">
          <path className="prop-line" style={{ strokeWidth: 2.4 }} d="M-4-8v-3h8v3" />
          <rect className="prop-case" x="-10" y="-8" width="20" height="15" rx="2.5" />
          <path className="prop-case-strap" d="M-4-8v15M4-8v15" />
        </g>
      );
    case 'gas':
      // Isaac's power: a foul, greenish cloud that trails him.
      return (
        <g className="prop-gas">
          <circle cx="24" cy="24" r="8" />
          <circle cx="33" cy="17" r="5.5" />
          <circle cx="17" cy="16" r="5" />
          <circle cx="36" cy="28" r="4" />
          <circle cx="12" cy="29" r="3.4" />
        </g>
      );
    case 'lightning':
      // Thorfinn's power: electricity crackling around him.
      return (
        <g className="prop-bolt">
          <path transform="translate(-34 -14) rotate(-14)" d="M4-13-6 2h6l-5 13L9-2H3Z" />
          <path transform="translate(35 -26) rotate(16) scale(1.15)" d="M4-13-6 2h6l-5 13L9-2H3Z" />
          <path transform="translate(33 18) rotate(10) scale(0.85)" d="M4-13-6 2h6l-5 13L9-2H3Z" />
          <path transform="translate(-31 24) rotate(-8) scale(0.8)" d="M4-13-6 2h6l-5 13L9-2H3Z" />
        </g>
      );
    case 'dreamcloud':
      // Sasappis's power: a dream cloud over his head, with bubbles trailing down to him.
      return (
        <g>
          <circle className="prop-dream" cx="-4" cy="-74" r="9" />
          <circle className="prop-dream" cx="6" cy="-79" r="8" />
          <circle className="prop-dream" cx="15" cy="-72" r="7" />
          <rect className="prop-dream" x="-8" y="-72" width="28" height="9" rx="4.5" />
          <circle className="prop-dream" cx="-6" cy="-56" r="3.2" />
          <circle className="prop-dream" cx="-9" cy="-48" r="2" />
          <path className="prop-dream-star" d="M5-74l1.6 3.4 3.4 1.6-3.4 1.6L5-64l-1.6-3.4-3.4-1.6 3.4-1.6Z" />
        </g>
      );
    case 'coif':
      // A snug white Puritan cap, tied under the chin.
      return (
        <g>
          <path className="prop-coif" d="M-25-10C-28-52 28-52 25-10L17-14Q0-31-17-14Z" />
          <path className="prop-coif-tie" d="M-22-10Q-26 3-15 12M22-10Q26 3 15 12" />
        </g>
      );
    case 'soresHeavy':
    case 'soresForehead':
    case 'soresCheeks':
    case 'soresNeck':
    case 'soresMixed':
    case 'soresLight':
      // The basement ghosts: dark circles under the eyes and oozing sores, each in their own places.
      return (
        <g>
          <ellipse className="prop-eyebag" cx="-7" cy="-10.5" rx="4.6" ry="2" />
          <ellipse className="prop-eyebag" cx="7" cy="-10.5" rx="4.6" ry="2" />
          {SORES[prop].map(([sx, sy, r]) => (
            <g key={`${sx}${sy}`}>
              <circle className="prop-sore" cx={sx} cy={sy} r={r} />
              <circle className="prop-sore-pus" cx={sx - r * 0.25} cy={sy - r * 0.25} r={r * 0.38} />
            </g>
          ))}
        </g>
      );
    case 'sash':
      // An officer's sash across the chest, clipped to the ghost's body.
      return (
        <g clipPath="url(#sash-clip)">
          <clipPath id="sash-clip">
            <path d="M-22 40V-18a22 22 0 0 1 44 0V40l-7.3-8-7.4 8-7.3-8-7.3 8-7.4-8Z" />
          </clipPath>
          <g transform="translate(0 14) rotate(42)">
            <rect className="prop-red" x="-40" y="-6" width="80" height="12" />
            <rect className="prop-center" x="-40" y="-6" width="80" height="2" />
            <rect className="prop-center" x="-40" y="4" width="80" height="2" />
          </g>
        </g>
      );
    case 'updo':
      // A Gilded Age lady's hair swept up into a high bun, with a gold comb.
      return (
        <g>
          <path className="prop-hair" d="M-22-18A22 22 0 0 1 22-18Q0-31-22-18Z" />
          <circle className="prop-hair" cx="0" cy="-47" r="10" />
          <path className="prop-center" d="M-8-36h16l-2 5h-12Z" />
        </g>
      );
    case 'cord':
      // A telephone cord looped round the neck.
      return (
        <g>
          <path className="prop-cord" d="M-22-7Q0-1 22-7" />
          <path className="prop-cord" d="M16-4q4 6 0 10t-4 8q2 5-2 8" style={{ strokeWidth: 2.4 }} />
        </g>
      );
    case 'microphone':
      return (
        <g className="prop">
          <rect x="30" y="-14" width="9" height="14" rx="4.5" />
          <path className="prop-line" d="M34.5 0v40M26 40h17" />
        </g>
      );
    case 'daisy':
      return (
        <g className="prop" transform="translate(-16 -36)">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} rx="3.4" ry="7" transform={`rotate(${a}) translate(0 -6)`} />
          ))}
          <circle r="3.4" className="prop-center" />
        </g>
      );
    case 'arrow':
      return <path className="prop prop-line" d="M-36 2h72M30-4l6 6-6 6M-36-3l5 5-5 5" />;
    case 'capotain':
      return <path className="prop" d="M-28-30h56v-5H17l-4-24h-26l-4 24h-11Z" />;
    case 'tie':
      // A pink tie with blue patterns, outlined so it shows against the ghost.
      return (
        <g>
          <path className="prop-tie" d="M-5.5 2h11l-2.5 7 6 24-9 9-9-9 6-24Z" />
          {[[0, 14], [-3, 21], [3, 21], [0, 28], [-4.5, 33], [4.5, 33]].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} className="prop-tie-dot" cx={dx} cy={dy} r="1.9" />
          ))}
        </g>
      );
    case 'tophat':
      // A robber baron's top hat, with a gold band.
      return (
        <g>
          <rect className="prop-dark" x="-15" y="-60" width="30" height="27" rx="2" />
          <rect className="prop-center" x="-15" y="-40" width="30" height="5" />
          <rect className="prop-dark" x="-25" y="-35" width="50" height="5" rx="2.5" />
        </g>
      );
    case 'phone':
      // An early brick cell phone, held out to the side.
      return (
        <g transform="translate(28 -2) rotate(10)">
          <path className="prop-line" d="M-3-14V-28" />
          <rect className="prop-dark" x="-7" y="-14" width="14" height="36" rx="3" />
          <rect className="prop-center" x="-4" y="-10" width="8" height="5" />
          {[0, 1, 2].map((r) => [0, 1].map((c) => <circle key={`${r}${c}`} className="prop" cx={-2 + c * 4} cy={r * 4.5 + 2} r="1.1" />))}
        </g>
      );
    case 'fife':
      // Held out to the side, like a flute.
      return (
        <g transform="translate(14 -2) rotate(-24)">
          <rect className="prop" x="0" y="-3" width="36" height="6" rx="3" />
          {[10, 18, 26].map((fx) => (
            <circle key={fx} className="ghost-eye" cx={fx} cy="0" r="1.5" />
          ))}
        </g>
      );
    case 'musket':
      return (
        <g transform="translate(0 6) rotate(-40)">
          <rect className="prop" x="-8" y="-1.8" width="54" height="3.6" rx="1.8" />
          <path className="prop-wood" d="M-40-4C-30-5-16-4-8-2.4v4.8C-18 4-30 8-40 6Z" />
        </g>
      );
    case 'horns':
      return (
        <g className="prop">
          <path d="M-23-24a23 20 0 0 1 46 0ZM-2-24h4v14h-4Z" />
          <path d="M-21-30C-31-32-35-43-33-54-26-47-22-41-17-36ZM21-30C31-32 35-43 33-54 26-47 22-41 17-36Z" />
        </g>
      );
    case 'tiara':
      return (
        <g>
          <path className="prop prop-line" d="M-19-32Q0-58 19-32" />
          <circle className="prop" cx="-10" cy="-42.5" r="3.2" />
          <circle className="prop" cx="10" cy="-42.5" r="3.2" />
          <circle className="prop-center" cx="0" cy="-48" r="4.4" />
        </g>
      );
    case 'corsage':
      // A prom corsage: pink flowers with a ribbon, pinned to the chest.
      return (
        <g transform="translate(-9 6)">
          <path className="prop" d="M0 6-7 19 0 15 7 19Z" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} className="prop-pink" cx={5.2 * Math.sin((a * Math.PI) / 180)} cy={-5.2 * Math.cos((a * Math.PI) / 180)} r="4.2" />
          ))}
          <circle className="prop-center" r="3" />
        </g>
      );
    case 'purse':
      // A handbag, hanging from one side.
      return (
        <g>
          <path className="prop-line" d="M17 16Q27-2 37 16" />
          <rect className="prop-purse" x="11" y="15" width="32" height="22" rx="4.5" />
          <circle className="prop-center" cx="27" cy="22" r="2.6" />
        </g>
      );
    case 'partyhat':
      return (
        <g>
          <path className="prop" d="M-15-34 0-62 15-34Z" />
          <circle className="prop-center" cx="0" cy="-63" r="4" />
          <circle className="prop-center" cx="-4" cy="-44" r="2" />
          <circle className="prop-center" cx="4" cy="-50" r="2" />
        </g>
      );
    case 'wheel':
      return (
        <g>
          <circle className="prop-line" cx="0" cy="14" r="13" />
          <path className="prop-line" d="M-13 14h26M0 14v13" />
          <circle className="prop-center" cx="0" cy="14" r="3.5" />
        </g>
      );
    case 'pencil':
      // Tucked behind the ear.
      return (
        <g transform="translate(17 -30) rotate(28)">
          <rect className="prop-center" x="-3" y="-20" width="6" height="5" rx="1" />
          <rect className="prop" x="-3" y="-15" width="6" height="22" />
          <path className="prop" d="M-3 7h6l-3 8Z" />
        </g>
      );
    default:
      return null;
  }
}
