import { useReducedMotion } from '../lib/motion';

type Petal = {
  /** Горизонтальная позиция, % ширины экрана. */
  left: number;
  /** Ширина лепестка, px. */
  size: number;
  /** Длительность падения, с. */
  duration: number;
  /** Отрицательная задержка: лепестки сразу распределены по высоте. */
  delay: number;
  /** Боковой снос, px. */
  drift: number;
  /** Поворот за полный цикл, deg. */
  spin: number;
  blur: number;
  opacity: number;
  fill: string;
  /** Позиция в покое — при prefers-reduced-motion. */
  stillTop: number;
  /** Лишний лепесток: на телефоне скрывается. */
  extra: boolean;
};

/** Белые, светло-зелёные и едва розоватые оттенки. */
const TINTS = [
  '#ffffff',
  '#f4faf6',
  '#ffffff',
  '#dff0e6',
  '#c9e5d5',
  '#fdeef1',
  '#f7dfe5',
  '#eaf6ee',
];

/** Простой LCG: раскладка одинакова при каждом рендере и на сервере. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Лепестки одного слоя.
 *
 * `base` — сколько штук остаётся на телефоне, остальные помечаются как
 * `extra` и прячутся медиазапросом.
 */
function makePetals(
  seed: number,
  count: number,
  base: number,
  opts: { size: [number, number]; blur: [number, number]; opacity: [number, number] },
): Petal[] {
  const r = rng(seed);
  const out: Petal[] = [];

  for (let i = 0; i < count; i++) {
    const t = r();
    out.push({
      // Лепестки держатся ближе к краям: середина отдана заголовку и кнопкам.
      left: Math.round((2 + r() * 96) * 10) / 10,
      size: Math.round(opts.size[0] + t * (opts.size[1] - opts.size[0])),
      duration: Math.round(34 + r() * 36),
      delay: -Math.round(r() * 70),
      drift: Math.round((r() - 0.5) * 120),
      spin: Math.round(120 + r() * 240) * (r() > 0.5 ? 1 : -1),
      // Мелкие лепестки размываем сильнее: они читаются как дальний план.
      blur: Math.round((opts.blur[0] + (1 - t) * (opts.blur[1] - opts.blur[0])) * 10) / 10,
      opacity:
        Math.round((opts.opacity[0] + r() * (opts.opacity[1] - opts.opacity[0])) * 100) / 100,
      fill: TINTS[Math.floor(r() * TINTS.length)],
      stillTop: Math.round(r() * 94),
      extra: i >= base,
    });
  }

  return out;
}

/** Дальний план: лежит под стеклянной панелью и просвечивает сквозь неё. */
const BACK = makePetals(20261006, 20, 7, {
  size: [11, 30],
  blur: [0, 2.6],
  opacity: [0.4, 0.78],
});

/** Передний план: крупнее и сильно размыт — только ощущение глубины. */
const FRONT = makePetals(77400312, 5, 2, {
  size: [26, 44],
  blur: [3.4, 6],
  opacity: [0.16, 0.3],
});

function PetalSvg({ petal }: { petal: Petal }) {
  const style = {
    left: `${petal.left}%`,
    width: `${petal.size}px`,
    height: `${Math.round(petal.size * 1.34)}px`,
    opacity: petal.opacity,
    filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
    '--dur': `${petal.duration}s`,
    '--delay': `${petal.delay}s`,
    '--drift': `${petal.drift}px`,
    '--spin': `${petal.spin}deg`,
    '--still-top': `${petal.stillTop}%`,
  } as React.CSSProperties;

  return (
    <svg
      className={`petal${petal.extra ? ' petal-extra' : ''}`}
      viewBox="0 0 24 32"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 0.6 C19.8 8.2 22.4 18.6 12 31.4 C1.6 18.6 4.2 8.2 12 0.6 Z"
        fill={petal.fill}
      />
      {/* Едва заметный сгиб: лепесток не выглядит плоским пятном */}
      <path
        d="M12 2.4 C16.4 9.4 17.6 19.2 12 29"
        stroke="#0f3d2b"
        strokeOpacity="0.09"
        strokeWidth="0.9"
        fill="none"
      />
    </svg>
  );
}

/**
 * Парящие лепестки на фоне страницы.
 *
 * Слой фиксирован к экрану: лепестки не уезжают вместе с прокруткой и
 * одинаково работают в обычном и покадровом режимах. Дальний слой лежит
 * под стеклянной панелью (её backdrop-filter его размывает), передний —
 * поверх, но настолько размыт и прозрачен, что текст остаётся читаемым.
 *
 * При prefers-reduced-motion лепестки замирают на своих местах.
 */
export function Petals() {
  const reduced = useReducedMotion();
  const still = reduced ? ' petals-still' : '';

  return (
    <>
      <div className={`petals${still}`} aria-hidden="true">
        {BACK.map((petal, i) => (
          <PetalSvg key={i} petal={petal} />
        ))}
      </div>
      <div className={`petals petals-front${still}`} aria-hidden="true">
        {FRONT.map((petal, i) => (
          <PetalSvg key={i} petal={petal} />
        ))}
      </div>
    </>
  );
}
