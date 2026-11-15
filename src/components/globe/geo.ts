import * as THREE from 'three';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

type Geo = { type:string; coordinates: unknown };
export type GeoFeature = { id:string|number; geometry:Geo };
export const features = (feature(world as any, (world as any).objects.countries) as unknown as {features:GeoFeature[]}).features;
export const lonLatToVector = (lon:number, lat:number, radius=2.015) => { const p=THREE.MathUtils.degToRad(90-lat), t=THREE.MathUtils.degToRad(lon+180); return new THREE.Vector3(-radius*Math.sin(p)*Math.cos(t), radius*Math.cos(p), radius*Math.sin(p)*Math.sin(t)); };
export function featureAt(lon:number,lat:number) { return features.find(f => geoContains(f as any, [lon, lat])); }
export function linesFor(feature:GeoFeature):number[][][] { const g=feature.geometry; const polys:number[][][][]=g.type==='Polygon'?[g.coordinates as number[][][]]:g.type==='MultiPolygon'?g.coordinates as number[][][][]:[]; return polys.flatMap(p=>p); }
export function polygonsFor(feature:GeoFeature):number[][][][] { const g=feature.geometry; return g.type==='Polygon'?[g.coordinates as number[][][]]:g.type==='MultiPolygon'?g.coordinates as number[][][][]:[]; }
