import type { Episode, Season } from '../data/types';
import { EPISODE_NOTES, EPISODES, episodesInSeason, lastEpisodeOf } from '../data/episodes';
import { changesIn, type ChangeKind } from '../lib/spoilers';
import { IntroFrame } from '../components/IntroFrame';
import { Timeline } from '../components/Timeline';

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const airedOn = (ep: Episode) => dateFmt.format(new Date(ep.airDate + 'T12:00:00Z'));

export function TitleSlide() {
  return (
    <div className="slide-inner title-slide">
      <h1>
        Who&rsquo;s haunting
        <br />
        Woodstone?
      </h1>
      <p className="lede">
        Every intro of <cite>Ghosts</cite> on CBS, one episode at a time, and how long each ghost has been dead by then.
      </p>
      <p className="hint">
        Press <kbd>Space</kbd> to go downstairs
      </p>
    </div>
  );
}

export function HowToReadSlide() {
  const seasons = new Set(EPISODES.map((e) => e.season)).size;
  return (
    <div className="slide-inner how-slide">
      <h2>Before you go in</h2>
      <ol className="how-list">
        <li>
          <strong>Each floor is a season.</strong> The attic is season 1. By season {seasons} you&rsquo;re in the basement.
        </li>
        <li>
          <strong>Each room is one episode&rsquo;s intro.</strong> The glowing spots are cold spots: tap one to see who or what is there.
        </li>
        <li>
          <strong>Nothing from later episodes leaks up.</strong> A slide only knows what the show had told you by that episode. Stop
          scrolling where you stopped watching.
        </li>
        <li>
          <strong>The timeline counts ghost years</strong> from each death to the night the episode aired.
        </li>
      </ol>
    </div>
  );
}

export function SeasonSlide({ season }: { season: Season }) {
  const eps = episodesInSeason(season.number);
  const first = eps[0];
  const last = eps.at(-1)!;
  return (
    <div className="slide-inner season-slide">
      <p className="season-floor">{season.floor}</p>
      <h2>Season {season.number}</h2>
      <p className="lede">{season.floorNote}</p>
      <p className="season-meta">
        {eps.length} {eps.length === 1 ? 'episode' : 'episodes'}, {airedOn(first)} to {airedOn(last)}
      </p>
      <p className="spoiler-line">Spoilers for season {season.number} start on the next slide.</p>
    </div>
  );
}

const KIND_LABEL: Record<ChangeKind, string> = {
  appears: 'Arrives',
  returns: 'Back',
  leaves: 'Leaves',
  'crosses-over': 'Sucked off',
  learned: 'We learn',
};

export function IntroSlide({ ep }: { ep: Episode }) {
  const changes = changesIn(ep);
  const note = EPISODE_NOTES[ep.id];
  return (
    <div className="slide-inner intro-slide">
      <header className="intro-head">
        <p className="ep-code">
          Season {ep.season}, episode {ep.number}
        </p>
        <h2>{ep.title}</h2>
        <p className="ep-date">
          Aired {airedOn(ep)}
          {ep.approxDate ? ' (same night as the episode before)' : ''}
        </p>
      </header>

      <IntroFrame ep={ep} />

      <aside className="intro-side">
        <h3>What changed in the house</h3>
        {note || changes.length > 0 ? (
          <ul className="changes">
            {note && <li className="change change-house">{note}</li>}
            {changes.map((c, i) => (
              <li key={i} className={`change change-${c.kind}`}>
                <span className="change-kind">{KIND_LABEL[c.kind]}</span> <strong>{c.ghost.name}.</strong> {c.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="quiet">Same ghosts as last week. Nobody new, nobody gone.</p>
        )}
        <h3>Years a ghost, as of tonight</h3>
        <Timeline ep={ep} compact />
        <p className="footnote">Each line is a century. Where they bunch up, the years are squeezed.</p>
      </aside>
    </div>
  );
}

export function TimelineSlide({ season }: { season: Season }) {
  const ep = lastEpisodeOf(season.number);
  return (
    <div className="slide-inner timeline-slide">
      <h2>End of season {season.number}: who&rsquo;s been dead how long</h2>
      <p className="lede">
        Measured to the night of &ldquo;{ep.title},&rdquo; {airedOn(ep)}. Pale bars are lifetimes; glowing bars are years spent haunting.
      </p>
      <div className="timeline-wrap">
        <Timeline ep={ep} />
      </div>
      <p className="footnote">
        Each line is a century. Where they bunch up, the years are squeezed. c. marks a year the show doesn&rsquo;t pin down, and ~ a
        ghost count built on an estimated death year.
      </p>
    </div>
  );
}

export function CreditsSlide() {
  return (
    <div className="slide-inner credits-slide">
      <h2>You&rsquo;ve reached the grounds</h2>
      <p className="lede">That&rsquo;s every episode aired so far. Mind the well on your way out.</p>
      <p>
        An unofficial fan project. <cite>Ghosts</cite> belongs to CBS Studios, and is based on the BBC series by Mathew Baynton, Simon
        Farnaby, Martha Howe-Douglas, Jim Howick, Laurence Rickard and Ben Willbond.
      </p>
      <p>
        Episode titles and air dates:{' '}
        <a href="https://en.wikipedia.org/wiki/List_of_Ghosts_(American_TV_series)_episodes">Wikipedia&rsquo;s episode list</a>. Found a
        wrong date or a spoiler in the wrong place? It lives in <code>src/data/</code>.
      </p>
    </div>
  );
}
