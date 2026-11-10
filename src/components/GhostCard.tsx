import type { Episode, Ghost } from '../data/types';
import { factsAt, statusAt, yearsAsGhost } from '../lib/spoilers';
import { useI18n } from '../i18n';

/** Everything known about one ghost as of this episode, and nothing after it. */
export function GhostCard({ ghost, ep }: { ghost: Ghost; ep: Episode }) {
  const { lang, ui, tx, locale } = useI18n();
  const es = lang === 'es';
  const fmt = new Intl.NumberFormat(locale);
  const approx = ghost.approx === 'both';
  const status = statusAt(ghost, ep.id);
  const facts = factsAt(ghost, ep.id);
  const years = yearsAsGhost(ghost, ep.airDate);
  return (
    <div className="ghost-card">
      <h4>{ghost.name}</h4>
      <p className="ghost-card-era">
        {tx(ghost.era)}.{' '}
        {ghost.died === undefined
          ? ui('The show hasn’t said when they died.')
          : es
            ? `Murió ${approx ? 'hacia' : 'en'} ${ghost.died}.`
            : `Died ${approx ? 'around ' : ''}${ghost.died}.`}
      </p>
      {years !== undefined && (
        <p className="ghost-card-years">
          {approx ? (es ? 'Unos ' : 'About ') : ''}
          <strong>{fmt.format(years)}</strong> {ui(years === 1 ? 'year' : 'years')} {ui('a ghost')}
        </p>
      )}
      {facts.length > 0 && (
        <ul>
          {facts.map((f) => (
            <li key={f.text}>{tx(f.text)}</li>
          ))}
        </ul>
      )}
      {status && status.ep !== ghost.timeline[0].ep && <p className="ghost-card-status">{tx(status.note)}</p>}
    </div>
  );
}
