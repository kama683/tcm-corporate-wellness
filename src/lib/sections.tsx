import type { ComponentType } from 'react';
import type { SectionId } from '../i18n/types';
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
  /** Якорь: он же id секции, значение в адресной строке и ключ перевода
      в словаре `sections` (src/i18n). */
  id: SectionId;
  Component: ComponentType;
  kind: TransitionKind;
};

export const sections: SectionDef[] = [
  { id: 'top', Component: Hero, kind: 'circle' },
  { id: 'why', Component: WhyCompany, kind: 'slide' },
  { id: 'methods', Component: Methods, kind: 'slide' },
  { id: 'specialist', Component: Specialist, kind: 'circle' },
  { id: 'directions', Component: Directions, kind: 'slide' },
  { id: 'program', Component: Program, kind: 'slide' },
  { id: 'women', Component: Women, kind: 'slide' },
  { id: 'price', Component: Pricing, kind: 'slide' },
  { id: 'organize', Component: Organize, kind: 'slide' },
  { id: 'leadership', Component: Leadership, kind: 'slide' },
  { id: 'safety', Component: Safety, kind: 'slide' },
  { id: 'contacts', Component: Contacts, kind: 'circle' },
];

export function indexFromHash(hash: string): number {
  const id = hash.replace(/^#/, '');
  if (!id) return 0;
  const i = sections.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}
