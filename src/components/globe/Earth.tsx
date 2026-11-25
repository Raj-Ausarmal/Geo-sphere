
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import { featureAt } from './geo';
import { createGeoTexture } from './geoTexture';

import {
  GlobeControls,
  type GlobeControlsHandle,
} from './GlobeControls';

type EarthProps = {
  highlight?: number;
  onCountry?: (id: number) => void;
  reset: number;
};

export const Earth = forwardRef<GlobeControlsHandle, EarthProps>(
  function Earth({ highlight, onCountry, reset }, ref) {
    const [hovered, setHovered] = useState<number | undefined>();
    const geoTexture = useMemo(
      () => createGeoTexture(highlight ?? hovered),
      [highlight, hovered]
    );

    useEffect(() => () => geoTexture.dispose(), [geoTexture]);

    const getCountry = (
      e: ThreeEvent<MouseEvent | PointerEvent>
    ) => {
      const p = e.point.clone().normalize();

      const lat = THREE.MathUtils.radToDeg(Math.asin(p.y));

      const lon =
        THREE.MathUtils.radToDeg(
          Math.atan2(p.z, -p.x)
        ) - 180;

      return featureAt(((lon + 540) % 360) - 180, lat);
    };

    const click = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      const country = getCountry(e);

      if (country) {
        onCountry?.(Number(country.id));
      }
    };

    const move = (e: ThreeEvent<PointerEvent>) => {
      const country = getCountry(e);

      setHovered(country ? Number(country.id) : undefined);

      document.body.style.cursor = country
        ? 'pointer'
        : 'default';
    };

    const leave = () => {
      setHovered(undefined);
      document.body.style.cursor = 'default';
    };

    return (
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#07182B']} />

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[-4, 3, 5]}
          intensity={2.2}
          color="#EAF6FF"
        />

        <Stars
          radius={90}
          depth={40}
          count={2500}
          factor={2}
          saturation={0}
        />

        {/* Natural Earth country texture: reliable at all longitudes/seams. */}
        <mesh
          onClick={click}
          onPointerMove={move}
          onPointerOut={leave}
        >
          <sphereGeometry args={[2, 128, 128]} />
          <meshStandardMaterial
            map={geoTexture}
            roughness={0.76}
            metalness={0.02}
          />
        </mesh>

        <GlobeControls
          ref={ref}
          reset={reset}
        />
      </Canvas>
    );
  }
);
