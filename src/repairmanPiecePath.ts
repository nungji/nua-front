import { Connector, PieceEdges } from '@/repairmanPuzzle';

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function edgeCommands(
  connectors: Connector[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  normalX: number,
  normalY: number
) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const length = Math.hypot(deltaX, deltaY);
  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const half = Math.min(8, length / 5);
  const commands: string[] = [];
  const ordered = [...connectors].sort((left, right) => left.at - right.at);

  for (const connector of ordered) {
    const direction = connector.kind === 'tab' ? 1 : -1;
    const startX = x1 + unitX * (connector.at - half);
    const startY = y1 + unitY * (connector.at - half);
    const endX = x1 + unitX * (connector.at + half);
    const endY = y1 + unitY * (connector.at + half);
    const controlX = x1 + unitX * connector.at + normalX * half * 2 * direction;
    const controlY = y1 + unitY * connector.at + normalY * half * 2 * direction;

    commands.push(`L${round(startX)},${round(startY)}`);
    commands.push(`Q${round(controlX)},${round(controlY)} ${round(endX)},${round(endY)}`);
  }

  commands.push(`L${round(x2)},${round(y2)}`);

  return commands;
}

export function buildPiecePath(width: number, height: number, edges: PieceEdges) {
  const commands = [
    'M0,0',
    ...edgeCommands(edges.top, 0, 0, width, 0, 0, -1),
    ...edgeCommands(edges.right, width, 0, width, height, 1, 0),
    ...edgeCommands(edges.bottom, width, height, 0, height, 0, 1),
    ...edgeCommands(edges.left, 0, height, 0, 0, -1, 0),
    'Z'
  ];

  return commands.join(' ');
}
