import type { ComponentType } from 'react';
import { Hero } from '../sections/Hero';
import { WhyCompany } from '../sections/WhyCompany';
import { Methods } from '../sections/Methods';
import { Specialist } from '../sections/Specialist';
import { Directions } from '../sections/Directions';
import { Program } from '../sections/Program';
import { Women } from '../sections/Women';
import { Pricing } from '../sections/Pricing';
import { Organize } from '../sections/Organize';
import { Leadership } from '../sections/Leadership';
import { Safety } from '../sections/Safety';
import { Contacts } from '../sections/Contacts';

/** Вид перехода: общий слайд или круговое раскрытие clip-path. */
export type TransitionKind = 'slide' | 'circle';

export type SectionDef = {
  /** Якорь: он же id секции и значение в адресной строке. */
  id: string;
  /** Подпись для точечной навигации и aria-live. */
  label: string;
  Component: ComponentType;
  kind: TransitionKind;
};

export const sections: SectionDef[] = [
  { id: 'top', label: 'Начало', Component: Hero, kind: 'circle' },
  { id: 'why', label: 'Зачем это нужно', Component: WhyCompany, kind: 'slide' },
  { id: 'methods', label: 'Методы', Component: Methods, kind: 'slide' },
  {
    id: 'specialist',
    label: 'Специалист',
    Component: Specialist,
    kind: 'circle',
  },
  {
    id: 'directions',
    label: 'Направления',
    Component: Directions,
    kind: 'slide',
  },
  { id: 'program', label: 'Программа', Component: Program, kind: 'slide' },
  { id: 'women', label: 'Для женщин', Component: Women, kind: 'slide' },
  { id: 'price', label: 'Стоимость', Component: Pricing, kind: 'slide' },
  { id: 'organize', label: 'Организация', Component: Organize, kind: 'slide' },
  {
    id: 'leadership',
    label: 'Для руководства',
    Component: Leadership,
    kind: 'slide',
  },
  { id: 'safety', label: 'Безопасность', Component: Safety, kind: 'slide' },
  { id: 'contacts', label: 'Контакты', Component: Contacts, kind: 'circle' },
];

export function indexFromHash(hash: string): number {
  const id = hash.replace(/^#/, '');
  if (!id) return 0;
  const i = sections.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}
