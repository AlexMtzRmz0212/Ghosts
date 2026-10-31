import { useMemo } from 'react';
import { Deck, type SlideDef } from './deck/Deck';
import { SEASONS, episodesInSeason } from './data/episodes';
import { CreditsSlide, HowToReadSlide, IntroSlide, SeasonSlide, TimelineSlide, TitleSlide } from './slides/Slides';

function buildSlides(): SlideDef[] {
  const slides: SlideDef[] = [
    { id: 'title', title: 'Woodstone', floor: 0, content: <TitleSlide /> },
    { id: 'how-to-read', title: 'Before you go in', floor: 0, content: <HowToReadSlide /> },
  ];
  for (const season of SEASONS) {
    const floor = season.number;
    slides.push({ id: `season-${floor}`, title: `Season ${floor}`, floor, content: <SeasonSlide season={season} /> });
    for (const ep of episodesInSeason(floor)) {
      slides.push({ id: ep.id, title: `S${ep.season}E${ep.number} ${ep.title}`, floor, content: <IntroSlide ep={ep} /> });
    }
    slides.push({
      id: `season-${floor}-timeline`,
      title: `Season ${floor} timeline`,
      floor,
      content: <TimelineSlide season={season} />,
    });
  }
  slides.push({ id: 'credits', title: 'The grounds', floor: 7, content: <CreditsSlide /> });
  return slides;
}

export function App() {
  const slides = useMemo(buildSlides, []);
  return <Deck slides={slides} />;
}
