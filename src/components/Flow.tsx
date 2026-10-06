import { useEffect, useState } from 'react';
import { DeckContext } from '../lib/deck';
import { sections } from '../lib/sections';
import { Bamboo } from './Bamboo';
import { Petals } from './Petals';
import { SectionShell } from './SectionShell';
import { ScrollProgress } from './ScrollProgress';

/**
 * Обычный режим: вертикальная прокрутка с лёгким scroll-snap и простым
 * появлением блоков. Включается на экранах уже 768 px и при
 * prefers-reduced-motion.
 */
export function Flow() {
  const [progress, setProgress] = useState(0);

  // scroll-snap включаем на html: только он здесь прокручивается.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('flow-snap-root');
    return () => root.classList.remove('flow-snap-root');
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        setProgress(Math.min(1, window.scrollY / max));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <DeckContext.Provider value={null}>
      <div className="bamboo-col relative w-full overflow-clip">
        <Petals />
        <Bamboo mode="flow" />

        <div className="col">
          {sections.map((def) => (
            <SectionShell key={def.id} def={def} deck={false} />
          ))}
        </div>

        <ScrollProgress
          progress={progress}
          count={sections.length}
          animated={false}
        />
      </div>
    </DeckContext.Provider>
  );
}
