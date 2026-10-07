import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ru } from './ru';
import { kk } from './kk';
import type { Dict } from './types';

export type Language = 'ru' | 'kk';

const DICTS: Record<Language, Dict> = { ru, kk };
const STORAGE_KEY = 'tcm-lang';

function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'ru' || v === 'kk' ? v : null;
  } catch {
    // localStorage недоступен (приватный режим и т.п.) — не страшно
    return null;
  }
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Единственный источник языка на сайте. Запоминает выбор в localStorage. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => readStoredLanguage() ?? 'ru',
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // некритично: выбор просто не переживёт перезагрузку
    }
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage должен вызываться внутри LanguageProvider');
  }
  return ctx;
}

/** Словарь текущего языка. Переключение языка — обычный React re-render. */
export function useT(): Dict {
  return DICTS[useLanguage().language];
}
