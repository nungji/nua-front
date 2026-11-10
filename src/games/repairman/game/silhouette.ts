import polygonClipping from 'polygon-clipping';

import { Point } from './types';

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function buildSilhouettePath(polygons: Point[][]) {
  if (polygons.length === 0) {
    return '';
  }

  const shapes = polygons.map((polygon) => [
    polygon.map((point) => [point.x, point.y] as [number, number])
  ]);
  const merged = polygonClipping.union(
    shapes[0] as never,
    ...(shapes.slice(1) as never[])
  ) as unknown as [number, number][][][];
  const commands: string[] = [];

  for (const polygon of merged) {
    for (const ring of polygon) {
      const points = ring.slice(0, ring.length - 1);

      if (points.length < 3) {
        continue;
      }

      commands.push(`M${round(points[0][0])},${round(points[0][1])}`);

      for (let index = 1; index < points.length; index += 1) {
        commands.push(`L${round(points[index][0])},${round(points[index][1])}`);
      }

      commands.push('Z');
    }
  }

  return commands.join(' ');
}
