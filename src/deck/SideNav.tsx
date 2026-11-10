import { useI18n } from '../i18n';

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
  /** Counter text: a slide count, or an episode such as S2E5. */
  label: string;
  floor: number;
  /** True while the arrows move by episode rather than by slide. */
  episodes: boolean;
  canPrev: boolean;
  canNext: boolean;
  onHome: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** Nav pill with a cut-away of the house; the lit storey is where you are. */
export function SideNav({ label, floor, episodes, canPrev, canNext, onHome, onPrev, onNext }: Props) {
  const { lang, setLang, ui } = useI18n();
  const floorName = ui(FLOOR_NAMES[floor] as Parameters<typeof ui>[0]);
  const storeyH = 9;
  return (
    <nav className="sidenav" aria-label={ui('Slides')}>
      <button
        type="button"
        className="lang-toggle"
        onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
        aria-label={ui(lang === 'es' ? 'Switch language to English' : 'Switch language to Spanish')}
        title={ui(lang === 'es' ? 'Switch language to English' : 'Switch language to Spanish')}
      >
        {lang === 'es' ? 'EN' : 'ES'}
      </button>
      <button type="button" onClick={onHome} aria-label={ui('Back to the first slide')} title={ui('Back to the roof')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5M6 10v10h12V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </button>

      <svg className="sidenav-house" viewBox="0 0 30 90" role="img" aria-label={`${lang === 'es' ? 'Estás en' : 'You are in'} ${floorName.toLowerCase()}`}>
        <title>{floorName}</title>
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

      <button type="button" onClick={onPrev} disabled={!canPrev} aria-label={ui(episodes ? 'Previous episode' : 'Previous slide')} title={ui('Up (Shift+Space)')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label={ui(episodes ? 'Next episode' : 'Next slide')} title={ui('Down (Space)')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="sidenav-count" aria-live="polite">
        {label}
      </span>
    </nav>
  );
}
