import { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DeckContext } from '../lib/deck';
import { indexFromHash, sections } from '../lib/sections';
import { circlePane, slidePane } from '../lib/transitions';
import { useSectionScroll } from '../hooks/useSectionScroll';
import { useT } from '../i18n/context';
import { Bamboo } from './Bamboo';
import { Petals } from './Petals';
import { SectionShell } from './SectionShell';
import { DotNav } from './DotNav';
import { ScrollButton } from './ScrollButton';
import { ScrollProgress } from './ScrollProgress';

/** Покадровый режим: один экран = одна секция. */
export function Deck() {
  const t = useT();
  const count = sections.length;

  const idForIndex = useCallback((i: number) => sections[i]?.id ?? '', []);
  const indexForId = useCallback((id: string) => {
    if (!id) return -1;
    return sections.findIndex((s) => s.id === id);
  }, []);

  const initialIndex = useMemo(
    () => (typeof window === 'undefined' ? 0 : indexFromHash(window.location.hash)),
    [],
  );

  const { index, direction, goTo, next, registerScroller } = useSectionScroll({
    count,
    enabled: true,
    initialIndex,
    idForIndex,
    indexForId,
  });

  const def = sections[index];
  const variants = def.kind === 'circle' ? circlePane : slidePane;
  const progress = count > 1 ? index / (count - 1) : 1;

  const deckState = useMemo(
    () => ({ inDeck: true, index, count, goTo }),
    [index, count, goTo],
  );

  return (
    <DeckContext.Provider value={deckState}>
      <div className="deck bamboo-col">
        <Petals />

        {/* Бамбук остаётся на месте и не перелистывается вместе с секциями */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Bamboo mode="deck" />
        </div>

        <div className="absolute inset-0 z-[5]">
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={def.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="deck-pane"
            >
              <SectionShell
                def={def}
                deck
                active
                registerScroller={registerScroller}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <ScrollProgress progress={progress} count={count} animated />
        <DotNav sections={sections} index={index} onPick={goTo} />
        <ScrollButton
          atEnd={index === count - 1}
          onNext={next}
          onTop={() => goTo(0)}
        />

        {/* Текущая секция объявляется для скринридеров */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {t.common.sectionAnnounce(index + 1, count, t.sections[def.id])}
        </div>
      </div>
    </DeckContext.Provider>
  );
}
