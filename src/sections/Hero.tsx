import { motion } from 'motion/react';
import { ButtonGhost, ButtonPrimary, Pill } from '../components/ui';
import { useReducedMotion } from '../lib/motion';
import { HeroScene } from '../components/HeroScene';

const title = 'Забота о здоровье сотрудников — прямо на предприятии';

/** Kinetic text reveal: заголовок выезжает по словам. */
function KineticTitle() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <h1 className="m-0 font-display text-[clamp(34px,4.8vw,68px)] font-semibold leading-[1.02] tracking-[-0.015em] text-bamboo-dark">
        {title}
      </h1>
    );
  }

  return (
    <h1 className="m-0 font-display text-[clamp(34px,4.8vw,68px)] font-semibold leading-[1.02] tracking-[-0.015em] text-bamboo-dark">
      {title.split(' ').map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.06em' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1 + i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {'\u00A0'}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const appear = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="section-pad-sm">
      {/* Первый экран целиком — панель матового стекла. Размывается только
          фон за ней: текст, кнопки и 3D-сцена остаются резкими. */}
      <div className="glass-panel flex flex-wrap items-center gap-10">
        <div className="min-w-0 flex-[1_1_440px]">
          <motion.p
            {...appear}
            transition={{ duration: 0.5 }}
            className="m-0 mb-[18px] text-[13px] font-semibold uppercase tracking-[0.16em] text-green"
          >
            Корпоративная программа ТКМ
          </motion.p>

          <KineticTitle />

          <motion.p
            {...appear}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="m-0 mt-6 max-w-[520px] text-[17px] leading-[1.6] text-ink-soft md:text-lg"
          >
            Специалисты традиционной китайской медицины приезжают к вам:
            консультация, диагностика, иглоукалывание, моксотерапия, баночная
            терапия и туйна-массаж.
          </motion.p>

          <motion.div
            {...appear}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-wrap gap-3.5"
          >
            <ButtonPrimary href="#contacts">
              Записаться на консультацию
            </ButtonPrimary>
            <ButtonGhost href="#methods">Узнать о методах</ButtonGhost>
          </motion.div>

          <motion.div
            {...appear}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-9 flex flex-wrap gap-2.5"
          >
            <Pill>Без поездки в клинику</Pill>
            <Pill>Первичная консультация — бесплатно</Pill>
            <Pill>До 40–50 участников в день</Pill>
          </motion.div>
        </div>

        <div className="flex min-w-0 flex-[1_1_360px] justify-center">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
