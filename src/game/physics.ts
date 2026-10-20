import Matter from 'matter-js';

import { Piece } from './types';

const { Bodies, Body, Composite, Engine, Sleeping } = Matter;

export type PhysicsWorld = {
  engine: Matter.Engine;
  bodies: Record<string, Matter.Body>;
};

export type BoardSize = {
  width: number;
  height: number;
};

const WALL = { isStatic: true, friction: 0.6, restitution: 0.05 };

export function createWorld(pieces: Piece[], size: BoardSize): PhysicsWorld {
  const engine = Engine.create({
    gravity: { x: 0, y: 1, scale: 0.0016 },
    enableSleeping: true
  });

  Composite.add(engine.world, [
    Bodies.rectangle(size.width / 2, size.height + 40, size.width * 2, 80, WALL),
    Bodies.rectangle(-40, size.height / 2, 80, size.height * 4, WALL),
    Bodies.rectangle(size.width + 40, size.height / 2, 80, size.height * 4, WALL)
  ]);

  const bodies: Record<string, Matter.Body> = {};
  const count = pieces.length;

  pieces.forEach((piece, index) => {
    const halfWidth = piece.width / 2;
    const spread = (index + 0.5) / count;
    const laneX = 30 + spread * (size.width - 60);
    const x = Math.min(size.width - halfWidth - 8, Math.max(halfWidth + 8, laneX));
    const y = -70 - index * 64;

    const body = Bodies.rectangle(x, y, piece.width, piece.height, {
      friction: 0.18,
      frictionStatic: 0.2,
      frictionAir: 0.02,
      restitution: 0.12,
      density: 0.0015
    });

    Body.setInertia(body, Infinity);
    bodies[piece.id] = body;
  });

  Composite.add(engine.world, Object.values(bodies));

  return { engine, bodies };
}

export function stepWorld(world: PhysicsWorld, delta: number) {
  Engine.update(world.engine, delta);
}

export function holdBody(world: PhysicsWorld, id: string, x: number, y: number) {
  const body = world.bodies[id];

  if (!body) {
    return;
  }

  Sleeping.set(body, false);
  Body.setPosition(body, { x, y });
  Body.setVelocity(body, { x: 0, y: 0 });
  Body.setAngularVelocity(body, 0);
}

export function placeBody(world: PhysicsWorld, id: string, x: number, y: number) {
  const body = world.bodies[id];

  if (!body) {
    return;
  }

  holdBody(world, id, x, y);
  Body.setStatic(body, true);
}

export function releaseBody(world: PhysicsWorld, id: string, x: number, y: number) {
  const body = world.bodies[id];

  if (!body) {
    return;
  }

  Body.setStatic(body, false);
  Sleeping.set(body, false);
  Body.setPosition(body, { x, y });
  Body.setVelocity(body, { x: 0, y: 1.4 });
  Body.setAngularVelocity(body, 0);
}
