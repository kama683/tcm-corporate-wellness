import { useEffect } from 'react';
import { motion } from 'motion/react';
import type { SectionDef } from '../lib/sections';
import { paneContent } from '../lib/transitions';
import { useFitScale } from '../hooks/useFitScale';
import { useT } from '../i18n/context';

type Props = {
  def: SectionDef;
  /** Покадровый режим: секция занимает экран целиком. */
  deck: boolean;
  /** Активна ли секция (только в покадровом режиме). */
  active?: boolean;
  registerScroller?: (el: HTMLElement | null) => void;
};

/**
 * Оболочка секции.
 *
 * В покадровом режиме секция занимает 100dvh и подгоняется под высоту
 * экрана: если содержимое не помещается, оно уменьшается пропорционально
 * (useFitScale). Внутренняя прокрутка остаётся запасным вариантом для
 * совсем низких экранов.
 *
 * В обычном режиме — просто секция в потоке с точкой scroll-snap.
 */
export function SectionShell({
  def,
  deck,
  active = false,
  registerScroller,
}: Props) {
  const { Component } = def;
  const t = useT();
  const label = t.sections[def.id];
  const { scrollerRef, outerRef, innerRef } = useFitScale(
    deck && active,
    def.id,
  );

  useEffect(() => {
    if (!deck || !active || !registerScroller) return;
    registerScroller(scrollerRef.current);
  }, [deck, active, registerScroller, scrollerRef]);

  if (!deck) {
    return (
      <section
        id={def.id}
        aria-label={label}
        className="snap-start scroll-mt-6"
      >
        <Component />
      </section>
    );
  }

  return (
    <section id={def.id} aria-label={label} className="h-full">
      <div ref={scrollerRef} className="deck-scroll">
        <div className="flex min-h-full items-center">
          <div ref={outerRef} className="w-full">
            <motion.div
              ref={innerRef}
              className="col"
              initial="hidden"
              animate="visible"
              variants={paneContent}
            >
              <Component />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
