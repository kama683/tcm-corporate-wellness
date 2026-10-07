import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, Lead, sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

export function Organize() {
  const t = useT();
  const { flow, steps } = t.organize;

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.organize.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.organize.title}</H2>
        <Lead className="mb-9">{t.organize.lead}</Lead>
      </Reveal>

      {/* Горизонтальный stepper */}
      <Reveal
        group
        className="mb-11 flex flex-wrap items-center gap-x-3.5 gap-y-2.5 text-[15px] font-medium"
      >
        {flow.map((item, i) => (
          <RevealItem key={item} className="flex items-center gap-x-3.5">
            <span
              className={
                i === 0
                  ? 'rounded-full bg-green px-5 py-3 text-white'
                  : 'rounded-full bg-mist px-5 py-3 text-bamboo-dark'
              }
            >
              {item}
            </span>
            {i < flow.length - 1 ? (
              <span aria-hidden="true" className="text-green">
                →
              </span>
            ) : null}
          </RevealItem>
        ))}
      </Reveal>

      <Reveal group className="flex flex-wrap gap-4">
        {steps.map((step, i) => (
          <RevealItem
            key={step}
            className="box-border flex flex-[1_1_320px] items-center gap-4 rounded-[20px] border border-line px-[22px] py-[18px]"
          >
            <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-jade text-sm font-semibold text-bamboo-dark">
              {i + 1}
            </span>
            <span className="text-base">{step}</span>
          </RevealItem>
        ))}
        <div className="flex-[1_1_320px]" aria-hidden="true" />
      </Reveal>

      <Reveal group className="mt-9 flex flex-wrap gap-6">
        <RevealItem className="box-border flex-[1_1_320px] rounded-[28px] bg-mist p-8 transition-colors duration-300 hover:bg-jade/60">
          <div className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-green">
            {t.organize.format1Label}
          </div>
          <h3 className="m-0 font-display text-[28px] font-semibold text-bamboo-dark md:text-[32px]">
            {t.organize.format1Title}
          </h3>
        </RevealItem>
        <RevealItem className="box-border flex-[1_1_320px] rounded-[28px] bg-mist p-8 transition-colors duration-300 hover:bg-jade/60">
          <div className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-green">
            {t.organize.format2Label}
          </div>
          <h3 className="m-0 font-display text-[28px] font-semibold text-bamboo-dark md:text-[32px]">
            {t.organize.format2Title}
          </h3>
        </RevealItem>
      </Reveal>
    </section>
  );
}
