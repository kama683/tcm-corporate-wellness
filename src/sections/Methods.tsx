import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';
import { assets } from '../config/assets';

type Method = {
  title: string;
  text: string;
  image: string;
  alt: string;
};

const methods: Method[] = [
  {
    title: 'Иглоукалывание',
    text: 'Воздействие на определённые точки с использованием стерильных одноразовых игл.',
    image: assets.methods.acupuncture,
    alt: 'Стерильные иглы на нефритовом камне',
  },
  {
    title: 'Моксотерапия',
    text: 'Локальное тепловое воздействие в рамках традиционных методик ТКМ.',
    image: assets.methods.moxa,
    alt: 'Тлеющая моксо-сигара на керамической подставке',
  },
  {
    title: 'Баночная терапия',
    text: 'Традиционная техника воздействия на отдельные зоны тела.',
    image: assets.methods.cupping,
    alt: 'Три стеклянные банки для баночной терапии',
  },
  {
    title: 'Туйна-массаж',
    text: 'Китайская техника массажа и мануального воздействия.',
    image: assets.methods.tuina,
    alt: 'Стопка нефритовых камней на полотенце',
  },
];

export function Methods() {
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
        <Eyebrow>Методы</Eyebrow>
        <H2 className="mb-4">
          Традиционная китайская медицина: комплексный подход
        </H2>
        <Lead className="mb-11">
          Методы подбираются индивидуально после первичной консультации.
        </Lead>
      </Reveal>

      <Reveal group className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {methods.map((method) => (
          <RevealItem
            key={method.title}
            className="group overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_10px_30px_rgba(15,61,43,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(15,61,43,0.12)]"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-mist">
              <img
                src={method.image}
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
          Не стандартный набор процедур для всех, а индивидуальный выбор методов.
        </p>
      </Reveal>
    </section>
  );
}
