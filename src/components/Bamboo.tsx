import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/motion';

type Leaf = { style: React.CSSProperties; mirror: boolean };

/**
 * В обычном режиме листья распределяются по всей высоте документа,
 * в покадровом — по высоте экрана (в процентах), потому что бамбук
 * остаётся на месте и не прокручивается.
 */
function makeLeaves(side: 'l' | 'r', mode: 'flow' | 'deck'): Leaf[] {
  const count = mode === 'deck' ? 6 : 22;
  const out: Leaf[] = [];

  for (let i = 0; i < count; i++) {
    const rotate = 10 + ((i * 37 + (side === 'r' ? 11 : 0)) % 26);
    const offset = i % 2 === 0 ? 34 : 84;
    const width = 84 + ((i * 13) % 28);
    const delay = -((i * 1.7) % 7);
    const top =
      mode === 'deck'
        ? `${6 + i * 15 + (side === 'r' ? 7 : 0)}%`
        : `${160 + i * 520 + (side === 'r' ? 260 : 0)}px`;

    out.push({
      mirror: side === 'r',
      style: {
        top,
        width: `${width}px`,
        height: `${Math.round(width * 0.31)}px`,
        rotate: `${rotate}deg`,
        ...(side === 'l' ? { left: `${offset}px` } : { right: `${offset}px` }),
        ...(side === 'r' ? { scale: '-1 1' } : null),
        animationDelay: `1.4s, ${2.3 + delay}s`,
      },
    });
  }

  return out;
}

function LeafSvg({ leaf }: { leaf: Leaf }) {
  return (
    <svg
      className={leaf.mirror ? 'leaf leaf-mirror' : 'leaf'}
      viewBox="0 0 96 30"
      style={leaf.style}
      aria-hidden="true"
    >
      <path d="M0 15 C22 -2 62 -4 96 15 C62 34 22 32 0 15 Z" fill="#7FC796" />
      <path
        d="M4 15 L88 15"
        stroke="#1E7A57"
        strokeWidth="1"
        opacity="0.5"
        fill="none"
      />
    </svg>
  );
}

/**
 * Бамбуковые коридоры по бокам: стебли вырастают при загрузке и
 * покачиваются.
 *
 * В обычном режиме добавляется параллакс за прокруткой. В покадровом
 * бамбук стоит на месте — он не перелистывается вместе с секциями,
 * а прогресс показывает отдельный индикатор (ScrollProgress).
 */
export function Bamboo({ mode = 'flow' }: { mode?: 'flow' | 'deck' }) {
  const reduced = useReducedMotion();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const leavesLeft = makeLeaves('l', mode);
  const leavesRight = makeLeaves('r', mode);

  useEffect(() => {
    if (reduced || mode === 'deck') return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        // Параллакс: стороны едут с разной скоростью.
        if (leftRef.current) {
          leftRef.current.style.transform = `translate3d(0, ${y * -0.03}px, 0)`;
        }
        if (rightRef.current) {
          rightRef.current.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, mode]);

  return (
    <>
      <div className="bamboo bamboo-left" ref={leftRef} aria-hidden="true">
        <div className="stalk stalk-1" />
        <div className="stalk stalk-2" />
        <div className="stalk stalk-3" />
        {leavesLeft.map((leaf, i) => (
          <LeafSvg key={i} leaf={leaf} />
        ))}
      </div>

      <div className="bamboo bamboo-right" ref={rightRef} aria-hidden="true">
        <div className="stalk stalk-1" />
        <div className="stalk stalk-2" />
        <div className="stalk stalk-3" />
        {leavesRight.map((leaf, i) => (
          <LeafSvg key={i} leaf={leaf} />
        ))}
      </div>
    </>
  );
}
