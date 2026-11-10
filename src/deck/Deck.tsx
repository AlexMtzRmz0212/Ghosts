import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { SideNav } from './SideNav';
import { BridgeContext, type Bridge, type StageApi, type StageInfo } from './bridge';
import { MansionBackdrop } from '../scene/MansionBackdrop';
import { useI18n } from '../i18n';

export interface SlideDef {
  id: string;
  title: string;
  /** Backdrop floor: 0 = roof, 1-6 = seasons, 7 = grounds. */
  floor: number;
  content: ReactNode;
  /**
   * Set for the slide that stays on screen while it plays. It is this many screens taller than
   * the viewport, and reports its own floor, label and title through the bridge.
   */
  tall?: number;
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function Deck({ slides }: { slides: SlideDef[] }) {
  const { ui } = useI18n();
  const deckRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  const [stage, setStage] = useState<StageInfo | null>(null);
  const stageApi = useRef<StageApi | null>(null);
  const bridge = useMemo<Bridge>(() => ({ report: setStage, register: (api) => void (stageApi.current = api) }), []);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const i = Math.max(0, Math.min(slides.length - 1, index));
      // Coming back up into the stage from the slide after it lands on its last episode.
      if (slides[i].tall && i < activeRef.current && stageApi.current) {
        stageApi.current.enterFromEnd(behavior);
        return;
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(slides[i].id)?.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'start' });
    },
    [slides],
  );

  /** One step forward or back: an episode while on the stage, otherwise a slide. */
  const advance = useCallback(
    (dir: 1 | -1) => {
      const i = activeRef.current;
      if (slides[i].tall && stageApi.current?.step(dir)) return;
      goTo(i + dir);
    },
    [slides, goTo],
  );

  // Deep links: land on the hashed slide or episode without animating, on load and on in-page links.
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) {
        if (i !== activeRef.current) goTo(i, 'auto');
        return;
      }
      stageApi.current?.goTo(id, 'auto');
    };
    jump();
    window.addEventListener('hashchange', jump);
    return () => window.removeEventListener('hashchange', jump);
  }, [slides, goTo]);

  // The active slide is the last one whose top has passed 40% of the viewport. Works for
  // slides taller than the screen, which an intersection ratio can't handle.
  useEffect(() => {
    const root = deckRef.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = root.scrollTop + root.clientHeight * 0.4;
      const sections = root.querySelectorAll<HTMLElement>(':scope > section');
      let i = 0;
      while (i + 1 < sections.length && sections[i + 1].offsetTop <= line) i++;
      setActive(i);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      root.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [slides]);

  const slide = slides[active];
  const inStage = Boolean(slide.tall && stage);

  useEffect(() => {
    history.replaceState(null, '', `#${inStage ? stage!.id : slide.id}`);
    document.title = `${inStage ? stage!.title : slide.title} · ${ui('Woodstone After Dark')}`;
  }, [slide, inStage, stage, ui]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      const next = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
      const prev = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (next) advance(1);
      else if (prev) advance(-1);
      else if (e.key === 'Home') goTo(0);
      else if (e.key === 'End') goTo(slides.length - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, goTo, slides.length]);

  const floor = inStage ? stage!.floor : slide.floor;

  return (
    <BridgeContext.Provider value={bridge}>
      <MansionBackdrop floor={floor} />
      <main ref={deckRef} className="deck" tabIndex={-1}>
        {slides.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={s.tall ? 'slide slide-tall' : 'slide'}
            style={s.tall ? { height: `calc(${100 + s.tall * 100}dvh)` } : undefined}
            aria-label={s.title}
            data-active={i === active || undefined}
          >
            {s.content}
          </section>
        ))}
      </main>
      <SideNav
        label={inStage ? stage!.label : `${active + 1}/${slides.length}`}
        floor={floor}
        episodes={inStage}
        canPrev={active > 0}
        canNext={active < slides.length - 1}
        onHome={() => goTo(0)}
        onPrev={() => advance(-1)}
        onNext={() => advance(1)}
      />
    </BridgeContext.Provider>
  );
}
