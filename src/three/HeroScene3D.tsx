import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import {
  canvasOverflow,
  lights,
  motion3d,
  palette,
  quality,
  sceneBounds,
} from './config';
import { CuppingJar } from './CuppingJar';
import { MoxaStick } from './MoxaStick';
import { NeedleFan } from './NeedleFan';
import { Stone, StonePair } from './Stone';

/**
 * Параллакс за курсором: вся сцена доворачивается не более чем на ±8°.
 *
 * Положение указателя берём с окна, а не с холста: холст не ловит события,
 * чтобы не мешать выделению текста рядом. Движение сглажено и дополняет
 * постоянное парение — после ухода курсора сцена плавно возвращается.
 */
function CursorParallax({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const max = THREE.MathUtils.degToRad(motion3d.heroTiltDeg);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Курсор ушёл со страницы — спокойно возвращаемся в исходное положение
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !enabled) return;
    const { x, y } = target.current;
    const k = 1 - Math.pow(0.0015, delta); // сглаживание, не зависящее от fps
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * max, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * max * 0.6, k);
    g.position.x = THREE.MathUtils.lerp(g.position.x, x * 0.12, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, -y * 0.08, k);
  });

  return <group ref={group}>{children}</group>;
}

/** Тона HDR-окружения: мягкий светло-зелёный свет вокруг сцены. */
function JadeEnvironment() {
  return (
    <Environment resolution={256}>
      {/* Широкая верхняя панель: основной мягкий блик на стекле */}
      <Lightformer
        intensity={3.2}
        color="#FFFFFF"
        position={[0, 5, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[12, 12, 1]}
      />
      {/* Узкие полосы: дают стеклу читаемые рёбра бликов */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#FFFFFF"
        position={[-3, 2, 3]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[1.5, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3}
        color="#FFFFFF"
        position={[3.5, 1, 3]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[1.2, 7, 1]}
      />
      {/* Нефритовая подсветка сбоку и сзади */}
      <Lightformer
        intensity={2}
        color={palette.jadeLight}
        position={[-5, 1, -2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[8, 8, 1]}
      />
      <Lightformer
        intensity={1.4}
        color={palette.mist}
        position={[5, 0, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[6, 6, 1]}
      />
    </Environment>
  );
}

function Composition({ smoke }: { smoke: boolean }) {
  return (
    <>
      {/* ВЕРХНИЙ РЯД — только баночки. Разная высота и поворот, между
          соседями оставлен зазор, которого хватает и при покачивании. */}
      <Float speed={1.15} rotationIntensity={0.35} floatIntensity={3.2}>
        <CuppingJar
          size="small"
          scale={1.2}
          position={[-1.85, 2.05, -0.3]}
          rotation={[0.26, 0.8, 0.2]}
        />
      </Float>
      <Float speed={0.85} rotationIntensity={0.28} floatIntensity={4.2}>
        <CuppingJar
          size="large"
          scale={1.2}
          position={[0, 1.45, -0.05]}
          rotation={[0.16, -0.3, -0.1]}
        />
      </Float>
      <Float speed={1.45} rotationIntensity={0.32} floatIntensity={2.6}>
        <CuppingJar
          size="medium"
          scale={1.2}
          position={[1.75, 1.7, -0.25]}
          rotation={[-0.2, 0.45, 0.16]}
        />
      </Float>

      {/* СРЕДНИЙ РЯД — только камни */}
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={3.6}>
        <Stone
          seed={13}
          scale={0.7}
          position={[-1.6, 0, 0.2]}
          rotation={[-0.06, -0.5, 0.12]}
        />
      </Float>
      <Float speed={1.05} rotationIntensity={0.5} floatIntensity={3.6}>
        <StonePair position={[-0.05, -0.1, -0.2]} scale={1} />
      </Float>
      <Float speed={1.9} rotationIntensity={0.7} floatIntensity={3} >
        <Stone
          seed={29}
          scale={0.55}
          position={[1.9, 0.12, -0.4]}
          rotation={[0.1, 0.6, -0.14]}
        />
      </Float>

      {/* НИЖНИЙ РЯД — иглы и моксо-стик */}
      <Float speed={1.25} rotationIntensity={0.16} floatIntensity={2.4}>
        <MoxaStick
          position={[-1.5, -2.3, 0.35]}
          rotation={[0, 0, -(Math.PI / 2 - 0.5)]}
          scale={1.6}
          smoke={smoke}
        />
      </Float>
      <Float speed={0.95} rotationIntensity={0.2} floatIntensity={2.2}>
        <NeedleFan
          position={[1.75, -2.7, 0.05]}
          scale={2}
          withStone={false}
        />
      </Float>

      <ContactShadows
        position={[0, -3.2, 0]}
        opacity={0.16}
        scale={8}
        blur={3.8}
        far={2.8}
        resolution={512}
        color={palette.bambooDark}
      />
    </>
  );
}

/**
 * Вписывает композицию в кадр.
 *
 * Холст больше своего места в вёрстке (canvasOverflow), поэтому видимая
 * область должна быть во столько же раз больше самой композиции — иначе
 * предметы уедут к центру и запас под дым съест полкадра.
 */
function ResponsiveCamera() {
  const { camera, size } = useThree();

  const aspect = size.width / Math.max(1, size.height);
  const halfFov = THREE.MathUtils.degToRad(30 / 2);

  const visibleHalfH = sceneBounds.halfHeight * (1 + 2 * canvasOverflow.y);
  const visibleHalfW = sceneBounds.halfWidth * (1 + 2 * canvasOverflow.x);

  // Берём большее из двух расстояний: так композиция влезает и по высоте,
  // и по ширине на любом соотношении сторон.
  const distV = visibleHalfH / Math.tan(halfFov);
  const distH = visibleHalfW / (Math.tan(halfFov) * aspect);
  const distance = Math.max(distV, distH);

  camera.position.set(0, sceneBounds.centerY, distance);
  camera.lookAt(0, sceneBounds.centerY, 0);
  camera.updateProjectionMatrix();

  return null;
}

export default function HeroScene3D({
  interactive = true,
  smoke = true,
  frameloop = 'always',
}: {
  interactive?: boolean;
  smoke?: boolean;
  frameloop?: 'always' | 'never' | 'demand';
}) {
  return (
    <Canvas
      gl={{
        alpha: true,
        antialias: quality.antialias,
        powerPreference: 'high-performance',
      }}
      dpr={quality.dpr}
      frameloop={frameloop}
      camera={{ fov: 30, position: [0, sceneBounds.centerY, 15] }}
      style={{ background: 'transparent' }}
      shadows={false}
    >
      <ResponsiveCamera />

      <ambientLight intensity={lights.ambientIntensity} />
      {/* Тёплый ключевой */}
      <directionalLight
        position={[3, 4, 3]}
        intensity={lights.keyIntensity}
        color={lights.keyColor}
      />
      {/* Мятный контровой */}
      <directionalLight
        position={[-4, 1.5, -3]}
        intensity={lights.rimIntensity}
        color={lights.rimColor}
      />
      {/* Мягкая заполняющая сверху */}
      <hemisphereLight
        intensity={lights.fillIntensity}
        color={lights.fillColor}
        groundColor={palette.mist}
      />

      <JadeEnvironment />

      <CursorParallax enabled={interactive}>
        <Composition smoke={smoke} />
      </CursorParallax>
    </Canvas>
  );
}
