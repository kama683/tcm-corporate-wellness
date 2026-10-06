import { CalendarRange, Clock, Leaf, Heart, MapPin, Users } from 'lucide-react';
import { Reveal, RevealItem } from '../components/Reveal';
import { Eyebrow, H2, Lead, sectionPad } from '../components/ui';

const benefits = [
  {
    Icon: Clock,
    title: 'Минимальное отвлечение',
    text: 'Приём на территории предприятия по согласованному графику.',
  },
  {
    Icon: Users,
    title: 'Организованный охват',
    text: 'Много сотрудников за один корпоративный день.',
  },
  {
    Icon: Leaf,
    title: 'Корпоративное благополучие',
    text: 'Дополнение well-being и HR-программ.',
  },
  {
    Icon: Heart,
    title: 'Видимая забота',
    text: 'Конкретный сервис непосредственно на рабочем месте.',
  },
  {
    Icon: MapPin,
    title: 'Без собственной инфраструктуры',
    text: 'Выезд специалистов на территорию заказчика.',
  },
  {
    Icon: CalendarRange,
    title: 'Гибкий формат',
    text: 'Разовый корпоративный день или регулярная программа.',
  },
];

export function Leadership() {
  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>Для руководства</Eyebrow>
        <H2 className="mb-4">Ценность для человека и для организации</H2>
        <Lead className="mb-10">
          Забота о сотрудниках, которая не требует собственной инфраструктуры.
        </Lead>
      </Reveal>

      <Reveal group className="flex flex-wrap items-stretch gap-6">
        <RevealItem className="box-border flex flex-[1_1_280px] flex-col justify-center rounded-[28px] bg-bamboo-dark p-8 text-white md:p-9">
          <div className="font-display text-[68px] font-semibold leading-none text-jade md:text-[88px]">
            40–50
          </div>
          <div className="mt-3 text-base leading-[1.5] text-line">
            участников в день — ориентировочная пропускная способность
          </div>
        </RevealItem>

        <div className="flex flex-[2_1_520px] flex-wrap gap-5">
          {benefits.map(({ Icon, title, text }) => (
            <RevealItem
              key={title}
              className="box-border flex-[1_1_220px] rounded-3xl border border-line p-6 transition-colors duration-300 hover:border-green/50"
            >
              <Icon size={34} strokeWidth={2} className="text-green" />
              <h3 className="mb-2 mt-3.5 text-[17px] font-semibold text-bamboo-dark">
                {title}
              </h3>
              <p className="m-0 text-sm leading-[1.6] text-ink-soft">{text}</p>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
