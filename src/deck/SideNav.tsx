export const FLOOR_NAMES = [
  'The roof',
  'The attic',
  'The upstairs bedrooms',
  'The library',
  'The living room',
  'The kitchen',
  'The basement',
  'The grounds',
];

interface Props {
  index: number;
  total: number;
  floor: number;
  onHome: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** Nav pill with a cut-away of the house; the lit storey is where you are. */
export function SideNav({ index, total, floor, onHome, onPrev, onNext }: Props) {
  const storeyH = 9;
  return (
    <nav className="sidenav" aria-label="Slides">
      <button type="button" onClick={onHome} aria-label="Back to the first slide" title="Back to the roof">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5M6 10v10h12V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </button>

      <svg className="sidenav-house" viewBox="0 0 30 90" role="img" aria-label={`You are in ${FLOOR_NAMES[floor].toLowerCase()}`}>
        <title>{FLOOR_NAMES[floor]}</title>
        <path d="M2 14 15 2l13 12" className="roofline" />
        {FLOOR_NAMES.map((_, f) => {
          if (f === 0) return null;
          const y = 14 + (f - 1) * storeyH + (f === 7 ? 4 : 0);
          return (
            <rect
              key={f}
              x={f === 7 ? 0 : 4}
              y={y}
              width={f === 7 ? 30 : 22}
              height={storeyH - 2}
              rx="1"
              className={f === floor ? 'storey lit' : 'storey'}
            />
          );
        })}
        {floor === 0 && <circle cx="15" cy="9" r="2.6" className="storey-ghost" />}
      </svg>

      <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Previous slide" title="Up (Shift+Space)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" onClick={onNext} disabled={index === total - 1} aria-label="Next slide" title="Down (Space)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="sidenav-count" aria-live="polite">
        {index + 1}/{total}
      </span>
    </nav>
  );
}
