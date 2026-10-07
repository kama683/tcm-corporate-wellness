import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { useReducedMotion } from '../lib/motion';
import { useT } from '../i18n/context';
import type { Dict } from '../i18n/types';

/** Вертикальный таймлайн: линия-бамбук «растёт» при скролле. */
function Timeline({ steps }: { steps: Dict['program']['steps'] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 60%'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const height = useTransform(smooth, (v) => `${v * 100}%`);

  return (
    <ol ref={ref} className="relative m-0 list-none p-0">
      {/* Фон линии */}
      <div
        aria-hidden="true"
        className="absolute left-[21px] top-[46px] bottom-[76px] w-0.5 bg-jade"
      />
      {/* Заполнение линии по скроллу */}
      {reduced ? null : (
        <motion.div
          aria-hidden="true"
          className="absolute left-[21px] top-[46px] bottom-[76px] w-0.5 origin-top overflow-hidden"
        >
          <motion.div
            className="w-full bg-[linear-gradient(180deg,#7FC796_0%,#1E7A57_100%)]"
            style={{ height }}
          />
        </motion.div>
      )}

      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-[22px] pb-[30px] last:pb-0"
        >
          <div className="relative z-[1] flex h-11 w-11 flex-none items-center justify-center rounded-full bg-green font-semibold text-white">
            {i + 1}
          </div>
          <div>
            <H3 className="mb-1.5 mt-2">{step.title}</H3>
            <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Program() {
  const t = useT();

  return (
    <section className={`flex flex-wrap gap-10 md:gap-14 ${sectionPad}`}>
      <Reveal className="min-w-0 flex-[1_1_340px]">
        <Eyebrow>{t.program.eyebrow}</Eyebrow>
        <H2 className="mb-5">{t.program.title}</H2>
        <Lead className="mb-7">{t.program.lead}</Lead>
        <div className="rounded-3xl bg-mist px-[26px] py-6">
          <div className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-green">
            {t.program.methodsBoxTitle}
          </div>
          <div className="text-base leading-[1.6] text-ink">
            {t.program.methodsBoxText}
          </div>
          <div className="mt-2.5 text-sm leading-[1.6] text-ink-soft">
            {t.program.methodsBoxNote}
          </div>
        </div>
      </Reveal>

      <div className="min-w-0 flex-[1_1_400px]">
        <Timeline steps={t.program.steps} />
      </div>
    </section>
  );
}
