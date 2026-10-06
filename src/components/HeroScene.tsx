import { Suspense, lazy } from 'react';
import { HeroPoster } from '../three/HeroPoster';
import { useSceneActivity } from '../three/useSceneActivity';
import { canvasOverflow } from '../three/config';

/**
 * three и вся 3D-часть грузятся отдельным чанком и только тогда,
 * когда сцену действительно показываем.
 */
const HeroScene3D = lazy(() => import('../three/HeroScene3D'));

const overflowStyle = {
  left: `${-canvasOverflow.x * 100}%`,
  right: `${-canvasOverflow.x * 100}%`,
  top: `${-canvasOverflow.y * 100}%`,
  bottom: `${-canvasOverflow.y * 100}%`,
};

/**
 * Слот под 3D-сцену в hero.
 *
 * Живая сцена — на экранах от 768 px при доступном WebGL и без
 * prefers-reduced-motion. На телефоне сцена остаётся, но облегчённая:
 * без дыма и без реакции на курсор. Если WebGL нет — статичный постер.
 *
 * Холст выходит за своё место в вёрстке, чтобы дыму было куда подниматься;
 * он не ловит события, поэтому текст рядом остаётся выделяемым.
 */
export function HeroScene() {
  const { live, visible, frameloop, ref } = useSceneActivity({
    allowNarrow: true,
  });

  const narrow =
    typeof window !== 'undefined' &&
    !window.matchMedia('(min-width: 768px)').matches;

  return (
    <div ref={ref} className="relative aspect-[5/6] w-full max-w-[560px]">
      {live && visible ? (
        <Suspense fallback={<HeroPoster />}>
          <div className="pointer-events-none absolute" style={overflowStyle}>
            <div className="h-full w-full">
              <HeroScene3D
                interactive={!narrow}
                smoke={!narrow}
                frameloop={frameloop}
              />
            </div>
          </div>
        </Suspense>
      ) : (
        <HeroPoster />
      )}
    </div>
  );
}
