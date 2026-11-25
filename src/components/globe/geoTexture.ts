import { geoEquirectangular, geoPath } from 'd3-geo';
import * as THREE from 'three';
import { features } from './geo';

/**
 * Rasterises Natural Earth country geometry once into an equirectangular map.
 * A texture is substantially more reliable than triangulating geographic
 * polygons directly onto a sphere, especially around the antimeridian.
 */
export function createGeoTexture(activeCountryId?: number) {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create globe texture canvas.');

  const ocean = context.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#0b476b');
  ocean.addColorStop(0.48, '#126889');
  ocean.addColorStop(1, '#083451');
  context.fillStyle = ocean;
  context.fillRect(0, 0, width, height);

  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2])
    .precision(0.25);
  const path = geoPath(projection, context);

  // SphereGeometry's U coordinates run right-to-left, so mirror the canvas
  // before drawing. This keeps texture geography aligned with picking/borders.
  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);

  for (const country of features) {
    const active = Number(country.id) === activeCountryId;
    context.beginPath();
    path(country as any);
    context.fillStyle = active ? '#f3c66a' : '#dce8dc';
    context.fill();
    context.strokeStyle = active ? '#fff6b0' : '#5e8391';
    context.lineWidth = active ? 1.7 : 0.65;
    context.stroke();
  }

  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
