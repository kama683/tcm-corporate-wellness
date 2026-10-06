/**
 * Все параметры 3D: цвета, свет, скорости, размеры.
 * Модели и сцены берут значения только отсюда.
 */

export const palette = {
  jade: '#1E7A57',
  jadeLight: '#BFE3CF',
  bambooDark: '#0F3D2B',
  white: '#FFFFFF',
  mist: '#F2F8F4',
  /** Единственное тёплое пятно: огонёк на кончике моксо-стика */
  ember: '#FF8A2A',
  ash: '#4A4A44',
  /** Полынь: основной цвет и вариация */
  moxa: '#B5B58A',
  moxaDark: '#8A9A6B',
  stone: '#8FC9A4',
  stoneLight: '#BFE3CF',
} as const;

export const glass = {
  transmission: 1,
  thickness: 0.9,
  ior: 1.45,
  roughness: 0.06,
  attenuationColor: palette.jadeLight,
  attenuationDistance: 1.4,
  clearcoat: 1,
  /** Отражения окружения: без них стекло на белом фоне не читается. */
  envMapIntensity: 1.6,
} as const;

export const stoneMaterial = {
  roughness: 0.25,
  clearcoat: 0.6,
  transmission: 0.15,
  sheen: 0.3,
} as const;

export const steel = {
  metalness: 1,
  roughness: 0.25,
  envMapIntensity: 1.2,
} as const;

export const motion3d = {
  /** Поворот сцены за курсором, в градусах */
  heroTiltDeg: 8,
  /** Вращение предмета в мини-сцене: 0.3 об/мин */
  cardSpinRpm: 0.3,
  /** Во сколько раз ускоряется вращение при наведении */
  cardHoverSpeedUp: 3,
  /** Наклон карточки к курсору, в градусах */
  cardTiltDeg: 10,
} as const;

export const lights = {
  /** Тёплый белый ключевой свет */
  keyColor: '#FFF6EA',
  keyIntensity: 2.4,
  /** Мятный контровой */
  rimColor: palette.jadeLight,
  rimIntensity: 1.6,
  /** Мягкая заполняющая сверху */
  fillColor: palette.mist,
  fillIntensity: 0.7,
  ambientIntensity: 0.45,
  /** Огонёк моксы */
  emberIntensity: 1.1,
  emberDistance: 1.4,
} as const;

/**
 * Холст рисуется больше своего места в вёрстке: дым уходит вверх и вбок
 * и успевает полностью раствориться, не упираясь в невидимую границу.
 * Запас одинаковый сверху и снизу, поэтому композиция остаётся по центру.
 */
export const canvasOverflow = { x: 0.1, y: 0.1 } as const;

/** Габариты композиции в мировых единицах — по ним выставляется камера. */
export const sceneBounds = {
  centerY: 0.05,
  halfHeight: 3.0,
  halfWidth: 2.45,
} as const;

export const quality = {
  dpr: [1, 1.75] as [number, number],
  antialias: true,
  /** Ниже этой ширины — статичный постер вместо живой сцены */
  liveSceneMinWidth: 768,
} as const;

/**
 * Постеры-заглушки на случай, когда живую сцену не показываем:
 * узкий экран, prefers-reduced-motion или недоступный WebGL.
 * null — рисуем лёгкий SVG прямо в разметке.
 */
export const posters = {
  hero: null as string | null,
  acupuncture: null as string | null,
  moxa: null as string | null,
  cupping: null as string | null,
  tuina: null as string | null,
} as const;

/** Что показывать в карточках методов: 3D-сцену или фотографию. */
export const methodVisual: 'three' | 'photo' = 'three';
