
export function Atmosphere() {
  return (
    <mesh scale={1.07}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshBasicMaterial
        color="#69BFFF"
        transparent
        opacity={0.12}
        side={1}
        depthWrite={false}
      />
    </mesh>
  );
}
