
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  features,
  linesFor,
  lonLatToVector,
  polygonsFor,
} from './geo';

function filledCountryGeometry(rings: number[][][]) {
  const shape = new THREE.Shape(
    rings[0].map(([lon, lat]) => new THREE.Vector2(lon, lat))
  );

  rings.slice(1).forEach(ring => {
    shape.holes.push(
      new THREE.Path(
        ring.map(([lon, lat]) => new THREE.Vector2(lon, lat))
      )
    );
  });

  const geometry = new THREE.ShapeGeometry(shape, 8);
  const position = geometry.getAttribute('position');

  for (let i = 0; i < position.count; i++) {
    const point = lonLatToVector(
      position.getX(i),
      position.getY(i),
      2.025
    );

    position.setXYZ(i, point.x, point.y, point.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

function createCountryLineGeometry(country: typeof features[number]) {
  const points: number[] = [];

  linesFor(country).forEach(ring => {
    const vertices = ring.map(([lon, lat]) =>
      lonLatToVector(lon, lat, 2.03)
    );

    for (let i = 1; i < vertices.length; i++) {
      points.push(
        ...vertices[i - 1].toArray(),
        ...vertices[i].toArray()
      );
    }
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(points, 3)
  );

  return geometry;
}

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
          lonLatToVector(lon, lat)
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

  const selected = useMemo(
    () => features.find(country => Number(country.id) === highlight),
    [highlight]
  );

  const hoveredCountry = useMemo(
    () => features.find(country => Number(country.id) === hovered),
    [hovered]
  );

  const selectedFills = useMemo(
    () => selected
      ? polygonsFor(selected).map(filledCountryGeometry)
      : [],
    [selected]
  );

  const hoveredFills = useMemo(
    () => hoveredCountry && Number(hoveredCountry.id) !== highlight
      ? polygonsFor(hoveredCountry).map(filledCountryGeometry)
      : [],
    [hoveredCountry, highlight]
  );

  const selectedLines = useMemo(
    () => selected ? createCountryLineGeometry(selected) : null,
    [selected]
  );

  return (
    <>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color="#789997"
          transparent
          opacity={0.72}
        />
      </lineSegments>

      {hoveredFills.map((fill, index) => (
        <mesh key={`hover-${index}`} geometry={fill}>
          <meshBasicMaterial
            color="#63d6c5"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {selectedFills.map((fill, index) => (
        <mesh key={`selected-${index}`} geometry={fill}>
          <meshBasicMaterial
            color="#f3c66a"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {selectedLines && (
        <lineSegments geometry={selectedLines}>
          <lineBasicMaterial
            color="#fff0a6"
            linewidth={2}
          />
        </lineSegments>
      )}
    </>
  );
}
