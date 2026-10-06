import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, sectionPad } from '../components/ui';

const directions = [
  {
    n: '01',
    title: 'Общее восстановление',
    text: 'Усталость, стресс, мышечное напряжение, физические и рабочие нагрузки.',
  },
  {
    n: '02',
    title: 'Опорно-двигательный аппарат',
    text: 'Напряжение в спине, шее и пояснице, скованность, последствия нагрузок.',
  },
  {
    n: '03',
    title: 'Сон и эмоциональное состояние',
    text: 'Стресс, переутомление и вопросы качества сна.',
  },
  {
    n: '04',
    title: 'Женское здоровье',
    text: 'Отдельная консультационно-диагностическая программа.',
  },
];

export function Directions() {
  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>Направления</Eyebrow>
        <H2 className="mb-10">Четыре направления корпоративной поддержки</H2>
      </Reveal>

      <Reveal group className="flex flex-wrap gap-5">
        {directions.map((d) => (
          <RevealItem
            key={d.n}
            className="group box-border flex flex-[1_1_440px] gap-[22px] rounded-[28px] bg-mist p-7 transition-colors duration-300 hover:bg-jade/60 md:p-8"
          >
            <div className="font-display text-[44px] font-semibold leading-none text-green transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
              {d.n}
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
