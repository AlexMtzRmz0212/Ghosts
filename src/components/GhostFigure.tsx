import type { Prop } from '../data/types';

/** A drawn ghost, centred on (0,0), about 90 units tall. Props are the show's visual shorthand. */
export function GhostFigure({ prop, x, y }: { prop: Prop; x: number; y: number }) {
  if (prop === 'headless') {
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
      <circle cx="-7" cy="-16" r="2.6" className="ghost-eye" />
      <circle cx="7" cy="-16" r="2.6" className="ghost-eye" />
      <PropMark prop={prop} />
    </g>
  );
}

function PropMark({ prop }: { prop: Prop }) {
  switch (prop) {
    case 'helmet':
      return <path className="prop" d="M-23-24a23 20 0 0 1 46 0ZM-2-24h4v14h-4Z" />;
    case 'feather':
      return <path className="prop prop-line" d="M18-36c10 6 10 22 2 30M18-36c-2 10 0 20 2 30" />;
    case 'tricorn':
      return <path className="prop" d="M-30-30 0-48l30 18-8 4H-22Z" />;
    case 'collar':
      return <path className="prop" d="M-16 2l6-8 5 7 5-7 5 7 5-7 6 8-16 6Z" />;
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
      return <path className="prop" d="M-3 4h6l-1 4 4 20-6 6-6-6 4-20Z" />;
    default:
      return null;
  }
}
