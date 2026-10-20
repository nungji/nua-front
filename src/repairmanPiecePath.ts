import { Chamfers, Connector, PieceEdges } from '@/repairmanPuzzle';

type Point = { x: number; y: number };

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function edgeCommands(
  connectors: Connector[],
  origin: Point,
  unit: Point,
  segmentStart: number,
  segmentEnd: number,
  normal: Point
) {
  const commands: string[] = [];
  const half = Math.min(8, (segmentEnd - segmentStart) / 5);
  const ordered = [...connectors].sort((left, right) => left.at - right.at);

  for (const connector of ordered) {
    const from = Math.max(segmentStart, connector.at - half);
    const to = Math.min(segmentEnd, connector.at + half);

    if (to - from <= 1) {
      continue;
    }

    const direction = connector.kind === 'tab' ? 1 : -1;
    const controlX = origin.x + unit.x * connector.at + normal.x * half * 2 * direction;
    const controlY = origin.y + unit.y * connector.at + normal.y * half * 2 * direction;

    commands.push(`L${round(origin.x + unit.x * from)},${round(origin.y + unit.y * from)}`);
    commands.push(
      `Q${round(controlX)},${round(controlY)} ${round(origin.x + unit.x * to)},${round(origin.y + unit.y * to)}`
    );
  }

  commands.push(`L${round(origin.x + unit.x * segmentEnd)},${round(origin.y + unit.y * segmentEnd)}`);

  return commands;
}

export function buildPiecePath(
  width: number,
  height: number,
  edges: PieceEdges,
  chamfers: Chamfers
) {
  const corners: Point[] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height }
  ];
  const normals: Point[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];
  const edgeConnectors = [edges.top, edges.right, edges.bottom, edges.left];
  const commands: string[] = [];

  for (let index = 0; index < corners.length; index += 1) {
    const from = corners[index];
    const to = corners[(index + 1) % corners.length];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const unit = { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
    const startInset = chamfers[index];
    const endInset = chamfers[(index + 1) % corners.length];
    const start = { x: from.x + unit.x * startInset, y: from.y + unit.y * startInset };

    commands.push(
      `${index === 0 ? 'M' : 'L'}${round(start.x)},${round(start.y)}`,
      ...edgeCommands(
        edgeConnectors[index],
        from,
        unit,
        startInset,
        length - endInset,
        normals[index]
      )
    );
  }

  commands.push('Z');

  return commands.join(' ');
}

export function buildCirclePath(width: number, height: number, centerDeg: number, halfDeg: number) {
  const radius = width / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const start = ((centerDeg + halfDeg) * Math.PI) / 180;
  const end = ((centerDeg - halfDeg) * Math.PI) / 180;
  const startX = centerX + radius * Math.cos(start);
  const startY = centerY + radius * Math.sin(start);
  const endX = centerX + radius * Math.cos(end);
  const endY = centerY + radius * Math.sin(end);

  return `M${round(startX)},${round(startY)} A${radius},${radius} 0 1 1 ${round(endX)},${round(endY)} Z`;
}

export function buildSemicirclePath(width: number, edges: PieceEdges) {
  const commands = [
    'M0,0',
    ...edgeCommands(edges.top, { x: 0, y: 0 }, { x: 1, y: 0 }, 0, width, { x: 0, y: -1 }),
    `A${round(width / 2)},${round(width / 2)} 0 0 1 0,0`,
    'Z'
  ];

  return commands.join(' ');
}
