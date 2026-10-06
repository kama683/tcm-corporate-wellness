import { useMemo } from 'react';
import * as THREE from 'three';
import { steel } from './config';
import { Stone } from './Stone';

const HANDLE_R = 0.035;
const HANDLE_LEN = 0.34;
/** Стержень примерно в 8 диаметров ручки. */
const SHAFT_LEN = HANDLE_R * 2 * 8;
const TIP_LEN = HANDLE_R * 0.9;

/** Спираль намотки ручки: трубка, навитая на цилиндр. */
function coilGeometry(): THREE.TubeGeometry {
  const turns = 16;
  const steps = turns * 12;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * HANDLE_R,
        t * HANDLE_LEN,
        Math.sin(angle) * HANDLE_R,
      ),
    );
  }
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(pts),
    steps,
    HANDLE_R * 0.22,
    6,
    false,
  );
}

function Needle({ angleDeg }: { angleDeg: number }) {
  const coil = useMemo(() => coilGeometry(), []);

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(angleDeg)]}>
      {/* Стержень уходит вниз, в камень; книзу сужается */}
      <mesh position={[0, -SHAFT_LEN / 2, 0]} castShadow>
        <cylinderGeometry
          args={[HANDLE_R * 0.17, HANDLE_R * 0.1, SHAFT_LEN, 12]}
        />
        <meshStandardMaterial color="#D9DEE2" {...steel} />
      </mesh>
      {/* Заострённое остриё */}
      <mesh position={[0, -SHAFT_LEN - TIP_LEN / 2, 0]} castShadow>
        <coneGeometry args={[HANDLE_R * 0.1, TIP_LEN, 12]} />
        <meshStandardMaterial color="#D9DEE2" {...steel} />
      </mesh>
      {/* Ручка: плотная спираль */}
      <mesh geometry={coil} castShadow>
        <meshStandardMaterial color="#C9D0D6" {...steel} roughness={0.32} />
      </mesh>
      {/* Шарик на конце ручки */}
      <mesh position={[0, HANDLE_LEN + HANDLE_R * 0.5, 0]} castShadow>
        <sphereGeometry args={[HANDLE_R * 0.78, 20, 16]} />
        <meshStandardMaterial color="#D9DEE2" {...steel} roughness={0.18} />
      </mesh>
    </group>
  );
}

/**
 * Веер из пяти игл, воткнутых в нефритовый камень.
 * Шаг между иглами — 12°.
 */
export function NeedleFan({
  position,
  rotation,
  scale = 1,
  withStone = true,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  withStone?: boolean;
}) {
  const angles = [-24, -12, 0, 12, 24];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {withStone ? <Stone seed={5} scale={0.38} /> : null}
      <group position={[0, 0.5, 0]}>
        {angles.map((a) => (
          <Needle key={a} angleDeg={a} />
        ))}
      </group>
    </group>
  );
}
