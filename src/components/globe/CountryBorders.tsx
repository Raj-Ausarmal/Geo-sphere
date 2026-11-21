
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  features,
  linesFor,
  lonLatToVector,
  polygonsFor,
} from './geo';

function filledCountryGeometry(rings: number[][][], radius = 2.025) {
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
      radius
    );

    position.setXYZ(i, point.x, point.y, point.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

function createCountryLineGeometry(
  country: typeof features[number],
  radius = 2.045
) {
  const points: number[] = [];

  linesFor(country).forEach(ring => {
    const vertices = ring.map(([lon, lat]) =>
      lonLatToVector(lon, lat, radius)
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
  // All country borders
  const geometry = useMemo(() => {
    const points: number[] = [];

    features.forEach(country => {
      linesFor(country).forEach(ring => {
        const vertices = ring.map(([lon, lat]) =>
          lonLatToVector(lon, lat, 2.045)
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

  // White land
  const landFills = useMemo(
    () =>
      features.flatMap(country =>
        polygonsFor(country).map(polygon =>
          filledCountryGeometry(polygon, 2.025)
        )
      ),
    []
  );

  const selected = useMemo(
    () => features.find(country => Number(country.id) === highlight),
    [highlight]
  );

  const hoveredCountry = useMemo(
    () => features.find(country => Number(country.id) === hovered),
    [hovered]
  );

  const selectedFills = useMemo(
    () =>
      selected
        ? polygonsFor(selected).map(polygon =>
            filledCountryGeometry(polygon, 2.035)
          )
        : [],
    [selected]
  );

  const hoveredFills = useMemo(
    () =>
      hoveredCountry && Number(hoveredCountry.id) !== highlight
        ? polygonsFor(hoveredCountry).map(polygon =>
            filledCountryGeometry(polygon, 2.032)
          )
        : [],
    [hoveredCountry, highlight]
  );

  const selectedLines = useMemo(
    () => selected ? createCountryLineGeometry(selected, 2.05) : null,
    [selected]
  );

  return (
    <>
      {/* White land */}
      {landFills.map((fill, index) => (
        <mesh key={`land-${index}`} geometry={fill} renderOrder={1}>
          <meshBasicMaterial
            color="#FFFFFF"
            side={THREE.DoubleSide}
            depthWrite={true}
          />
        </mesh>
      ))}

      {/* Country separating borders */}
      <lineSegments geometry={geometry} renderOrder={2}>
        <lineBasicMaterial
          color="#244B70"
          transparent
          opacity={1}
          depthTest={false}
        />
      </lineSegments>

      {/* Hover highlight */}
      {hoveredFills.map((fill, index) => (
        <mesh key={`hover-${index}`} geometry={fill} renderOrder={3}>
          <meshBasicMaterial
            color="#63D6C5"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}

      {/* Selected country */}
      {selectedFills.map((fill, index) => (
        <mesh key={`selected-${index}`} geometry={fill} renderOrder={4}>
          <meshBasicMaterial
            color="#F3C66A"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}

      {selectedLines && (
        <lineSegments geometry={selectedLines} renderOrder={5}>
          <lineBasicMaterial
            color="#FFF0A6"
            linewidth={2}
            depthTest={false}
          />
        </lineSegments>
      )}
    </>
  );
}
