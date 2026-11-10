import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ES_DATA } from './es-data';
import { ES_UI, type UiKey } from './es-ui';

export type Lang = 'en' | 'es';

const STORAGE_KEY = 'woodstone-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    /* storage blocked */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export interface I18n {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** UI string: English is the key's own text, Spanish comes from es-ui.ts. */
  ui: (en: UiKey) => string;
  /** Data string (ghost facts, notes, episode titles...): looked up by its English text. */
  tx: (en: string) => string;
  locale: string;
}

const Ctx = createContext<I18n>({ lang: 'en', setLang: () => {}, ui: (s) => s, tx: (s) => s, locale: 'en-US' });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      ui: (en) => (lang === 'es' ? ES_UI[en] ?? en : en),
      tx: (en) => (lang === 'es' ? ES_DATA[en] ?? en : en),
      locale: lang === 'es' ? 'es-ES' : 'en-US',
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
