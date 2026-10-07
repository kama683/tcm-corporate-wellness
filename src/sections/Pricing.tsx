import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { useReducedMotion } from '../lib/motion';
import { useT } from '../i18n/context';

/** Разделитель разрядов тонким пробелом — не зависит от локали браузера. */
function formatThousands(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Счётчик: цифра добегает до значения, когда карточка видна. */
function Counter({ to, suffix = ' ₸' }: { to: number; suffix?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced || !inView) return;

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatThousands(value)}
      {suffix}
    </span>
  );
}

export function Pricing() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.pricing.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.pricing.title}</H2>
        <Lead className="mb-10">{t.pricing.lead}</Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap items-stretch gap-6">
        {/* Бесплатная консультация: зелёная рамка и метка */}
        <RevealItem className="relative box-border flex-[1_1_280px] rounded-[28px] border-2 border-green bg-white p-8">
          <div className="mb-[18px] inline-block rounded-full bg-green px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            {t.pricing.card1Badge}
          </div>
          <H3 className="mb-2">{t.pricing.card1Title}</H3>
          <div className="my-3.5 text-[34px] font-bold text-green md:text-[38px]">
            {t.pricing.card1Price}
          </div>
          <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
            {t.pricing.card1Text}
          </p>
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_280px] rounded-[28px] bg-mist p-8">
          <div className="mb-[18px] inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-green">
            {t.pricing.card2Badge}
          </div>
          <H3 className="mb-2">{t.pricing.card2Title}</H3>
          <div className="mb-1.5 mt-3 text-[34px] font-bold text-bamboo-dark md:text-[38px]">
            <Counter to={20000} />
          </div>
          <p className="m-0 mb-[18px] text-sm text-ink-soft">
            {t.pricing.card2Duration}
          </p>
          <div className="border-t border-jade pt-4 text-[15px] text-ink">
            {t.pricing.card2FooterPrefix}
            <b className="font-bold">30 000 ₸</b>
          </div>
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_280px] rounded-[28px] bg-mist p-8">
          <div className="mb-[18px] inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-green">
            {t.pricing.card3Badge}
          </div>
          <H3 className="mb-2">{t.pricing.card3Title}</H3>
          <div className="my-3.5 text-[34px] font-bold text-bamboo-dark md:text-[38px]">
            <Counter to={30000} />
          </div>
          <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
            {t.pricing.card3Text}
          </p>
        </RevealItem>
      </Reveal>

      <Reveal>
        <p className="m-0 mt-7 text-[15px] leading-[1.6] text-ink-soft">
          {t.pricing.footNote}
        </p>
      </Reveal>
    </section>
  );
}
