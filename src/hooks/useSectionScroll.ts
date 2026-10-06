import { useCallback, useEffect, useRef, useState } from 'react';

/** Длительность перехода: на это время управление блокируется. */
const LOCK_MS = 900;
/** Пауза между событиями колеса, после которой жест считается новым. */
const GESTURE_GAP_MS = 180;
/** Сколько «пикселей» колеса нужно набрать для перехода. */
const WHEEL_THRESHOLD = 40;
/** Минимальный свайп. */
const SWIPE_PX = 56;
const SWIPE_MAX_MS = 900;

function normalizeWheel(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 16; // строки
  if (e.deltaMode === 2) return e.deltaY * 100; // страницы
  return e.deltaY;
}

/** Есть ли внутри секции куда прокручивать в этом направлении. */
function canScrollInner(el: HTMLElement | null, dir: number): boolean {
  if (!el) return false;
  if (el.scrollHeight - el.clientHeight < 4) return false;
  return dir > 0
    ? el.scrollTop + el.clientHeight < el.scrollHeight - 2
    : el.scrollTop > 2;
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.closest) return false;
  return Boolean(
    el.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

type Options = {
  count: number;
  enabled: boolean;
  /** Начальная секция (из адресной строки). */
  initialIndex?: number;
  /** id секции по индексу — для адресной строки. */
  idForIndex: (index: number) => string;
  /** Индекс секции по id — для якорных ссылок. */
  indexForId: (id: string) => number;
};

export type SectionScroll = {
  index: number;
  direction: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** Активная секция сообщает сюда свой внутренний скроллер. */
  registerScroller: (el: HTMLElement | null) => void;
};

/**
 * Покадровая навигация без внешних fullpage-библиотек.
 *
 * Колесо, тачпад, клавиатура и свайпы переключают секции целиком.
 * Пока внутри секции есть что прокручивать — жест уходит во внутреннюю
 * прокрутку, и только на краю происходит переход к соседней секции.
 */
export function useSectionScroll({
  count,
  enabled,
  initialIndex = 0,
  idForIndex,
  indexForId,
}: Options): SectionScroll {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);

  const indexRef = useRef(initialIndex);
  const lockRef = useRef(false);
  const lockTimerRef = useRef<number | undefined>(undefined);
  const scrollerRef = useRef<HTMLElement | null>(null);

  // Состояние жеста колеса/тачпада
  const accRef = useRef(0);
  const lastWheelRef = useRef(0);
  const consumedRef = useRef(false);

  const registerScroller = useCallback((el: HTMLElement | null) => {
    scrollerRef.current = el;
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const current = indexRef.current;
      const next = Math.max(0, Math.min(count - 1, target));
      if (next === current || lockRef.current) return;

      setDirection(next > current ? 1 : -1);
      indexRef.current = next;
      setIndex(next);

      lockRef.current = true;
      window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        lockRef.current = false;
      }, LOCK_MS);
    },
    [count],
  );

  const step = useCallback((dir: number) => goTo(indexRef.current + dir), [
    goTo,
  ]);

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  // Индекс -> адресная строка
  useEffect(() => {
    if (!enabled) return;
    const id = idForIndex(index);
    if (!id) return;
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [enabled, index, idForIndex]);

  // Колесо и тачпад
  useEffect(() => {
    if (!enabled) return;

    const onWheel = (e: WheelEvent) => {
      const delta = normalizeWheel(e);
      if (delta === 0) return;
      const dir = delta > 0 ? 1 : -1;

      // Пока внутри секции есть запас — отдаём жест внутренней прокрутке.
      if (canScrollInner(scrollerRef.current, dir)) {
        lastWheelRef.current = performance.now();
        accRef.current = 0;
        return;
      }

      e.preventDefault();

      const now = performance.now();
      if (now - lastWheelRef.current > GESTURE_GAP_MS) {
        // Новый жест: инерция предыдущего закончилась.
        accRef.current = 0;
        consumedRef.current = false;
      }
      lastWheelRef.current = now;

      // Один жест = один переход: инерцию тачпада проглатываем.
      if (lockRef.current || consumedRef.current) return;

      accRef.current += delta;
      if (Math.abs(accRef.current) >= WHEEL_THRESHOLD) {
        const d = accRef.current > 0 ? 1 : -1;
        accRef.current = 0;
        consumedRef.current = true;
        step(d);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [enabled, step]);

  // Клавиатура
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      const scroller = scrollerRef.current;

      // Прокрутить внутри секции, если есть запас, иначе сменить секцию.
      const scrollOrStep = (dir: number, amount: number) => {
        e.preventDefault();
        if (canScrollInner(scroller, dir)) {
          scroller?.scrollBy({ top: dir * amount, behavior: 'smooth' });
          return;
        }
        step(dir);
      };

      switch (e.key) {
        case 'ArrowDown':
          scrollOrStep(1, 120);
          break;
        case 'ArrowUp':
          scrollOrStep(-1, 120);
          break;
        case 'PageDown':
          scrollOrStep(1, window.innerHeight * 0.8);
          break;
        case 'PageUp':
          scrollOrStep(-1, window.innerHeight * 0.8);
          break;
        case ' ':
        case 'Spacebar': {
          // Пробел на кнопке или ссылке должен нажимать её, а не листать.
          const el = e.target as HTMLElement | null;
          if (el?.closest?.('a, button, [role="button"]')) return;
          scrollOrStep(e.shiftKey ? -1 : 1, window.innerHeight * 0.8);
          break;
        }
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(count - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, step, goTo, count]);

  // Свайпы (телефон и планшет)
  useEffect(() => {
    if (!enabled) return;

    let startY = 0;
    let lastY = 0;
    let startTs = 0;
    let owned = false;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startY = t.clientY;
      lastY = t.clientY;
      startTs = performance.now();
      owned = false;
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      lastY = t.clientY;
      const dy = startY - t.clientY;
      if (Math.abs(dy) < 6) return;
      const dir = dy > 0 ? 1 : -1;

      if (canScrollInner(scrollerRef.current, dir)) return;

      owned = true;
      if (e.cancelable) e.preventDefault();
    };

    const onEnd = () => {
      if (!owned) return;
      const dy = startY - lastY;
      const elapsed = performance.now() - startTs;
      if (Math.abs(dy) >= SWIPE_PX && elapsed <= SWIPE_MAX_MS) {
        step(dy > 0 ? 1 : -1);
      }
      owned = false;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [enabled, step]);

  // Якорные ссылки и кнопки «назад/вперёд» в браузере
  useEffect(() => {
    if (!enabled) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = indexForId(id);
      if (target < 0) return;
      e.preventDefault();
      goTo(target);
    };

    const onHashChange = () => {
      const target = indexForId(window.location.hash.slice(1));
      if (target >= 0) goTo(target);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [enabled, goTo, indexForId]);

  // В покадровом режиме документ сам не прокручивается.
  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [enabled]);

  useEffect(() => () => window.clearTimeout(lockTimerRef.current), []);

  return { index, direction, goTo, next, prev, registerScroller };
}
