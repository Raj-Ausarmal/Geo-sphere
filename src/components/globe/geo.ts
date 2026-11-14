import * as THREE from 'three';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

type Geo = { type:string; coordinates: unknown };
export type GeoFeature = { id:string|number; geometry:Geo };
export const features = (feature(world as any, (world as any).objects.countries) as unknown as {features:GeoFeature[]}).features;
export const lonLatToVector = (lon:number, lat:number, radius=2.015) => { const p=THREE.MathUtils.degToRad(90-lat), t=THREE.MathUtils.degToRad(lon+180); return new THREE.Vector3(-radius*Math.sin(p)*Math.cos(t), radius*Math.cos(p), radius*Math.sin(p)*Math.sin(t)); };
function inRing(point:[number,number], ring:number[][]) { let inside=false; for(let i=0,j=ring.length-1;i<ring.length;j=i++) { const [xi,yi]=ring[i], [xj,yj]=ring[j]; if ((yi>point[1]) !== (yj>point[1]) && point[0] < (xj-xi)*(point[1]-yi)/(yj-yi)+xi) inside=!inside; } return inside; }
export function featureAt(lon:number,lat:number) { const p:[number,number]=[lon,lat]; return features.find(f => { const g=f.geometry; const polygons:number[][][][]=g.type==='Polygon' ? [g.coordinates as number[][][]] : g.type==='MultiPolygon' ? g.coordinates as number[][][][] : []; return polygons.some(poly => inRing(p, poly[0]) && !poly.slice(1).some(r=>inRing(p,r))); }); }
export function linesFor(feature:GeoFeature):number[][][] { const g=feature.geometry; const polys:number[][][][]=g.type==='Polygon'?[g.coordinates as number[][][]]:g.type==='MultiPolygon'?g.coordinates as number[][][][]:[]; return polys.flatMap(p=>p); }
