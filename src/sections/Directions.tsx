import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

export function Directions() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.directions.eyebrow}</Eyebrow>
        <H2 className="mb-10">{t.directions.title}</H2>
      </Reveal>

      <Reveal group className="flex flex-wrap gap-5">
        {t.directions.items.map((d, i) => (
          <RevealItem
            key={d.title}
            className="group box-border flex flex-[1_1_440px] gap-[22px] rounded-[28px] bg-mist p-7 transition-colors duration-300 hover:bg-jade/60 md:p-8"
          >
            <div className="font-display text-[44px] font-semibold leading-none text-green transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <H3 className="mb-2">{d.title}</H3>
              <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
                {d.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
