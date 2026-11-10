import { EPISODES } from '../data/episodes';
import { useI18n } from '../i18n';

export function TitleSlide() {
  const { lang } = useI18n();
  if (lang === 'es') {
    return (
      <div className="slide-inner title-slide">
        <h1>
          ¿Quién ronda
          <br />
          Woodstone?
        </h1>
        <p className="lede">
          Cada episodio de <cite>Ghosts</cite> en CBS, uno a uno, y cuánto tiempo lleva muerto cada fantasma para entonces.
        </p>
        <p className="hint">
          Pulsa <kbd>Espacio</kbd> para bajar al piso de abajo
        </p>
      </div>
    );
  }
  return (
    <div className="slide-inner title-slide">
      <h1>
        Who&rsquo;s haunting
        <br />
        Woodstone?
      </h1>
      <p className="lede">
        Every episode of <cite>Ghosts</cite> on CBS, one at a time, and how long each ghost has been dead by then.
      </p>
      <p className="hint">
        Press <kbd>Space</kbd> to go downstairs
      </p>
    </div>
  );
}

export function HowToReadSlide() {
  const { lang, ui } = useI18n();
  const seasons = new Set(EPISODES.map((e) => e.season)).size;
  if (lang === 'es') {
    return (
      <div className="slide-inner how-slide">
        <h2>{ui('Before you go in')}</h2>
        <ol className="how-list">
          <li>
            <strong>Cada piso es una temporada.</strong> El desván es la temporada 1. En la temporada {seasons} estás en el sótano.
          </li>
          <li>
            <strong>Una sola tele, todos los episodios.</strong> Sigue bajando y la tele cambia de episodio: los fantasmas llegan y se
            van, y la cronología crece. Haz clic en un fantasma para ver quién es y pasa el cursor por encima para ver su nombre.
          </li>
          <li>
            <strong>Nada de episodios posteriores se filtra hacia arriba.</strong> La tele solo sabe lo que la serie te había
            contado hasta ese episodio. Deja de bajar donde dejaste de ver la serie.
          </li>
          <li>
            <strong>La cronología cuenta los años como fantasma</strong> desde cada muerte hasta la noche en que se emitió el episodio.
            Usa la barra bajo la tele para saltar a cualquier episodio.
          </li>
        </ol>
      </div>
    );
  }
  return (
    <div className="slide-inner how-slide">
      <h2>Before you go in</h2>
      <ol className="how-list">
        <li>
          <strong>Each floor is a season.</strong> The attic is season 1. By season {seasons} you&rsquo;re in the basement.
        </li>
        <li>
          <strong>One TV, every episode.</strong> Keep scrolling and the TV changes episode: ghosts arrive and leave, and the timeline
          grows. Click a ghost to see who they are, and hover over one to see their name.
        </li>
        <li>
          <strong>Nothing from later episodes leaks up.</strong> The TV only knows what the show had told you by that episode. Stop
          scrolling where you stopped watching.
        </li>
        <li>
          <strong>The timeline counts ghost years</strong> from each death to the night the episode aired. Use the bar under the TV to
          jump to any episode.
        </li>
      </ol>
    </div>
  );
}

export function CreditsSlide() {
  const { lang } = useI18n();
  if (lang === 'es') {
    return (
      <div className="slide-inner credits-slide">
        <h2>Has llegado a los jardines</h2>
        <p className="lede">Esos son todos los episodios emitidos hasta ahora. Cuidado con el pozo al salir.</p>
        <p>
          Un proyecto de fans no oficial. <cite>Ghosts</cite> pertenece a CBS Studios y está basada en la serie de la BBC de Mathew
          Baynton, Simon Farnaby, Martha Howe-Douglas, Jim Howick, Laurence Rickard y Ben Willbond.
        </p>
        <p>
          ¿Encontraste una fecha incorrecta o un spoiler en el lugar equivocado? Contáctame en{' '}
          <a href="https://alex.bittobyte.qzz.io">mi portafolio</a>.
        </p>
      </div>
    );
  }
  return (
    <div className="slide-inner credits-slide">
      <h2>You&rsquo;ve reached the grounds</h2>
      <p className="lede">That&rsquo;s every episode aired so far. Mind the well on your way out.</p>
      <p>
        An unofficial fan project. <cite>Ghosts</cite> belongs to CBS Studios, and is based on the BBC series by Mathew Baynton, Simon
        Farnaby, Martha Howe-Douglas, Jim Howick, Laurence Rickard and Ben Willbond.
      </p>
      <p>
        Found a wrong date or a spoiler in the wrong place? Contact me through <a href="https://alex.bittobyte.qzz.io">my portfolio</a>.
      </p>
    </div>
  );
}
