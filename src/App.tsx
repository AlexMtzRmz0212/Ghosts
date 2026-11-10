import { useMemo } from 'react';
import { Deck, type SlideDef } from './deck/Deck';
import { useI18n, type I18n } from './i18n';
import { CreditsSlide, HowToReadSlide, TitleSlide } from './slides/Slides';
import { Stage, STAGE_SCREENS } from './stage/Stage';

function buildSlides({ ui }: Pick<I18n, 'ui'>): SlideDef[] {
  return [
    { id: 'title', title: ui('Woodstone'), floor: 0, content: <TitleSlide /> },
    { id: 'how-to-read', title: ui('Before you go in'), floor: 0, content: <HowToReadSlide /> },
    // Every episode plays on one TV. It reports its own floor, label and title as the reader scrolls.
    { id: 'episodes', title: ui('Woodstone'), floor: 1, tall: STAGE_SCREENS, content: <Stage /> },
    { id: 'credits', title: ui('The grounds'), floor: 7, content: <CreditsSlide /> },
  ];
}

export function App() {
  const { ui } = useI18n();
  const slides = useMemo(() => buildSlides({ ui }), [ui]);
  return <Deck slides={slides} />;
}
