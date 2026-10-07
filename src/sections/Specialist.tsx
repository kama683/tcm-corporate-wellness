import { useRef, useState } from 'react';
import { Play, User } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { Eyebrow, H2, Lead, sectionPad } from '../components/ui';
import { specialist } from '../site.config';
import { useT } from '../i18n/context';
import type { Dict } from '../i18n/types';

/**
 * Вертикальный плеер 9:16. До запуска — постер и круглая кнопка play;
 * после нажатия появляются стандартные controls. Без автозапуска и звука.
 */
function VideoPlayer({
  src,
  poster,
  t,
}: {
  src: string;
  poster: string | null;
  t: Dict['specialist'];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    // Звук включает сам пользователь через controls
    void ref.current?.play();
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[20px] bg-mist">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        controls={started}
        preload="metadata"
        playsInline
        poster={poster ?? undefined}
        src={src}
        aria-label={t.videoAria}
      />
      {started ? null : (
        <button
          type="button"
          onClick={start}
          aria-label={t.playAria}
          className="absolute inset-0 flex items-center justify-center bg-bamboo-dark/10 transition-colors hover:bg-bamboo-dark/20"
        >
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-jade shadow-[0_10px_30px_rgba(15,61,43,0.22)] transition-transform duration-300 hover:scale-105 motion-reduce:transform-none">
            <Play
              size={30}
              fill="#0F3D2B"
              stroke="#0F3D2B"
              className="translate-x-0.5"
            />
          </span>
        </button>
      )}
    </div>
  );
}

function VideoSlot({ t }: { t: Dict['specialist'] }) {
  if (specialist.video) {
    return (
      <VideoPlayer src={specialist.video} poster={specialist.videoPoster} t={t} />
    );
  }

  return (
    <div className="relative box-border flex aspect-[9/16] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] border-[1.5px] border-dashed border-green bg-[linear-gradient(170deg,#BFE3CF_0%,#F2F8F4_60%,#FFFFFF_100%)]">
      <svg
        viewBox="0 0 300 160"
        preserveAspectRatio="none"
        width="100%"
        height="140"
        className="absolute inset-x-0 bottom-0 block"
        aria-hidden="true"
      >
        <path
          d="M0 160 L0 90 C50 50 90 80 140 40 C190 0 230 60 300 30 L300 160 Z"
          fill="#1E7A57"
          fillOpacity="0.1"
        />
        <path
          d="M0 160 L0 120 C60 90 110 130 170 100 C220 76 260 110 300 90 L300 160 Z"
          fill="#1E7A57"
          fillOpacity="0.16"
        />
      </svg>
      <div className="absolute left-[18px] top-[18px] rounded-full bg-white px-3 py-1.5 text-xs font-semibold tracking-[0.06em] text-green">
        {t.videoBadge}
      </div>
      <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(15,61,43,0.18)]">
        <Play size={28} fill="#1E7A57" stroke="#1E7A57" />
      </div>
      <div className="relative px-6 text-center text-sm leading-[1.5] text-bamboo-dark">
        {t.videoPlaceholder}
      </div>
    </div>
  );
}

function PhotoSlot({ t }: { t: Dict['specialist'] }) {
  if (specialist.photo) {
    // Фон у портрета прозрачный: мятная подложка держит форму арки.
    return (
      <img
        src={specialist.photo}
        alt={specialist.name}
        width={450}
        height={570}
        loading="lazy"
        decoding="async"
        className="h-[190px] w-[150px] flex-none rounded-t-full rounded-b-3xl bg-mist object-cover object-top"
      />
    );
  }

  return (
    <div className="box-border flex h-[190px] w-[150px] flex-none flex-col items-center justify-center gap-2 rounded-t-full rounded-b-3xl border-[1.5px] border-dashed border-green bg-mist">
      <User size={52} strokeWidth={1.6} className="text-green" />
      <span className="text-xs font-semibold text-green">{t.photoLabel}</span>
    </div>
  );
}

export function Specialist() {
  const t = useT();

  return (
    <section className={sectionPad}>
      <Reveal>
        <Eyebrow>{t.specialist.eyebrow}</Eyebrow>
        <H2 className="mb-4">{t.specialist.title}</H2>
        <Lead className="mb-11">{t.specialist.lead}</Lead>
      </Reveal>

      <Reveal className="flex flex-wrap items-center gap-8 md:gap-12">
        <div className="w-full max-w-[300px] flex-none self-center">
          <VideoSlot t={t.specialist} />
        </div>

        <div className="box-border min-w-0 flex-[1_1_420px] rounded-[28px] border border-line bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-7">
            <PhotoSlot t={t.specialist} />
            <div className="min-w-0 flex-[1_1_220px]">
              <h3 className="m-0 mb-2 font-display text-[34px] font-semibold leading-[1.05] text-bamboo-dark md:text-[40px]">
                {specialist.name}
              </h3>
              <p className="m-0 mb-3.5 text-base leading-[1.5] text-ink-soft">
                {t.specialist.role}
              </p>
              <span className="inline-block rounded-full bg-mist px-3.5 py-2 text-[13px] font-semibold text-green">
                {t.specialist.level}
              </span>
            </div>
          </div>

          <dl className="m-0 mt-6 border-t border-line">
            {t.specialist.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-wrap gap-x-6 gap-y-1.5 border-b border-line py-4"
              >
                <dt className="flex-[0_0_140px] text-sm text-ink-soft">
                  {fact.label}
                </dt>
                <dd className="m-0 flex-[1_1_220px] text-[15px] leading-[1.5] text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
