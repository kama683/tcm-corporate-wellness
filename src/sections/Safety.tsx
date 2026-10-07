import { Droplet, Info, Lock, ShieldCheck } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, H2, sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

const ICONS = [ShieldCheck, Droplet, Lock, Info];

/** Спокойный блок без эффектов: тут доверие важнее зрелищности. */
export function Safety() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.safety.eyebrow}</Eyebrow>
        <H2 className="mb-10">{t.safety.title}</H2>
      </Reveal>

      <div className="flex flex-wrap gap-5">
        {t.safety.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={item.title}
              className="box-border flex-[1_1_240px] rounded-3xl bg-mist p-7"
            >
              <Icon size={32} strokeWidth={2} className="text-green" />
              <h3 className="mb-2 mt-3.5 text-lg font-semibold text-bamboo-dark">
                {item.title}
              </h3>
              <p className="m-0 text-sm leading-[1.6] text-ink-soft">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
