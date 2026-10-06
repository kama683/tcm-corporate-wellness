import { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from './motion';

export type DeckState = {
  /** true — включён покадровый режим (один экран = одна секция). */
  inDeck: boolean;
  index: number;
  count: number;
  goTo: (index: number) => void;
};

export const DeckContext = createContext<DeckState | null>(null);

export function useDeck(): DeckState | null {
  return useContext(DeckContext);
}

/**
 * Покадровый режим включается только на экранах шире 768 px и когда
 * пользователь не просил уменьшить анимацию. Иначе — обычная прокрутка
 * с лёгким scroll-snap.
 */
export function useDeckEnabled(): boolean {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return wide && !reduced;
}
