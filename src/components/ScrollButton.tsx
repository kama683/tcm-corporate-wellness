import { motion } from 'motion/react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useT } from '../i18n/context';

type Props = {
  /** На последней секции кнопка превращается в «наверх». */
  atEnd: boolean;
  onNext: () => void;
  onTop: () => void;
};

/** Кнопка внизу по центру: стрелка с мягкой пульсацией. */
export function ScrollButton({ atEnd, onNext, onTop }: Props) {
  const t = useT();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center">
      <button
        type="button"
        onClick={atEnd ? onTop : onNext}
        aria-label={atEnd ? t.common.scrollTop : t.common.scrollNext}
        className="pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/80 text-green shadow-[0_8px_24px_rgba(15,61,43,0.12)] backdrop-blur transition-colors hover:bg-white"
      >
        {/* Мягкая пульсация вокруг кнопки */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-green/40"
          animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
          transition={{
            duration: 1.9,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        <motion.span
          aria-hidden="true"
          className="relative flex"
          animate={{ y: atEnd ? [0, -3, 0] : [0, 3, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          {atEnd ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
        </motion.span>
      </button>
    </div>
  );
}
