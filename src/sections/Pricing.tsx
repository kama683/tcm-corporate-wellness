import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { useReducedMotion } from '../lib/motion';

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
      {value.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')}
      {suffix}
    </span>
  );
}

export function Pricing() {
  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>Стоимость</Eyebrow>
        <H2 className="mb-4">Прозрачная структура услуг</H2>
        <Lead className="mb-10">
          Знакомство бесплатно, дальше формат зависит от задач и состояния
          сотрудника.
        </Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap items-stretch gap-6">
        {/* Бесплатная консультация: зелёная рамка и метка */}
        <RevealItem className="relative box-border flex-[1_1_280px] rounded-[28px] border-2 border-green bg-white p-8">
          <div className="mb-[18px] inline-block rounded-full bg-green px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            Для всех
          </div>
          <H3 className="mb-2">Первичная консультация</H3>
          <div className="my-3.5 text-[34px] font-bold text-green md:text-[38px]">
            Бесплатно
          </div>
          <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
            Знакомство с состоянием сотрудника и определение дальнейшего
            формата.
          </p>
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_280px] rounded-[28px] bg-mist p-8">
          <div className="mb-[18px] inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-green">
            Для женщин
          </div>
          <H3 className="mb-2">Комплексная диагностика</H3>
          <div className="mb-1.5 mt-3 text-[34px] font-bold text-bamboo-dark md:text-[38px]">
            <Counter to={20000} />
          </div>
          <p className="m-0 mb-[18px] text-sm text-ink-soft">До 40 минут</p>
          <div className="border-t border-jade pt-4 text-[15px] text-ink">
            Индивидуальный сеанс — <b className="font-bold">30 000 ₸</b>
          </div>
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_280px] rounded-[28px] bg-mist p-8">
          <div className="mb-[18px] inline-block rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-green">
            Для мужчин
          </div>
          <H3 className="mb-2">Индивидуальный сеанс</H3>
          <div className="my-3.5 text-[34px] font-bold text-bamboo-dark md:text-[38px]">
            <Counter to={30000} />
          </div>
          <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
            Состав процедур определяется специалистом.
          </p>
        </RevealItem>
      </Reveal>

      <Reveal>
        <p className="m-0 mt-7 text-[15px] leading-[1.6] text-ink-soft">
          В программу могут входить иглоукалывание, моксотерапия, баночная
          терапия и массаж — по индивидуальным показаниям.
        </p>
      </Reveal>
    </section>
  );
}
