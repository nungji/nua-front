import Matter from 'matter-js';

import { piecePolygon } from './shapes';
import { BoardSize, Piece, Point } from './types';

const { Bodies, Body, Composite, Engine, Sleeping, Vertices } = Matter;

export type PhysicsEntry = {
  body: Matter.Body;
  offset: Point;
  angle: number;
  flipped: boolean;
};

export type PhysicsWorld = {
  engine: Matter.Engine;
  entries: Record<string, PhysicsEntry>;
};

const WALL = { isStatic: true, friction: 0.5, restitution: 0 };

const BODY_OPTIONS = {
  friction: 0.28,
  frictionStatic: 0.4,
  frictionAir: 0.02,
  restitution: 0,
  density: 0.0018
};

function buildEntry(piece: Piece, flipped: boolean): PhysicsEntry {
  const points = piecePolygon(piece).map((point) => ({
    x: flipped ? piece.width - point.x : point.x,
    y: point.y
  }));
  const hull = Vertices.hull(points as never);
  let body: Matter.Body | null = null;

  try {
    body = Bodies.fromVertices(0, 0, [hull as never], BODY_OPTIONS, true, 0.01, 0.0001);
  } catch {
    body = null;
  }

  if (!body || !body.vertices || body.vertices.length < 3) {
    body = Bodies.rectangle(piece.width / 2, piece.height / 2, piece.width, piece.height, BODY_OPTIONS);
  }

  Body.setInertia(body, Infinity);
  Body.setAngularVelocity(body, 0);

  return {
    body,
    offset: {
      x: piece.width / 2 - body.position.x,
      y: piece.height / 2 - body.position.y
    },
    angle: 0,
    flipped
  };
}

export function createWorld(
  pieces: Piece[],
  size: BoardSize,
  initialFlips: Record<string, boolean>
): PhysicsWorld {
  const engine = Engine.create({
    gravity: { x: 0, y: 1, scale: 0.0016 },
    enableSleeping: true,
    positionIterations: 14,
    velocityIterations: 12,
    constraintIterations: 4
  });

  Composite.add(engine.world, [
    Bodies.rectangle(size.width / 2, size.height + 40, size.width * 2, 80, WALL),
    Bodies.rectangle(-40, size.height / 2, 80, size.height * 4, WALL),
    Bodies.rectangle(size.width + 40, size.height / 2, 80, size.height * 4, WALL)
  ]);

  const entries: Record<string, PhysicsEntry> = {};

  pieces.forEach((piece, index) => {
    const entry = buildEntry(piece, Boolean(initialFlips[piece.id]));
    const spread = (index + 0.5) / pieces.length;
    const laneX = 30 + spread * (size.width - 60);
    const x = Math.min(size.width - piece.width / 2 - 8, Math.max(piece.width / 2 + 8, laneX));

    Body.setPosition(entry.body, { x, y: -80 - index * 72 });
    entries[piece.id] = entry;
  });

  Composite.add(
    engine.world,
    Object.values(entries).map((entry) => entry.body)
  );

  return { engine, entries };
}

export function stepWorld(world: PhysicsWorld, delta: number) {
  Engine.update(world.engine, delta);
}

export function visualCenter(world: PhysicsWorld, id: string): Point {
  const entry = world.entries[id];
  const radians = (entry.angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: entry.body.position.x + entry.offset.x * cos - entry.offset.y * sin,
    y: entry.body.position.y + entry.offset.x * sin + entry.offset.y * cos
  };
}

function bodyPositionFor(entry: PhysicsEntry, centerX: number, centerY: number): Point {
  const radians = (entry.angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: centerX - (entry.offset.x * cos - entry.offset.y * sin),
    y: centerY - (entry.offset.x * sin + entry.offset.y * cos)
  };
}

export function setBodyAngle(world: PhysicsWorld, id: string, degrees: number) {
  const entry = world.entries[id];

  if (!entry) {
    return;
  }

  entry.angle = degrees;
  Body.setAngle(entry.body, (degrees * Math.PI) / 180);
  Body.setAngularVelocity(entry.body, 0);
}

export function setBodyFlipped(world: PhysicsWorld, piece: Piece, flipped: boolean) {
  const entry = world.entries[piece.id];

  if (!entry || entry.flipped === flipped) {
    return;
  }

  const position = { x: entry.body.position.x, y: entry.body.position.y };
  const angle = entry.angle;

  Composite.remove(world.engine.world, entry.body);

  const next = buildEntry(piece, flipped);

  Body.setPosition(next.body, position);
  next.angle = angle;
  Body.setAngle(next.body, (angle * Math.PI) / 180);
  Body.setAngularVelocity(next.body, 0);

  Composite.add(world.engine.world, next.body);
  world.entries[piece.id] = next;
}

export function holdBody(world: PhysicsWorld, id: string, centerX: number, centerY: number) {
  const entry = world.entries[id];

  if (!entry) {
    return;
  }

  const target = bodyPositionFor(entry, centerX, centerY);

  Sleeping.set(entry.body, false);
  Body.setPosition(entry.body, target);
  Body.setVelocity(entry.body, { x: 0, y: 0 });
  Body.setAngularVelocity(entry.body, 0);
}

export function placeBody(world: PhysicsWorld, id: string, centerX: number, centerY: number) {
  const entry = world.entries[id];

  if (!entry) {
    return;
  }

  holdBody(world, id, centerX, centerY);
  Body.setStatic(entry.body, true);
}

export function releaseBody(world: PhysicsWorld, id: string, centerX: number, centerY: number) {
  const entry = world.entries[id];

  if (!entry) {
    return;
  }

  Body.setStatic(entry.body, false);
  Sleeping.set(entry.body, false);
  holdBody(world, id, centerX, centerY);
  Body.setVelocity(entry.body, { x: 0, y: 1.4 });
}
