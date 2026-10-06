import { useMemo } from 'react';
import * as THREE from 'three';
import { glass } from './config';

export type JarSize = 'small' | 'medium' | 'large';

const SIZES: Record<JarSize, number> = {
  small: 0.72,
  medium: 1,
  large: 1.24,
};

/**
 * Профиль баночки для LatheGeometry.
 *
 * Контур замкнутый: идём по внешней стороне снизу вверх, переваливаем через
 * толстый скруглённый обод и возвращаемся вниз по внутренней. За счёт этого
 * у стекла настоящая толщина, а не плёнка в один слой — иначе преломление
 * выглядит пустым.
 */
function jarProfile(): THREE.Vector2[] {
  const outer: [number, number][] = [
    [0.0, 0.0],
    [0.16, 0.0],
    [0.28, 0.008], // небольшое кольцо, на котором баночка стоит
    [0.4, 0.045],
    [0.49, 0.14],
    [0.53, 0.3], // самая широкая часть — шар
    [0.5, 0.46],
    [0.41, 0.6],
    [0.32, 0.71],
    [0.285, 0.8], // горловина
    [0.285, 0.86],
    [0.315, 0.91], // обод: утолщение наружу
    [0.315, 0.955],
    [0.28, 0.985], // скруглённая макушка обода
  ];
  const inner: [number, number][] = [
    [0.235, 0.955],
    [0.225, 0.9],
    [0.235, 0.8],
    [0.265, 0.71],
    [0.35, 0.6],
    [0.43, 0.46],
    [0.455, 0.3],
    [0.415, 0.14],
    [0.33, 0.06],
    [0.16, 0.035],
    [0.0, 0.035],
  ];

  const toCurve = (pts: [number, number][], samples: number) =>
    new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y)))
      .getPoints(samples);

  return [...toCurve(outer, 90), ...toCurve(inner, 70)];
}

/**
 * Стеклянная баночка для купинга: шарообразное тело, короткая горловина,
 * толстый скруглённый обод вокруг отверстия.
 */
export function CuppingJar({
  size = 'medium',
  position,
  rotation,
  scale = 1,
}: {
  size?: JarSize;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(jarProfile(), 64);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={SIZES[size] * scale}
      castShadow
    >
      {/* Один общий проход преломления на всю сцену: MeshTransmissionMaterial
          рендерит сцену заново на каждую баночку и не тянет по скорости. */}
      <meshPhysicalMaterial
        transmission={glass.transmission}
        thickness={glass.thickness}
        ior={glass.ior}
        roughness={glass.roughness}
        attenuationColor={glass.attenuationColor}
        attenuationDistance={glass.attenuationDistance}
        clearcoat={glass.clearcoat}
        clearcoatRoughness={0.03}
        envMapIntensity={glass.envMapIntensity}
        specularIntensity={1}
        color="#ffffff"
        side={THREE.DoubleSide}
        transparent={false}
      />
    </mesh>
  );
}
