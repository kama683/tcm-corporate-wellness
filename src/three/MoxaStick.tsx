import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lights, palette } from "./config";
import { moxaTextures, smokeTexture } from "./textures";

const R = 0.085;
/** Длина примерно в 6 диаметров. */
const LEN = R * 2 * 6;

/**
 * Профиль стика: прямой цилиндр со слегка скруглёнными торцами.
 * Через Lathe, потому что CapsuleGeometry даёт полусферы — слишком круглые.
 */
function stickGeometry(): THREE.LatheGeometry {
  const half = LEN / 2;
  const fillet = R * 0.28;
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0, -half),
    new THREE.Vector2(R - fillet, -half),
    new THREE.Vector2(R - fillet * 0.3, -half + fillet * 0.45),
    new THREE.Vector2(R, -half + fillet),
    new THREE.Vector2(R, half - fillet),
    new THREE.Vector2(R - fillet * 0.3, half - fillet * 0.45),
    new THREE.Vector2(R - fillet, half),
    new THREE.Vector2(0, half),
  ];
  return new THREE.LatheGeometry(pts, 48);
}

/** Спиральная бумажная обмотка у одного конца. */
function wrapGeometry(): THREE.TubeGeometry {
  const turns = 4;
  const steps = turns * 20;
  const from = -LEN / 2 + R * 0.5;
  const to = from + LEN * 0.32;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * (R * 1.02),
        from + (to - from) * t,
        Math.sin(angle) * (R * 1.02),
      ),
    );
  }
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts),
    steps,
    R * 0.055,
    5,
    false,
  );
}

const SMOKE_COUNT = 48;
/** Докуда поднимается частица за свою жизнь, в мировых единицах. */
const SMOKE_RISE = 4.3;
/**
 * Скорость одна на все частицы. При разных скоростях фазы со временем
 * сбиваются, и ровный столб распадается на комки; при общей скорости
 * клубы идут равномерно и поток выглядит непрерывным.
 */
const SMOKE_SPEED = 0.1;

/**
 * Дымок: мягкие спрайты, которые поднимаются, уводятся вбок и тают.
 *
 * Источник работает непрерывно: время жизни частиц равномерно сдвинуто по
 * фазе, поэтому новые появляются ровно по мере растворения старых и эффект
 * не «перезапускается» заметным рывком. Прозрачность гаснет до нуля к концу
 * жизни, так что дым не упирается в границу кадра, а рассеивается.
 */
function SmokePlume({ origin }: { origin: [number, number, number] }) {
  const map = useMemo(() => smokeTexture(), []);
  const group = useRef<THREE.Group>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: SMOKE_COUNT }, (_, i) => ({
        // Равномерный сдвиг фазы + небольшой разброс: поток без пульсации
        offset: i / SMOKE_COUNT,
        drift: 0.6 + ((i * 29) % 11) / 11,
        swirl: ((i * 53) % 13) / 13 - 0.5,
        tilt: (((i * 41) % 15) / 15 - 0.5) * 0.5,
        // Разный базовый размер: поток не выглядит цепочкой одинаковых клубов
        size: 0.75 + ((i * 23) % 13) / 26,
      })),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    g.children.forEach((child, i) => {
      const s = seeds[i];
      const life = (t * SMOKE_SPEED + s.offset) % 1;

      // Подъём замедляется кверху: дым «повисает», растворяясь
      const rise = Math.pow(life, 0.78) * SMOKE_RISE;
      // Изгиб усиливается с высотой
      const sway = life * life;
      child.position.set(
        (Math.sin(life * 3.4 + s.drift * 6) * 0.72 + s.tilt * 1.6) * sway * s.drift,
        rise,
        Math.cos(life * 2.6 + s.drift * 4) * 0.5 * sway + s.swirl * sway * 0.7,
      );

      // Чем выше, тем шире и разрежённее
      const spread = (0.14 + Math.pow(life, 0.72) * 1.45) * s.size;
      child.scale.setScalar(spread);

      const sprite = child as THREE.Sprite;
      const appear = Math.min(1, life / 0.07);
      const vanish = Math.pow(1 - life, 1.15);
      (sprite.material as THREE.SpriteMaterial).opacity = appear * vanish * 0.5;
    });
  });

  return (
    <group ref={group} position={origin}>
      {seeds.map((_, i) => (
        <sprite key={i}>
          <spriteMaterial
            map={map}
            transparent
            opacity={0}
            depthWrite={false}
            color="#A8BBB0"
          />
        </sprite>
      ))}
    </group>
  );
}

/**
 * Моксо-стик: скрутка полыни с бумажной обмоткой, тлеющий кончик
 * и поднимающийся дымок. Единственное тёплое пятно во всей сцене.
 */
export function MoxaStick({
  position,
  rotation,
  scale = 1,
  smoke = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** На слабых устройствах дым отключаем. */
  smoke?: boolean;
}) {
  const body = useMemo(() => stickGeometry(), []);
  const wrap = useMemo(() => wrapGeometry(), []);
  const { map, rough } = useMemo(() => moxaTextures(), []);
  const emberRef = useRef<THREE.PointLight>(null);

  // Огонёк слегка «дышит»
  useFrame((state) => {
    if (!emberRef.current) return;
    const t = state.clock.elapsedTime;
    emberRef.current.intensity =
      lights.emberIntensity *
      (0.78 + Math.sin(t * 2.3) * 0.12 + Math.sin(t * 5.7) * 0.06);
  });

  const tipY = LEN / 2;

  /**
   * Куда уехал тлеющий торец после поворота стика. Дым рендерим рядом,
   * а не внутри повёрнутой группы: иначе он поднимался бы вдоль наклонённой
   * оси стика, а не вверх.
   */
  const smokeOrigin = useMemo(() => {
    const v = new THREE.Vector3(0, tipY + 0.05, 0);
    if (rotation)
      v.applyEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]));
    // Масштаб стика учитываем вручную: сам дым не масштабируем, иначе
    // крупный стик разогнал бы столб дыма далеко за пределы кадра.
    v.multiplyScalar(scale);
    return [v.x, v.y, v.z] as [number, number, number];
  }, [rotation, tipY, scale]);

  return (
    <group position={position}>
      <group rotation={rotation} scale={scale}>
        <mesh geometry={body} castShadow>
          <meshStandardMaterial
            map={map}
            roughnessMap={rough}
            bumpMap={rough}
            bumpScale={0.6}
            color="#FFFFFF"
            roughness={0.95}
            metalness={0}
          />
        </mesh>

        {/* Бумажная обмотка */}
        <mesh geometry={wrap} castShadow>
          <meshStandardMaterial color="#E8E4D2" roughness={0.8} />
        </mesh>

        {/* Пепел на торце */}
        <mesh position={[0, tipY + 0.004, 0]}>
          <cylinderGeometry args={[R * 0.97, R * 0.93, 0.02, 32]} />
          <meshStandardMaterial color={palette.ash} roughness={1} />
        </mesh>

        {/* Тлеющий центр */}
        <mesh position={[0, tipY + 0.016, 0]}>
          <circleGeometry args={[R * 0.6, 28]} />
          <meshStandardMaterial
            color={palette.ember}
            emissive={palette.ember}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          ref={emberRef}
          position={[0, tipY + 0.06, 0]}
          color={palette.ember}
          intensity={lights.emberIntensity}
          distance={lights.emberDistance}
          decay={2}
        />
      </group>

      {smoke ? <SmokePlume origin={smokeOrigin} /> : null}
    </group>
  );
}
