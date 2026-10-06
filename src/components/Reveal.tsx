import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { fadeUp, stagger, useReducedMotion, viewportOnce } from '../lib/motion';
import { useDeck } from '../lib/deck';

type Props = {
  children: ReactNode;
  className?: string;
  /** Поочерёдное появление прямых детей. */
  group?: boolean;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'footer';
  id?: string;
};

/**
 * Появление по скроллу.
 *
 * В покадровом режиме варианты не задаются напрямую: они наследуются от
 * контейнера секции (paneContent), который задаёт каскад — заголовок,
 * текст, карточки. В обычном режиме блок появляется при попадании в кадр.
 * При prefers-reduced-motion анимации нет вовсе.
 */
export function Reveal({
  children,
  className,
  group = false,
  delay = 0,
  as = 'div',
  id,
}: Props) {
  const reduced = useReducedMotion();
  const deck = useDeck();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} id={id}>
        {children}
      </Plain>
    );
  }

  // Покадровый режим: каскад идёт от контейнера секции.
  if (deck?.inDeck) {
    return (
      <Tag id={id} className={className} variants={group ? stagger : fadeUp}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={group ? stagger : fadeUp}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Элемент внутри Reveal group. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
