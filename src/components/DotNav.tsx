import type { SectionDef } from '../lib/sections';

type Props = {
  sections: SectionDef[];
  index: number;
  onPick: (index: number) => void;
};

/** Вертикальная навигация точками с подписями при наведении. */
export function DotNav({ sections, index, onPick }: Props) {
  return (
    <nav
      aria-label="Навигация по секциям"
      className="fixed right-2 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 md:flex lg:right-4"
    >
      {sections.map((section, i) => {
        const current = i === index;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Секция ${i + 1} из ${sections.length}: ${section.label}`}
            aria-current={current ? 'true' : undefined}
            className="group flex min-h-[44px] items-center justify-end gap-2 pl-3 pr-1"
          >
            <span className="pointer-events-none translate-x-1 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-bamboo-dark opacity-0 shadow-[0_4px_14px_rgba(15,61,43,0.12)] backdrop-blur transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
              {section.label}
            </span>
            <span
              aria-hidden="true"
              className={
                current
                  ? 'h-2.5 w-2.5 rounded-full bg-green ring-4 ring-green/20 transition-all duration-300'
                  : 'h-2 w-2 rounded-full bg-jade transition-all duration-300 group-hover:bg-green/70'
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
