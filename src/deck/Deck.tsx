import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { SideNav } from './SideNav';
import { MansionBackdrop } from '../scene/MansionBackdrop';

export interface SlideDef {
  id: string;
  title: string;
  /** Backdrop floor: 0 = roof, 1-6 = seasons, 7 = grounds. */
  floor: number;
  content: ReactNode;
}

const SITE = 'Woodstone After Dark';

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function Deck({ slides }: { slides: SlideDef[] }) {
  const deckRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const i = Math.max(0, Math.min(slides.length - 1, index));
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(slides[i].id)?.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'start' });
    },
    [slides],
  );

  // Deep links: land on the hashed slide without animating, on load and on in-page links.
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0 && i !== activeRef.current) goTo(i, 'auto');
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

  useEffect(() => {
    const slide = slides[active];
    history.replaceState(null, '', `#${slide.id}`);
    document.title = `${slide.title} · ${SITE}`;
  }, [active, slides]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      const i = activeRef.current;
      const next = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
      const prev = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (next) goTo(i + 1);
      else if (prev) goTo(i - 1);
      else if (e.key === 'Home') goTo(0);
      else if (e.key === 'End') goTo(slides.length - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, slides.length]);

  const floor = slides[active].floor;

  return (
    <>
      <MansionBackdrop floor={floor} />
      <main ref={deckRef} className="deck" tabIndex={-1}>
        {slides.map((s, i) => (
          <section key={s.id} id={s.id} className="slide" aria-label={s.title} data-active={i === active || undefined}>
            {s.content}
          </section>
        ))}
      </main>
      <SideNav
        index={active}
        total={slides.length}
        floor={floor}
        onHome={() => goTo(0)}
        onPrev={() => goTo(active - 1)}
        onNext={() => goTo(active + 1)}
      />
    </>
  );
}
