import type { Variants } from 'motion/react';

const easeOut = [0.22, 1, 0.36, 1] as const;
const easeIn = [0.4, 0, 1, 1] as const;

/**
 * Общий переход: уходящая секция слегка уменьшается, размывается и
 * уходит вверх с затуханием; новая выезжает снизу с лёгким масштабированием.
 * Направление приходит через `custom`.
 */
export const slidePane: Variants = {
  enter: (dir: number) => ({
    y: dir > 0 ? '100%' : '-100%',
    scale: 0.96,
    opacity: 0,
    filter: 'blur(0px)',
    zIndex: 2,
  }),
  center: {
    y: '0%',
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    zIndex: 2,
    pointerEvents: 'auto',
    transition: { duration: 0.8, ease: easeOut },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? '-18%' : '18%',
    scale: 0.92,
    opacity: 0,
    filter: 'blur(6px)',
    zIndex: 1,
    pointerEvents: 'none',
    transition: { duration: 0.7, ease: easeIn },
  }),
};

/**
 * Особый переход для hero, блока «Специалист» и финального блока:
 * секция раскрывается кругом из центра. Уходит так же, как остальные,
 * чтобы переходы между соседями не конфликтовали.
 */
export const circlePane: Variants = {
  enter: {
    clipPath: 'circle(0% at 50% 55%)',
    scale: 1.06,
    opacity: 1,
    filter: 'blur(0px)',
    zIndex: 2,
  },
  center: {
    clipPath: 'circle(135% at 50% 55%)',
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    zIndex: 2,
    pointerEvents: 'auto',
    transition: { duration: 0.9, ease: easeOut },
  },
  exit: (dir: number) => ({
    clipPath: 'circle(135% at 50% 55%)',
    y: dir > 0 ? '-14%' : '14%',
    scale: 0.93,
    opacity: 0,
    filter: 'blur(6px)',
    zIndex: 1,
    pointerEvents: 'none',
    transition: { duration: 0.7, ease: easeIn },
  }),
};

/**
 * Каскад внутри секции. Reveal и RevealItem подхватывают эти варианты
 * по наследованию, поэтому правки в самих секциях не нужны.
 */
export const paneContent: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.3, staggerChildren: 0.1 },
  },
};
