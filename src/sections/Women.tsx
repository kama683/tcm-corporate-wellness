import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, Lead, Placeholder, sectionPad } from '../components/ui';
import { images } from '../site.config';
import { useReducedMotion } from '../lib/motion';
import { useT } from '../i18n/context';

export function Women() {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <section className={sectionPad}>
      <Reveal className="flex flex-wrap items-center gap-8 rounded-[40px] bg-mist p-7 md:gap-12 md:p-14">
        <div className="min-w-0 flex-[1_1_380px]">
          <Eyebrow>{t.women.eyebrow}</Eyebrow>
          <h2 className="m-0 mb-4 font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.01em] text-bamboo-dark">
            {t.women.title}
          </h2>
          <Lead className="mb-7">{t.women.lead}</Lead>

          <div className="mb-7 inline-block rounded-3xl border-l-4 border-green bg-white px-8 py-6">
            <div className="text-[15px] font-semibold text-bamboo-dark">
              {t.women.priceCardTitle}
            </div>
            <div className="my-1.5 text-[34px] font-bold tabular-nums text-green md:text-[40px]">
              20 000 ₸
            </div>
            <div className="text-sm text-ink-soft">{t.women.priceDuration}</div>
          </div>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-base text-ink">
            {t.women.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <p className="m-0 mt-7 text-sm leading-[1.6] text-ink-soft">
            {t.women.note}
          </p>
        </div>

        <div className="flex min-w-0 flex-[1_1_280px] justify-center">
          {images.women ? (
            <div className="w-full max-w-[320px] rounded-full border border-jade bg-white p-1.5">
              <motion.img
                src={images.women}
                alt={t.women.imageAlt}
                width={900}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-full object-cover object-center"
                animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
                }
              />
            </div>
          ) : (
            <Placeholder
              kind={t.women.placeholderKind}
              title={t.women.placeholderTitle}
              note="1200×1200"
              className="aspect-square w-full max-w-[320px] rounded-full bg-white"
            />
          )}
        </div>
      </Reveal>
    </section>
  );
}
