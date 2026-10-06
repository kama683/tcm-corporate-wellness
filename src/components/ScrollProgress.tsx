import { motion } from 'motion/react';

type Props = {
  /** 0..1 */
  progress: number;
  /** Количество секций: по одному узлу на секцию. */
  count: number;
  /** Анимировать заполнение (в покадровом режиме). */
  animated: boolean;
};

/**
 * Правый стебель как индикатор прогресса: заполняется зелёным по мере
 * перехода между секциями, узлы отмечают секции.
 *
 * Заполнение — scaleY, а не height, чтобы анимировался только transform.
 */
export function ScrollProgress({ progress, count, animated }: Props) {
  const value = Math.min(1, Math.max(0, progress));
  const fillClass =
    'h-full w-full origin-top bg-[linear-gradient(180deg,#7FC796_0%,#1E7A57_60%,#0F3D2B_100%)]';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 z-[25] h-full w-1"
    >
      <div className="relative h-full w-full bg-jade/40">
        {animated ? (
          <motion.div
            className={fillClass}
            animate={{ scaleY: value }}
            initial={{ scaleY: value }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className={fillClass} style={{ transform: `scaleY(${value})` }} />
        )}

        {/* Узлы бамбука: по одному на секцию */}
        {Array.from({ length: count }, (_, i) => {
          const at = count > 1 ? i / (count - 1) : 0;
          const passed = value >= at - 0.001;
          return (
            <span
              key={i}
              className="absolute left-1/2 h-[3px] w-[9px] -translate-x-1/2 rounded-full transition-colors duration-500"
              style={{
                top: `calc(${at * 100}% - 1.5px)`,
                background: passed ? '#0F3D2B' : '#BFE3CF',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
