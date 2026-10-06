import { useEffect } from 'react';

/**
 * Доводит прокрутку до секции из адресной строки в обычном режиме.
 *
 * Нужен потому, что шрифты и ленивый контент меняют высоту документа уже
 * после монтирования: нативный переход по якорю срабатывает по старой
 * вёрстке и промахивается.
 *
 * Важно: сначала ждём, пока плавная прокрутка браузера остановится, и
 * только потом мгновенно доправляем остаток. Иначе повторные вызовы
 * scrollTo перезапускают smooth-анимацию, и страница доползает до секции
 * секундами.
 *
 * Слушает hashchange: переход по якорю внутри страницы и кнопки
 * «назад/вперёд» не перемонтируют приложение.
 */
export function useAnchorAlign(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer = 0;

    const offsetFor = (el: HTMLElement) => {
      // scroll-margin-top компенсирует высоту прилипшей шапки.
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      return el.getBoundingClientRect().top - margin;
    };

    /** Мгновенная доводка; повторяем, пока вёрстка ещё сдвигается. */
    const correct = (id: string, pass = 0) => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;

      const off = offsetFor(el);
      if (Math.abs(off) > 2) {
        window.scrollTo({ top: window.scrollY + off, behavior: 'instant' });
      }
      if (pass < 8) {
        timer = window.setTimeout(() => correct(id, pass + 1), 120);
      }
    };

    /** Ждём покоя прокрутки, чтобы не перебивать плавный переход. */
    const afterScrollSettles = (id: string) => {
      let lastY = Number.NaN;
      let still = 0;
      let tries = 0;

      const tick = () => {
        if (cancelled) return;
        const y = Math.round(window.scrollY);
        still = y === lastY ? still + 1 : 0;
        lastY = y;
        tries += 1;

        if (still >= 3 || tries > 60) {
          correct(id);
          return;
        }
        timer = window.setTimeout(tick, 50);
      };

      tick();
    };

    const run = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      window.clearTimeout(timer);
      afterScrollSettles(id);
    };

    run();
    window.addEventListener('hashchange', run);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', run);
    };
  }, [enabled]);
}
