/**
 * Единственный файл с заглушками.
 * Когда клиент пришлёт данные и материалы — правим только здесь.
 *
 * Пути к картинкам и видео берутся из src/config/assets.ts.
 * Исходники — src/materials, оптимизированные — src/assets/optimized.
 * Пока файла нет — показываем заглушку.
 */

import { assets } from './config/assets';

export type Asset = string | null;

export const contact = {
  /** Единственный контакт на сайте. */
  phone: '+7 771 501 25 54',
  phoneHref: 'tel:+77715012554',
};

export const specialist = {
  name: 'Лю Дэчжоу',
  role: 'Специалист по традиционной китайской медицине',
  level: 'Высокий квалификационный уровень',
  /** Портрет: public/images/specialist.webp */
  photo: assets.specialistPhoto as Asset,
  /** Видео-знакомство 9:16: public/video/intro.mp4 + постер */
  video: assets.intro.video as Asset,
  videoPoster: assets.intro.poster as Asset,
  facts: [
    {
      label: 'Направления',
      value: 'Туйна-массаж, иглоукалывание и моксотерапия, массаж',
    },
    {
      label: 'Квалификация',
      value:
        'Сертификат профессиональной квалификации (специалист по туйна, иглоукалыванию и массажу)',
    },
    {
      label: 'Аттестация',
      value: 'Китайское общество медицины и фармации, 2014 г.',
    },
  ],
};

export const images = {
  /** Картинка для блока «Для женщин», 1200×1200 */
  women: assets.women as Asset,
  /** Тушевой пейзаж для финального блока, 2400×900 */
  inkLandscape: assets.inkLandscape as Asset,
};

export const models = {
  /** GLB-сцена для hero или ссылка на сцену Spline */
  hero: null as Asset,
  /** Если сцена опубликована в Spline — ссылка вида https://prod.spline.design/.../scene.splinecode */
  heroSplineUrl: null as Asset,
};

export const nav = [
  { href: '#methods', label: 'Методы' },
  { href: '#specialist', label: 'Специалист' },
  { href: '#program', label: 'Программа' },
  { href: '#price', label: 'Стоимость' },
  { href: '#organize', label: 'Организация' },
];

export const disclaimer =
  'Информация на сайте носит ознакомительный характер и не заменяет консультацию врача. Методы ТКМ не заменяют экстренную, обязательную и специализированную медицинскую помощь. Перед процедурами проводится оценка состояния и возможных противопоказаний.';
