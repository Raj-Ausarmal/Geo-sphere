
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { forwardRef } from 'react';
import * as THREE from 'three';

import { CountryBorders } from './CountryBorders';
import { Atmosphere } from './Atmosphere';
import { featureAt } from './geo';
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
    const click = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      const p = e.point.clone().normalize();
      const lat = THREE.MathUtils.radToDeg(Math.asin(p.y));
      const lon =
        THREE.MathUtils.radToDeg(Math.atan2(p.z, -p.x)) - 180;

      const f = featureAt(((lon + 540) % 360) - 180, lat);

      if (f) onCountry?.(Number(f.id));
    };

    return (
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#071217']} />

        <ambientLight intensity={1.4} />
        <directionalLight
          position={[-4, 3, 5]}
          intensity={2.2}
          color="#d9f4e8"
        />

        <Stars
          radius={90}
          depth={40}
          count={2500}
          factor={2}
          saturation={0}
        />

        <mesh onClick={click}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#164d5c"
            roughness={0.74}
            metalness={0.05}
          />
        </mesh>

        <CountryBorders highlight={highlight} />
        <Atmosphere />

        <GlobeControls ref={ref} reset={reset} />
      </Canvas>
    );
  }
);
