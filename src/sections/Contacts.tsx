import { Phone } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { contact, images } from '../site.config';
import { sectionPad } from '../components/ui';
import { useT } from '../i18n/context';

/** Формы заявки нет — вместо неё кнопка с телефоном. */
function ContactButton() {
  return (
    <a
      href={contact.phoneHref}
      className="inline-flex min-h-[56px] items-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-bamboo-dark no-underline transition-opacity hover:text-bamboo-dark hover:opacity-90"
    >
      <Phone size={20} />
      {contact.phone}
    </a>
  );
}

export function Contacts() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal className="contacts-wide relative overflow-hidden rounded-[40px] bg-[linear-gradient(160deg,#0F3D2B_0%,#1E7A57_100%)] px-7 pb-32 pt-14 text-white md:px-14 md:pb-[150px] md:pt-[72px]">
        {/* Пейзаж фоном панели: горы слева, справа тёмное поле под текст */}
        {images.inkLandscape ? (
          <>
            <img
              src={images.inkLandscape}
              alt=""
              aria-hidden="true"
              width={1916}
              height={821}
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top md:object-left"
            />
            {/* Затемнение: на телефоне всё поле, на широком экране — справа,
                где стоит текст. Горы остаются видны слева. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-bamboo-dark/70 md:bg-[linear-gradient(90deg,rgba(15,61,43,0)_28%,rgba(15,61,43,0.86)_62%)]"
            />
            {/* Мягкий переход сверху от белого блока выше */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bamboo-dark to-transparent"
            />
          </>
        ) : null}

        <svg
          viewBox="0 0 1200 240"
          preserveAspectRatio="none"
          width="100%"
          height="220"
          className="absolute inset-x-0 bottom-0 block"
          aria-hidden="true"
        >
          <path
            d="M0 240 L0 150 C120 90 200 130 300 80 C400 30 470 110 560 90 C660 66 720 20 820 60 C920 100 1020 40 1200 110 L1200 240 Z"
            fill="#FFFFFF"
            fillOpacity="0.07"
          />
          <path
            d="M0 240 L0 180 C140 140 220 170 340 130 C460 90 540 160 650 140 C760 120 860 90 960 130 C1060 170 1130 140 1200 160 L1200 240 Z"
            fill="#FFFFFF"
            fillOpacity="0.1"
          />
          <path
            d="M0 240 L0 205 C160 180 260 210 400 190 C540 170 640 205 780 190 C920 175 1040 200 1200 188 L1200 240 Z"
            fill="#FFFFFF"
            fillOpacity="0.14"
          />
        </svg>

        <div className="relative max-w-[700px] md:ml-auto md:max-w-[560px]">
          <p className="m-0 mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-jade">
            {t.contacts.eyebrow}
          </p>
          <h2 className="m-0 mb-5 font-display text-[clamp(32px,5vw,68px)] font-semibold leading-[1.02] tracking-[-0.015em]">
            {t.contacts.title}
          </h2>
          <p className="m-0 mb-8 text-[17px] leading-[1.6] text-line md:text-lg">
            {t.contacts.lead}
          </p>

          <div className="mb-9 flex flex-wrap gap-2.5">
            {t.contacts.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-4 py-2.5 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <ContactButton />
        </div>
      </Reveal>

      <Reveal>
        <p className="m-0 mt-7 text-center font-display text-[22px] font-semibold text-green md:text-[26px]">
          {t.contacts.closingQuote}
        </p>
      </Reveal>
    </section>
  );
}
