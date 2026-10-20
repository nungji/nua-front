export function pointInPolygon(points: number[], x: number, y: number) {
  'worklet';

  let inside = false;
  const count = points.length / 2;

  for (let i = 0, j = count - 1; i < count; j = i, i += 1) {
    const xi = points[i * 2];
    const yi = points[i * 2 + 1];
    const xj = points[j * 2];
    const yj = points[j * 2 + 1];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

export function pickPiece(
  hits: number[],
  shapes: number[][],
  sizes: number[][],
  px: number,
  py: number
) {
  'worklet';

  for (let i = shapes.length - 1; i >= 0; i -= 1) {
    const centerX = hits[i * 4];
    const centerY = hits[i * 4 + 1];
    const angle = (-hits[i * 4 + 2] * Math.PI) / 180;
    const flipped = hits[i * 4 + 3] < 0;
    const width = sizes[i][0];
    const height = sizes[i][1];
    const deltaX = px - centerX;
    const deltaY = py - centerY;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const localX = deltaX * cos - deltaY * sin + width / 2;
    const localY = deltaX * sin + deltaY * cos + height / 2;

    if (pointInPolygon(shapes[i], flipped ? width - localX : localX, localY)) {
      return i;
    }
  }

  return -1;
}
