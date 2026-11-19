
import { OrbitControls } from '@react-three/drei';
import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

export type GlobeControlsHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

type GlobeControlsProps = {
  reset: number;
};

export const GlobeControls = forwardRef<
  GlobeControlsHandle,
  GlobeControlsProps
>(function GlobeControls({ reset }, externalRef) {
  const ref = useRef<any>(null);

  const zoom = (factor: number) => {
    if (!ref.current) return;

    const controls = ref.current;
    const camera = controls.object;

    const direction = camera.position.clone().sub(controls.target);
    direction.multiplyScalar(factor);

    const distance = direction.length();
    const clampedDistance = Math.max(3.1, Math.min(8, distance));

    direction.setLength(clampedDistance);

    camera.position.copy(controls.target).add(direction);
    controls.update();
  };

  const resetGlobe = () => {
    if (!ref.current) return;

    const controls = ref.current;

    controls.reset();
    controls.object.position.set(0, 0, 6);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  useImperativeHandle(externalRef, () => ({
    zoomIn: () => zoom(0.85),
    zoomOut: () => zoom(1.18),
    reset: resetGlobe,
  }));

  useEffect(() => {
    resetGlobe();
  }, [reset]);

  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      minDistance={3.1}
      maxDistance={8}
      autoRotate={false}
    />
  );
});
