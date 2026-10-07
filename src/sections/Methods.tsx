import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { assets } from '../config/assets';
import { useT } from '../i18n/context';

const images = [
  assets.methods.acupuncture,
  assets.methods.moxa,
  assets.methods.cupping,
  assets.methods.tuina,
];

export function Methods() {
  const t = useT();

  return (
    <section className={`relative ${sectionPad}`}>
      {/* Иероглиф-водяной знак: 針灸 — иглоукалывание и мокса */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[70px] select-none font-serif text-[120px] leading-none text-green opacity-[0.06] md:text-[220px]"
      >
        針灸
      </div>

      <Reveal>
        <Eyebrow>{t.methods.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.methods.title}</H2>
        <Lead className="mb-11">{t.methods.lead}</Lead>
      </Reveal>

      <Reveal
        group
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        {t.methods.items.map((method, i) => (
          <RevealItem
            key={method.title}
            className="group overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_10px_30px_rgba(15,61,43,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(15,61,43,0.12)]"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-mist">
              <img
                src={images[i]}
                alt={method.alt}
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
              />
            </div>
            <div className="px-[26px] pb-7 pt-6">
              <H3 className="mb-2.5">{method.title}</H3>
              <p className="m-0 text-[15px] leading-[1.6] text-ink-soft">
                {method.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>

      <Reveal>
        <p className="m-0 mt-9 font-display text-[22px] font-semibold text-green md:text-[28px]">
          {t.methods.footerQuote}
        </p>
      </Reveal>
    </section>
  );
}
