import { geoEquirectangular, geoPath } from 'd3-geo';
import * as THREE from 'three';
import { features } from './geo';

/**
 * Rasterises Natural Earth country geometry once into an equirectangular map.
 * A texture is substantially more reliable than triangulating geographic
 * polygons directly onto a sphere, especially around the antimeridian.
 */
export function createGeoTexture(activeCountryId?: number) {
  const width = 3072;
  const height = 1536;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create globe texture canvas.');

  const ocean = context.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#083b5e');
  ocean.addColorStop(0.48, '#0873a2');
  ocean.addColorStop(1, '#052945');
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2])
    .precision(0.25);
  const path = geoPath(projection, context);

  for (const country of features) {
    const active = Number(country.id) === activeCountryId;
    context.beginPath();
    path(country as any);
    context.fillStyle = active ? '#f3c66a' : '#f1f5ed';
    context.fill();
    context.strokeStyle = active ? '#fff6b0' : '#3c7188';
    context.lineWidth = active ? 2.1 : 0.85;
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
