import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, Lead, Placeholder, sectionPad } from '../components/ui';
import { images } from '../site.config';
import { useReducedMotion } from '../lib/motion';

const topics = [
  'Вопросы менструального цикла',
  'Климактерический период',
  'Общее самочувствие',
  'Стресс и сон',
  'Иные вопросы женского здоровья',
];

export function Women() {
  const reduced = useReducedMotion();

  return (
    <section className={sectionPad}>
      <Reveal className="flex flex-wrap items-center gap-8 rounded-[40px] bg-mist p-7 md:gap-12 md:p-14">
        <div className="min-w-0 flex-[1_1_380px]">
          <Eyebrow>Для женщин</Eyebrow>
          <h2 className="m-0 mb-4 font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.01em] text-bamboo-dark">
            Специальная программа для женщин
          </h2>
          <Lead className="mb-7">
            Забота о женском здоровье требует отдельного подхода.
          </Lead>

          <div className="mb-7 inline-block rounded-3xl border-l-4 border-green bg-white px-8 py-6">
            <div className="text-[15px] font-semibold text-bamboo-dark">
              Комплексная диагностика
            </div>
            <div className="my-1.5 text-[34px] font-bold tabular-nums text-green md:text-[40px]">
              20 000 ₸
            </div>
            <div className="text-sm text-ink-soft">
              Продолжительность — до 40 минут
            </div>
          </div>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-base text-ink">
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          <p className="m-0 mt-7 text-sm leading-[1.6] text-ink-soft">
            При необходимости специализированной диагностики рекомендуется
            обращение к профильному врачу.
          </p>
        </div>

        <div className="flex min-w-0 flex-[1_1_280px] justify-center">
          {images.women ? (
            <div className="w-full max-w-[320px] rounded-full border border-jade bg-white p-1.5">
              <motion.img
                src={images.women}
                alt="Цветок лотоса в фарфоровой чаше, чай и нефритовые камни"
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
              kind="Изображение"
              title="Слот под картинку для блока «Для женщин»"
              note="1200×1200"
              className="aspect-square w-full max-w-[320px] rounded-full bg-white"
            />
          )}
        </div>
      </Reveal>
    </section>
  );
}
