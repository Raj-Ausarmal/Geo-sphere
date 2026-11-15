import { useMemo } from 'react'; import * as THREE from 'three'; import { features, linesFor, lonLatToVector, polygonsFor } from './geo';

function filledCountryGeometry(rings:number[][][]) {
  const shape = new THREE.Shape(rings[0].map(([lon, lat]) => new THREE.Vector2(lon, lat)));
  rings.slice(1).forEach(ring => shape.holes.push(new THREE.Path(ring.map(([lon, lat]) => new THREE.Vector2(lon, lat)))));
  const geometry = new THREE.ShapeGeometry(shape, 8);
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const point = lonLatToVector(position.getX(i), position.getY(i), 2.025);
    position.setXYZ(i, point.x, point.y, point.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export function CountryBorders({highlight}:{highlight?:number}) {
  const geometry=useMemo(()=> { const pts:number[]=[]; features.forEach(f=>linesFor(f).forEach(ring=>{ const verts=ring.map(([lon,lat])=>lonLatToVector(lon,lat)); for(let i=1;i<verts.length;i++) pts.push(...verts[i-1].toArray(),...verts[i].toArray()); })); const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3)); return g; },[]);
  const selected=useMemo(()=>features.find(f=>Number(f.id)===highlight),[highlight]);
  const fillGeometries=useMemo(()=>selected ? polygonsFor(selected).map(filledCountryGeometry) : [],[selected]);
  const selectGeometry=useMemo(()=> { if(!selected)return null; const pts:number[]=[]; linesFor(selected).forEach(ring=>{const v=ring.map(([a,b])=>lonLatToVector(a,b,2.03)); for(let i=1;i<v.length;i++)pts.push(...v[i-1].toArray(),...v[i].toArray());});const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));return g;},[selected]);
  return <><lineSegments geometry={geometry}><lineBasicMaterial color="#789997" transparent opacity={.72}/></lineSegments>{fillGeometries.map((fill,index)=><mesh key={index} geometry={fill}><meshBasicMaterial color="#f3c66a" transparent opacity={.55} side={THREE.DoubleSide} depthWrite={false}/></mesh>)}{selectGeometry&&<lineSegments geometry={selectGeometry}><lineBasicMaterial color="#fff0a6" linewidth={2}/></lineSegments>}</>;
}
