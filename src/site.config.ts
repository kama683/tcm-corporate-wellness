/**
 * Единственный файл с заглушками для данных и медиа.
 * Когда клиент пришлёт данные и материалы — правим только здесь.
 *
 * Переводимые тексты (заголовки, описания, подписи) живут в src/i18n —
 * это не заглушки, а копирайт на двух языках, их место там.
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
  /** Имя не переводится — собственное имя человека. */
  name: 'Лю Дэчжоу',
  /** Портрет: public/images/specialist.webp */
  photo: assets.specialistPhoto as Asset,
  /** Видео-знакомство 9:16: public/video/intro.mp4 + постер */
  video: assets.intro.video as Asset,
  videoPoster: assets.intro.poster as Asset,
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
