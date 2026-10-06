import { Droplet, Info, Lock, ShieldCheck } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, H2, sectionPad } from '../components/ui';

const items = [
  {
    Icon: ShieldCheck,
    title: 'Предварительная оценка',
    text: 'Состояние сотрудника и возможные противопоказания.',
  },
  {
    Icon: Droplet,
    title: 'Стерильность',
    text: 'Одноразовые стерильные иглы и санитарные требования.',
  },
  {
    Icon: Lock,
    title: 'Конфиденциальность',
    text: 'Информация о здоровье не передаётся работодателю без законных оснований.',
  },
  {
    Icon: Info,
    title: 'Границы программы',
    text: 'ТКМ не заменяет экстренную, обязательную и специализированную медицинскую помощь.',
  },
];

/** Спокойный блок без эффектов: тут доверие важнее зрелищности. */
export function Safety() {
  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>Безопасность</Eyebrow>
        <H2 className="mb-10">Безопасность человека — приоритет программы</H2>
      </Reveal>

      <div className="flex flex-wrap gap-5">
        {items.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="box-border flex-[1_1_240px] rounded-3xl bg-mist p-7"
          >
            <Icon size={32} strokeWidth={2} className="text-green" />
            <h3 className="mb-2 mt-3.5 text-lg font-semibold text-bamboo-dark">
              {title}
            </h3>
            <p className="m-0 text-sm leading-[1.6] text-ink-soft">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
