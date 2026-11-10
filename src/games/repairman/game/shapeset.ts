import { Chamfers } from './types';

export type ShapeSpec = {
  kind: 'rect' | 'circle' | 'semicircle';
  width: number;
  height: number;
  chamfers?: Chamfers;
};

const r = (width: number, height: number, chamfers: Chamfers = [0, 0, 0, 0]): ShapeSpec => ({
  kind: 'rect',
  width,
  height,
  chamfers
});

const c = (diameter: number): ShapeSpec => ({
  kind: 'circle',
  width: diameter,
  height: diameter
});

const s = (diameter: number): ShapeSpec => ({
  kind: 'semicircle',
  width: diameter,
  height: diameter / 2
});

export const SHAPES = {
  bookCover: r(108, 10, [4, 4, 0, 0]),
  bookPages: r(88, 46, [0, 0, 4, 0]),
  bookSpine: r(10, 46, [4, 0, 0, 0]),

  cupSaucer: r(96, 12, [8, 8, 0, 0]),
  cupBody: r(64, 62, [0, 0, 14, 0]),
  cupLid: r(64, 10, [10, 10, 0, 0]),
  cupHandle: r(20, 28, [0, 10, 10, 0]),

  chairRail: r(84, 10, [6, 6, 0, 0]),
  chairBack: r(84, 50, [0, 0, 0, 0]),
  chairSeat: r(84, 14, [8, 0, 0, 0]),
  chairLegLeft: r(14, 46, [0, 0, 0, 4]),
  chairLegRight: r(14, 44, [0, 0, 4, 0]),

  doorTrimLeft: r(10, 90, [0, 0, 4, 0]),
  doorPanel: r(70, 90, [0, 0, 0, 0]),
  doorTrimRight: r(10, 88, [0, 0, 0, 4]),
  doorLintel: r(90, 12, [6, 6, 0, 0]),
  doorSill: r(90, 10, [0, 0, 8, 8]),

  pencilTip: r(24, 20, [10, 10, 0, 0]),
  pencilBody: r(110, 20, [0, 0, 0, 0]),
  pencilEraser: r(16, 18, [0, 4, 4, 0]),

  carCabin: r(76, 44, [0, 16, 0, 0]),
  carChassis: r(150, 46, [14, 0, 0, 0]),
  carBumper: r(14, 18, [6, 0, 0, 0]),
  carWheelFront: s(44),
  carWheelRear: s(40),

  planeTail: r(18, 38, [8, 0, 0, 0]),
  planeWindshield: r(22, 18, [0, 8, 0, 0]),
  planeFuselage: r(170, 34, [0, 16, 0, 0]),
  planeWing: r(108, 22, [10, 0, 0, 0]),
  planeWheelMain: s(34),
  planeWheelNose: s(28),

  trainBody: r(160, 66, [26, 0, 0, 0]),
  trainChimney: r(22, 40, [8, 0, 0, 0]),
  trainCab: r(60, 60, [0, 20, 0, 0]),
  trainWheelLeft: c(48),
  trainWheelRight: c(44),

  deskTop: r(150, 12, [12, 0, 0, 0]),
  deskLegLeft: r(12, 48, [0, 0, 0, 4]),
  deskDrawer: r(80, 28, [0, 0, 6, 0]),
  deskDivider: r(10, 28, [0, 0, 4, 0]),
  deskLegRight: r(12, 46, [0, 0, 4, 0]),
  deskShelf: r(56, 8, [0, 6, 0, 0]),

  robotAntenna: r(8, 16, [0, 4, 0, 0]),
  robotHead: r(42, 38, [8, 8, 0, 0]),
  robotArmLeft: r(14, 46, [0, 0, 6, 0]),
  robotArmRight: r(14, 44, [0, 0, 0, 6]),
  robotTorso: r(66, 66, [0, 10, 0, 0]),
  robotLegLeft: r(18, 34, [0, 0, 0, 6]),
  robotLegRight: r(18, 32, [0, 0, 6, 0]),

  clockKnob: r(18, 10, [4, 4, 0, 0]),
  clockFace: c(96),
  clockPendulum: r(10, 34, [0, 0, 4, 0]),
  clockBase: r(76, 12, [8, 8, 0, 0]),

  truckContainer: r(108, 62, [10, 0, 0, 0]),
  truckCab: r(56, 56, [0, 16, 0, 0]),
  truckChassis: r(164, 14, [10, 0, 0, 0]),
  truckWheelFront: c(40),
  truckWheelMiddle: c(38),
  truckWheelRear: c(36),

  houseChimney: r(20, 28, [0, 8, 0, 0]),
  houseRoof: r(130, 42, [28, 28, 0, 0]),
  houseWall: r(110, 74, [16, 0, 0, 0]),
  houseFenceLeft: r(26, 36, [0, 6, 0, 0]),
  houseDoor: r(28, 36, [8, 0, 0, 0]),
  houseWindow: r(24, 24, [0, 6, 0, 0]),
  houseFenceRight: r(26, 34, [0, 0, 0, 6]),

  fanBase: r(76, 12, [8, 8, 0, 0]),
  fanPole: r(12, 60, [0, 0, 4, 0]),
  fanHead: c(64),
  fanButton: r(12, 8, [0, 4, 0, 0]),

  bedHeadboard: r(22, 66, [10, 0, 0, 0]),
  bedMattress: r(120, 28, [0, 0, 6, 0]),
  bedPillow: r(34, 16, [6, 0, 0, 0]),
  bedBlanket: r(56, 20, [0, 0, 0, 6]),
  bedLegLeft: r(12, 26, [0, 0, 0, 4]),
  bedLegRight: r(12, 24, [0, 0, 4, 0]),

  rocketAntenna: r(8, 18, [4, 0, 0, 0]),
  rocketNose: r(52, 34, [22, 22, 0, 0]),
  rocketBody: r(52, 104, [0, 10, 0, 0]),
  rocketWindow: r(22, 22, [0, 8, 8, 0]),
  rocketBoosterLeft: r(18, 56, [0, 0, 8, 0]),
  rocketBoosterRight: r(18, 58, [0, 0, 0, 8]),
  rocketFinLeft: r(16, 42, [0, 0, 10, 0]),
  rocketFinRight: r(16, 44, [0, 0, 0, 10]),

  sofaArmLeft: r(13, 70, [0, 0, 0, 6]),
  sofaArmRight: r(13, 68, [0, 0, 6, 0]),
  sofaBack: r(120, 54, [8, 0, 0, 0]),
  sofaSeat: r(120, 30, [0, 0, 6, 0]),

  pianoLid: r(140, 10, [10, 0, 0, 0]),
  pianoBody: r(130, 50, [0, 10, 0, 0]),
  pianoKeys: r(110, 14, [0, 0, 8, 0]),
  pianoLegLeft: r(12, 36, [0, 0, 0, 4]),
  pianoLegRight: r(12, 34, [0, 0, 4, 0]),
  pianoPedal: r(20, 8, [0, 4, 0, 0]),

  craneMast: r(20, 110, [6, 0, 0, 0]),
  craneBase: r(60, 14, [8, 8, 0, 0]),
  craneArm: r(120, 14, [0, 0, 8, 0]),
  craneCounter: r(24, 18, [0, 6, 0, 0]),
  craneCable: r(6, 40, [0, 0, 2, 0]),
  craneHook: r(16, 12, [0, 0, 6, 6]),
  craneLoad: r(34, 26, [8, 0, 0, 0]),

  castleTowerLeft: r(30, 90, [0, 0, 0, 0]),
  castleTowerRight: r(30, 88, [0, 0, 0, 0]),
  castleWall: r(100, 70, [0, 10, 0, 0]),
  castleGate: r(28, 44, [14, 14, 0, 0]),
  castlePole: r(6, 30, [0, 0, 2, 0]),
  castleFlag: r(20, 12, [0, 6, 0, 0]),
  castleRoofLeft: r(34, 16, [10, 10, 0, 0]),
  castleRoofRight: r(34, 14, [0, 0, 10, 10]),
  castleKeep: r(40, 40, [0, 8, 0, 0])
} as const;

export type ShapeId = keyof typeof SHAPES;

export type Symmetry = {
  rotation: 1 | 2 | 4;
  mirror: boolean;
};

const NO_CHAMFERS: Chamfers = [0, 0, 0, 0];

export function symmetryOf(shape: ShapeSpec): Symmetry {
  if (shape.kind === 'circle') {
    return { rotation: 4, mirror: true };
  }

  if (shape.kind === 'semicircle') {
    return { rotation: 1, mirror: true };
  }

  const chamfers = shape.chamfers ?? NO_CHAMFERS;
  const square = shape.width === shape.height;
  const even = chamfers[0] === chamfers[2] && chamfers[1] === chamfers[3];
  const uniform = chamfers[0] === chamfers[1] && chamfers[1] === chamfers[2] && chamfers[2] === chamfers[3];
  const mirror = chamfers[0] === chamfers[1] && chamfers[2] === chamfers[3];

  if (square && uniform) {
    return { rotation: 4, mirror };
  }

  if (even) {
    return { rotation: 2, mirror };
  }

  return { rotation: 1, mirror };
}

export function stepFor(symmetry: Symmetry) {
  return 4 / symmetry.rotation;
}
