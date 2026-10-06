import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, H3, Lead, sectionPad } from '../components/ui';

const reality = [
  'Стресс',
  'Усталость',
  'Длительная статическая нагрузка',
  'Мышечное напряжение',
  'Дефицит времени на восстановление',
];

const forEmployee = [
  'Доступность на рабочем месте',
  'Экономия времени',
  'Индивидуальный подход',
  'Консультация специалиста',
];

const forCompany = [
  'Дополнение well-being-программы',
  'Видимая забота о людях',
  'Организованный формат',
  'Гибкость запуска',
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base leading-[1.5]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function WhyCompany() {
  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>Зачем это нужно</Eyebrow>
        <H2 className="mb-4">
          Поддержка в условиях современной рабочей нагрузки
        </H2>
        <Lead className="mb-10">
          Реальность рабочей среды знакома каждому. Корпоративная программа
          помогает сделать заботу о себе доступной на месте.
        </Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap gap-6">
        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] bg-mist p-8">
          <H3 className="mb-[18px]">Реальность рабочей среды</H3>
          <List items={reality} />
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] border border-line bg-white p-8">
          <h3 className="m-0 mb-[18px] text-xl font-semibold text-green">
            Для сотрудника
          </h3>
          <List items={forEmployee} />
        </RevealItem>

        <RevealItem className="box-border flex-[1_1_300px] rounded-[28px] border border-line bg-white p-8">
          <h3 className="m-0 mb-[18px] text-xl font-semibold text-green">
            Для компании
          </h3>
          <List items={forCompany} />
        </RevealItem>
      </Reveal>
    </section>
  );
}
