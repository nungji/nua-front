import { Chamfers, Connector, PieceEdges, Point } from './types';

const SAMPLE_STEPS = 12;
const CONNECTOR_HALF = 7;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function edgeConnectors(
  connectors: Connector[],
  origin: Point,
  unit: Point,
  segmentStart: number,
  segmentEnd: number,
  normal: Point
) {
  const half = CONNECTOR_HALF;
  const items: { from: number; to: number; control: Point }[] = [];

  for (const connector of [...connectors].sort((left, right) => left.at - right.at)) {
    const from = Math.max(segmentStart, connector.at - half);
    const to = Math.min(segmentEnd, connector.at + half);

    if (to - from <= 1) {
      continue;
    }

    const direction = connector.kind === 'tab' ? 1 : -1;

    items.push({
      from,
      to,
      control: {
        x: origin.x + unit.x * connector.at + normal.x * half * 2 * direction,
        y: origin.y + unit.y * connector.at + normal.y * half * 2 * direction
      }
    });
  }

  return items;
}

type EdgeSpan = {
  origin: Point;
  unit: Point;
  segmentStart: number;
  segmentEnd: number;
  items: { from: number; to: number; control: Point }[];
};

function edgeSpans(
  connectors: Connector[],
  origin: Point,
  unit: Point,
  segmentStart: number,
  segmentEnd: number,
  normal: Point
): EdgeSpan {
  return {
    origin,
    unit,
    segmentStart,
    segmentEnd,
    items: edgeConnectors(connectors, origin, unit, segmentStart, segmentEnd, normal)
  };
}

function applySpan(span: EdgeSpan, onLine: (to: Point) => void, onQuad: (control: Point, to: Point) => void) {
  for (const item of span.items) {
    onLine({
      x: span.origin.x + span.unit.x * item.from,
      y: span.origin.y + span.unit.y * item.from
    });
    onQuad(item.control, {
      x: span.origin.x + span.unit.x * item.to,
      y: span.origin.y + span.unit.y * item.to
    });
  }

  onLine({
    x: span.origin.x + span.unit.x * span.segmentEnd,
    y: span.origin.y + span.unit.y * span.segmentEnd
  });
}

function quadPoint(from: Point, control: Point, to: Point, t: number) {
  const inverse = 1 - t;

  return {
    x: inverse * inverse * from.x + 2 * inverse * t * control.x + t * t * to.x,
    y: inverse * inverse * from.y + 2 * inverse * t * control.y + t * t * to.y
  };
}

export function rectOutline(width: number, height: number, edges: PieceEdges, chamfers: Chamfers) {
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
  const spans: EdgeSpan[] = [];
  const starts: Point[] = [];

  for (let index = 0; index < corners.length; index += 1) {
    const from = corners[index];
    const to = corners[(index + 1) % corners.length];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const unit = { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
    const startInset = chamfers[index];
    const endInset = chamfers[(index + 1) % corners.length];

    starts.push({ x: from.x + unit.x * startInset, y: from.y + unit.y * startInset });
    spans.push(
      edgeSpans(
        [edges.top, edges.right, edges.bottom, edges.left][index],
        from,
        unit,
        startInset,
        length - endInset,
        normals[index]
      )
    );
  }

  return { starts, spans };
}

export function rectPath(width: number, height: number, edges: PieceEdges, chamfers: Chamfers) {
  const { starts, spans } = rectOutline(width, height, edges, chamfers);
  const commands: string[] = [];

  spans.forEach((span, index) => {
    const start = starts[index];
    commands.push(`${index === 0 ? 'M' : 'L'}${round(start.x)},${round(start.y)}`);
    applySpan(
      span,
      (to) => commands.push(`L${round(to.x)},${round(to.y)}`),
      (control, to) => commands.push(`Q${round(control.x)},${round(control.y)} ${round(to.x)},${round(to.y)}`)
    );
  });

  commands.push('Z');

  return commands.join(' ');
}

export function rectPolygon(width: number, height: number, edges: PieceEdges, chamfers: Chamfers) {
  const { starts, spans } = rectOutline(width, height, edges, chamfers);
  const points: Point[] = [];

  spans.forEach((span, index) => {
    const start = starts[index];
    points.push(start);
    let cursor = start;

    for (const item of span.items) {
      const from = {
        x: span.origin.x + span.unit.x * item.from,
        y: span.origin.y + span.unit.y * item.from
      };
      points.push(from);

      for (let step = 1; step <= SAMPLE_STEPS; step += 1) {
        points.push(quadPoint(from, item.control, {
          x: span.origin.x + span.unit.x * item.to,
          y: span.origin.y + span.unit.y * item.to
        }, step / SAMPLE_STEPS));
      }

      cursor = {
        x: span.origin.x + span.unit.x * item.to,
        y: span.origin.y + span.unit.y * item.to
      };
      points.push(cursor);
    }

    points.push({
      x: span.origin.x + span.unit.x * span.segmentEnd,
      y: span.origin.y + span.unit.y * span.segmentEnd
    });
  });

  return points;
}

export function semicirclePath(width: number, edges: PieceEdges) {
  const commands: string[] = [];
  const span = edgeSpans(edges.top, { x: 0, y: 0 }, { x: 1, y: 0 }, 0, width, { x: 0, y: -1 });

  commands.push('M0,0');
  applySpan(
    span,
    (to) => commands.push(`L${round(to.x)},${round(to.y)}`),
    (control, to) => commands.push(`Q${round(control.x)},${round(control.y)} ${round(to.x)},${round(to.y)}`)
  );
  commands.push(`A${round(width / 2)},${round(width / 2)} 0 0 1 0,0`);
  commands.push('Z');

  return commands.join(' ');
}

export function semicirclePolygon(width: number, edges: PieceEdges) {
  const span = edgeSpans(edges.top, { x: 0, y: 0 }, { x: 1, y: 0 }, 0, width, { x: 0, y: -1 });
  const points: Point[] = [{ x: 0, y: 0 }];

  for (const item of span.items) {
    const from = { x: item.from, y: 0 };
    points.push(from);

    for (let step = 1; step <= SAMPLE_STEPS; step += 1) {
      points.push(quadPoint(from, item.control, { x: item.to, y: 0 }, step / SAMPLE_STEPS));
    }

    points.push({ x: item.to, y: 0 });
  }

  points.push({ x: width, y: 0 });

  const radius = width / 2;

  for (let step = 1; step < 16; step += 1) {
    const angle = Math.PI * (step / 16);
    points.push({ x: radius + radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }

  return points;
}

export function circlePath(width: number, height: number, centerDeg: number, halfDeg: number) {
  const radius = width / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const start = ((centerDeg + halfDeg) * Math.PI) / 180;
  const end = ((centerDeg - halfDeg) * Math.PI) / 180;

  return (
    `M${round(centerX + radius * Math.cos(start))},${round(centerY + radius * Math.sin(start))} ` +
    `A${radius},${radius} 0 1 1 ${round(centerX + radius * Math.cos(end))},${round(centerY + radius * Math.sin(end))} Z`
  );
}

export function circlePolygon(width: number, height: number, centerDeg: number, halfDeg: number) {
  const radius = width / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const points: Point[] = [];
  const sweep = 360 - halfDeg * 2;

  for (let step = 0; step <= 32; step += 1) {
    const angle = ((centerDeg + halfDeg + (sweep * step) / 32) * Math.PI) / 180;
    points.push({ x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
  }

  return points;
}

export const ROUND = round;
