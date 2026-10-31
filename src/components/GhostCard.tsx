import type { Episode, Ghost } from '../data/types';
import { factsAt, statusAt, yearsAsGhost } from '../lib/spoilers';

const fmt = new Intl.NumberFormat('en-US');

/** Everything known about one ghost as of this episode, and nothing after it. */
export function GhostCard({ ghost, ep }: { ghost: Ghost; ep: Episode }) {
  const status = statusAt(ghost, ep.id);
  const facts = factsAt(ghost, ep.id);
  const years = yearsAsGhost(ghost, ep.airDate);
  return (
    <div className="ghost-card">
      <h4>{ghost.name}</h4>
      <p className="ghost-card-era">
        {ghost.era}.{' '}
        {ghost.died === undefined ? 'The show hasn’t said when they died.' : `Died ${ghost.approx === 'both' ? 'around ' : ''}${ghost.died}.`}
      </p>
      {years !== undefined && (
        <p className="ghost-card-years">
          {ghost.approx === 'both' ? 'About ' : ''}
          <strong>{fmt.format(years)}</strong> {years === 1 ? 'year' : 'years'} a ghost
        </p>
      )}
      {facts.length > 0 && (
        <ul>
          {facts.map((f) => (
            <li key={f.text}>{f.text}</li>
          ))}
        </ul>
      )}
      {status && status.ep !== ghost.timeline[0].ep && <p className="ghost-card-status">{status.note}</p>}
    </div>
  );
}
