import { CalendarRange, Clock, Leaf, Heart, MapPin, Users } from 'lucide-react';
import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, Lead, sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

const ICONS = [Clock, Users, Leaf, Heart, MapPin, CalendarRange];

export function Leadership() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.leadership.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.leadership.title}</H2>
        <Lead className="mb-10">{t.leadership.lead}</Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap items-stretch gap-6">
        <RevealItem className="box-border flex flex-[1_1_280px] flex-col justify-center rounded-[28px] bg-bamboo-dark p-8 text-white md:p-9">
          <div className="font-display text-[68px] font-semibold leading-none text-jade md:text-[88px]">
            40–50
          </div>
          <div className="mt-3 text-base leading-[1.5] text-line">
            {t.leadership.bigNumberCaption}
          </div>
        </RevealItem>

        <div className="flex flex-[2_1_520px] flex-wrap gap-5">
          {t.leadership.benefits.map((benefit, i) => {
            const Icon = ICONS[i];
            return (
              <RevealItem
                key={benefit.title}
                className="box-border flex-[1_1_220px] rounded-3xl border border-line p-6 transition-colors duration-300 hover:border-green/50"
              >
                <Icon size={34} strokeWidth={2} className="text-green" />
                <h3 className="mb-2 mt-3.5 text-[17px] font-semibold text-bamboo-dark">
                  {benefit.title}
                </h3>
                <p className="m-0 text-sm leading-[1.6] text-ink-soft">
                  {benefit.text}
                </p>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
