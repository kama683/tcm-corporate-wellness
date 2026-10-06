import { useCallback, useEffect, useRef } from 'react';

/** Ниже этого масштаба текст становится нечитаемым — дальше включаем прокрутку. */
const MIN_SCALE = 0.68;

/**
 * Подгоняет секцию под высоту экрана.
 *
 * Если содержимое не помещается, уменьшает его пропорционально (transform:
 * scale), чтобы секция целиком влезала в один экран. Высота обёртки
 * выставляется равной уже уменьшенной — иначе остался бы фантомный скролл,
 * ведь transform не меняет размеры в разметке.
 *
 * Пересчитывает при смене секции, изменении размеров окна и после загрузки
 * шрифтов. Если даже при MIN_SCALE не помещается — остаётся внутренняя
 * прокрутка.
 */
export function useFitScale(enabled: boolean, sectionId: string) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    const scroller = scrollerRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!scroller || !outer || !inner) return;

    // Сбрасываем прошлую подгонку, чтобы измерить натуральную высоту.
    inner.style.transform = '';
    outer.style.height = '';

    const cs = getComputedStyle(scroller);
    const avail =
      scroller.clientHeight -
      parseFloat(cs.paddingTop || '0') -
      parseFloat(cs.paddingBottom || '0');
    const need = inner.offsetHeight;
    if (!avail || !need) return;

    if (need <= avail + 1) return;

    const scale = Math.max(MIN_SCALE, avail / need);
    inner.style.transformOrigin = 'top center';
    inner.style.transform = `scale(${scale})`;
    outer.style.height = `${Math.ceil(need * scale)}px`;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    if (!scroller || !inner) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };

    schedule();

    // transform не меняет размеры в разметке, поэтому наблюдение
    // за содержимым не зациклится на собственной подгонке.
    const ro = new ResizeObserver(schedule);
    ro.observe(scroller);
    ro.observe(inner);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) schedule();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [enabled, sectionId, fit]);

  return { scrollerRef, outerRef, innerRef };
}
