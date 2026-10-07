import { posters } from './config';
import { useT } from '../i18n/context';

/**
 * Статичный постер вместо живой сцены: узкий экран, prefers-reduced-motion
 * или недоступный WebGL. Пока в конфиге нет картинки — рисуем лёгкий SVG,
 * он весит меньше килобайта и не требует загрузки.
 */
export function HeroPoster() {
  const t = useT();

  if (posters.hero) {
    return (
      <img
        src={posters.hero}
        alt={t.heroPoster.alt}
        width={520}
        height={520}
        decoding="async"
        className="aspect-square w-full rounded-full object-cover"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 520 520"
      className="aspect-square w-full"
      role="img"
      aria-label={t.heroPoster.alt}
    >
      <defs>
        <radialGradient id="poster-bg" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F2F8F4" />
          <stop offset="100%" stopColor="#BFE3CF" />
        </radialGradient>
        <linearGradient id="poster-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#BFE3CF" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <circle cx="260" cy="260" r="258" fill="url(#poster-bg)" />

      {/* Баночки */}
      <g stroke="#1E7A57" strokeWidth="2.5" fill="url(#poster-glass)">
        <path d="M150 215 a62 62 0 1 0 124 0 c0-26-14-34-14-48 h-96 c0 14-14 22-14 48 Z" />
        <rect x="144" y="156" width="136" height="13" rx="6.5" />
        <path d="M296 300 a44 44 0 1 0 88 0 c0-18-10-24-10-34 h-68 c0 10-10 16-10 34 Z" />
        <rect x="292" y="258" width="96" height="10" rx="5" />
      </g>

      {/* Моксо-стик с огоньком */}
      <g>
        <rect
          x="110"
          y="330"
          width="150"
          height="30"
          rx="13"
          fill="#B5B58A"
          stroke="#8A9A6B"
          strokeWidth="2"
        />
        <circle cx="260" cy="345" r="13" fill="#4A4A44" />
        <circle cx="260" cy="345" r="7" fill="#FF8A2A" />
        <path
          d="M262 325 c8-14 -8-20 2-34 c8-12 -4-18 2-28"
          stroke="#FFFFFF"
          strokeOpacity="0.8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Иглы в камне */}
      <g stroke="#9AA4AC" strokeWidth="3" strokeLinecap="round">
        <path d="M352 400 L330 318" />
        <path d="M362 400 L356 312" />
        <path d="M372 400 L382 318" />
      </g>
      <g fill="#C9D0D6">
        <circle cx="329" cy="312" r="6" />
        <circle cx="356" cy="306" r="6" />
        <circle cx="383" cy="312" r="6" />
      </g>

      {/* Камни */}
      <ellipse cx="362" cy="408" rx="52" ry="19" fill="#8FC9A4" />
      <ellipse cx="362" cy="403" rx="52" ry="18" fill="#A6D4B6" />
      <ellipse cx="166" cy="404" rx="44" ry="16" fill="#8FC9A4" />
      <ellipse cx="166" cy="399" rx="44" ry="15" fill="#BFE3CF" />
    </svg>
  );
}
