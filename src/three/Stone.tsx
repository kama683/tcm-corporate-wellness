import { useMemo } from 'react';
import * as THREE from 'three';
import { palette, stoneMaterial } from './config';
import { displaceGeometry, marbleTexture } from './textures';

/**
 * Гладкий нефритовый камень: сплюснутая сфера, вершины сбиты шумом,
 * чтобы форма была неровной, как речная галька.
 */
export function Stone({
  position,
  rotation,
  scale = 1,
  seed = 0,
  tint = '#FFFFFF',
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Разный seed — разная форма камня. */
  seed?: number;
  tint?: string;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 44);
    displaceGeometry(geo, 0.04, seed);
    geo.scale(1, 0.35, 0.8);
    return geo;
  }, [seed]);

  const map = useMemo(() => marbleTexture(), []);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        map={map}
        color={tint}
        roughness={stoneMaterial.roughness}
        clearcoat={stoneMaterial.clearcoat}
        clearcoatRoughness={0.25}
        transmission={stoneMaterial.transmission}
        thickness={0.6}
        sheen={stoneMaterial.sheen}
        sheenColor={palette.stoneLight}
        metalness={0}
      />
    </mesh>
  );
}

/** Два камня рядом — для заднего плана. */
export function StonePair({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <Stone seed={3} scale={0.5} rotation={[0, 0.4, 0.05]} />
      <Stone
        seed={7}
        scale={0.34}
        position={[0.62, -0.03, 0.18]}
        rotation={[0, -0.7, -0.04]}
        tint="#EAF6EE"
      />
    </group>
  );
}

/**
 * Стопка из трёх камней: крупный внизу, средний, малый сверху.
 * Каждый смещён и повёрнут, чтобы кладка выглядела естественно.
 */
export function StoneStack({
  position,
  rotation,
  scale = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stone seed={1} scale={1} position={[0, 0, 0]} rotation={[0, 0.2, 0.03]} />
      <Stone
        seed={11}
        scale={0.76}
        position={[0.07, 0.3, -0.04]}
        rotation={[0, -0.5, -0.05]}
        tint="#F2FAF5"
      />
      <Stone
        seed={23}
        scale={0.5}
        position={[-0.04, 0.52, 0.05]}
        rotation={[0, 0.9, 0.06]}
        tint="#EAF6EE"
      />
    </group>
  );
}
