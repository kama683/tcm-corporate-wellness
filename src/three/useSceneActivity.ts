import { useEffect, useRef, useState } from 'react';
import { quality } from './config';
import { useReducedMotion } from '../lib/motion';

let webglSupported: boolean | null = null;

/** Проверяем один раз: если WebGL нет, показываем постер и не падаем. */
export function hasWebGL(): boolean {
  if (webglSupported !== null) return webglSupported;
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const ctx =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    webglSupported = Boolean(ctx);
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

export type SceneActivity = {
  /** Показывать живую сцену (иначе — постер). */
  live: boolean;
  /** Сцена попала в видимую зону: только тогда монтируем Canvas. */
  visible: boolean;
  /** Режим рендера для Canvas. */
  frameloop: 'always' | 'never';
  ref: React.RefObject<HTMLDivElement>;
};

/**
 * Решает, показывать ли живую сцену и когда её рендерить.
 *
 * Постер вместо сцены: узкий экран, prefers-reduced-motion или нет WebGL.
 * Рендер останавливается, когда блок ушёл с экрана или вкладка скрыта, —
 * иначе 3D продолжает греть процессор впустую.
 */
export function useSceneActivity({
  /** Ниже этой ширины живую сцену не показываем. */
  minWidth = quality.liveSceneMinWidth,
  /** Hero на мобильных может остаться живым, но облегчённым. */
  allowNarrow = false,
}: { minWidth?: number; allowNarrow?: boolean } = {}): SceneActivity {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const [wide, setWide] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
  });
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [minWidth]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '150px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const live = hasWebGL() && !reduced && (wide || allowNarrow);

  return {
    live,
    visible,
    frameloop: visible && tabVisible ? 'always' : 'never',
    ref,
  };
}
