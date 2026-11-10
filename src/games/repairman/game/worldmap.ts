export const MAP = {
  elevation: (60 * Math.PI) / 180,
  stepY: 92,
  sway: 76,
  swayFrequency: 0.5,
  topPadding: 140,
  bottomPadding: 330,
  gridSpacing: 92,
  gridHalfWidth: 420
};

const SQUASH = Math.cos(MAP.elevation);
const TILT = Math.atan(Math.tan((20 * Math.PI) / 180) / SQUASH);

export type MapPoint = {
  x: number;
  y: number;
};

export function projectPoint(u: number, v: number): MapPoint {
  const cos = Math.cos(TILT);
  const sin = Math.sin(TILT);

  return {
    x: u * cos - v * sin,
    y: -(u * sin + v * cos) * SQUASH
  };
}

export type MapNode = {
  id: number;
  x: number;
  y: number;
  scale: number;
};

export function mapContentHeight(count: number) {
  return MAP.topPadding + MAP.bottomPadding + Math.max(0, count - 1) * MAP.stepY;
}

export function buildMapNodes(count: number, width: number): MapNode[] {
  const height = mapContentHeight(count);
  const nodes: MapNode[] = [];

  for (let index = 0; index < count; index += 1) {
    const depth = count === 1 ? 0 : index / (count - 1);

    nodes.push({
      id: index + 1,
      x: width / 2 + Math.sin(index * MAP.swayFrequency) * MAP.sway,
      y: height - MAP.bottomPadding - index * MAP.stepY,
      scale: 1 - depth * 0.16
    });
  }

  return nodes;
}

export function buildGridLines(width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const reach = (width + height) * 1.4;
  const lines: { from: MapPoint; to: MapPoint }[] = [];

  const family = (direction: MapPoint) => {
    const length = Math.hypot(direction.x, direction.y);
    const unitX = direction.x / length;
    const unitY = direction.y / length;
    const normalX = -unitY;
    const normalY = unitX;
    const span = Math.abs(normalX) * width + Math.abs(normalY) * height + MAP.gridSpacing * 2;

    for (let offset = -span; offset <= span; offset += MAP.gridSpacing) {
      const baseX = centerX + normalX * offset;
      const baseY = centerY + normalY * offset;

      lines.push({
        from: { x: baseX - unitX * reach, y: baseY - unitY * reach },
        to: { x: baseX + unitX * reach, y: baseY + unitY * reach }
      });
    }
  };

  family(projectPoint(1, 1));
  family(projectPoint(1, -1));

  return lines;
}
