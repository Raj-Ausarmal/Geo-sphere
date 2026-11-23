
import { useMemo } from 'react';
import * as THREE from 'three';
import { features, linesFor, lonLatToVector } from './geo';

export function CountryBorders({
  highlight,
  hovered,
}: {
  highlight?: number;
  hovered?: number;
}) {
  const geometry = useMemo(() => {
    const points: number[] = [];

    features.forEach(country => {
      linesFor(country).forEach(ring => {
        const vertices = ring.map(([lon, lat]) =>
          lonLatToVector(lon, lat, 2.035)
        );

        for (let i = 1; i < vertices.length; i++) {
          points.push(
            ...vertices[i - 1].toArray(),
            ...vertices[i].toArray()
          );
        }
      });
    });

    const result = new THREE.BufferGeometry();
    result.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(points, 3)
    );

    return result;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#244B70"
        depthTest
        transparent
        opacity={1}
      />
    </lineSegments>
  );
}
