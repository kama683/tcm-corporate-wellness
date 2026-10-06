/**
 * Все пути к материалам сайта — только здесь.
 *
 * Файлы импортируются через Vite: в сборке они получают хеш в имени и
 * кешируются. Компоненты берут пути отсюда и не знают, где лежит файл.
 * Исходники — в src/materials, оптимизированные — в src/assets/optimized.
 */
import acupuncture from '../assets/optimized/method-acupuncture.webp';
import moxa from '../assets/optimized/method-moxa.webp';
import cupping from '../assets/optimized/method-cupping.webp';
import tuina from '../assets/optimized/method-tuina.webp';
import women from '../assets/optimized/women.webp';
import inkLandscape from '../assets/optimized/ink-landscape.webp';
import introVideo from '../assets/optimized/intro.mp4';
import introPoster from '../assets/optimized/intro-poster.webp';
import specialistPhoto from '../assets/optimized/specialist.webp';

export const assets = {
  methods: {
    acupuncture,
    moxa,
    cupping,
    tuina,
  },
  women,
  inkLandscape,
  intro: {
    video: introVideo,
    poster: introPoster,
  },
  /**
   * Портрет специалиста: кадр «голова и плечи» с прозрачным фоном,
   * вырезан из src/materials/images/Портрет врача на прозрачном фоне.png.
   */
  specialistPhoto: specialistPhoto as string | null,
  /**
   * og.jpg (1200×630) лежит в src/assets/optimized, но не подключён:
   * мета-тегу og:image нужен абсолютный адрес, а домен ещё не выбран.
   */
} as const;
