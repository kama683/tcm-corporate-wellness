import type { ReactNode } from 'react';

/** Надзаголовок секции: мелкие прописные зелёным. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 mb-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-green">
      {children}
    </p>
  );
}

/** Крупный заголовок секции (Cormorant Garamond). */
export function H2({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`m-0 font-display text-[clamp(30px,4vw,54px)] font-semibold leading-[1.05] tracking-[-0.01em] text-bamboo-dark ${className}`}
    >
      {children}
    </h2>
  );
}

/** Подзаголовок-лид под H2. */
export function Lead({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`m-0 max-w-[620px] text-[17px] leading-[1.6] text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}

export function H3({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`m-0 text-xl font-semibold text-bamboo-dark ${className}`}>
      {children}
    </h3>
  );
}

/** Отступ между секциями. В покадровом режиме обнуляется через --sec-pad. */
export const sectionPad = 'section-pad';

/** Главная кнопка. */
export function ButtonPrimary({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-[52px] items-center rounded-full bg-green px-[30px] text-base font-semibold text-white no-underline transition-colors hover:bg-bamboo-dark hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}

/** Второстепенная кнопка. */
export function ButtonGhost({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-[52px] items-center rounded-full border-[1.5px] border-green px-7 text-base font-semibold text-green no-underline transition-colors hover:bg-mist ${className}`}
    >
      {children}
    </a>
  );
}

/** Таблетка-метка. Полупрозрачная: стоит на стеклянной панели. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/70 bg-white/55 px-4 py-2.5 text-sm font-medium text-bamboo-dark">
      {children}
    </span>
  );
}

/** Карточка с рамкой. */
export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`box-border rounded-[28px] border border-line bg-white p-8 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Заглушка под материал, которого ещё нет.
 * Пунктирная рамка, подпись, что сюда встанет.
 */
export function Placeholder({
  kind,
  title,
  note,
  className = '',
  style,
}: {
  kind: string;
  title: string;
  note?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`box-border flex flex-col items-center justify-center gap-2.5 border-[1.5px] border-dashed border-green p-8 text-center ${className}`}
      style={style}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-green">
        {kind}
      </div>
      <div className="text-[15px] leading-[1.5] text-bamboo-dark">{title}</div>
      {note ? <div className="text-[13px] text-ink-soft">{note}</div> : null}
    </div>
  );
}
