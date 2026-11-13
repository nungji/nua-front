import Svg, { Circle, Rect } from 'react-native-svg';

import { ACCENT } from './colors';

const STRIPES = 8;
const WIDTH = 360;
/** Straight part of the cloth; the hem circles are centred on the seam so nothing clips. */
const BAND = 20;
const HEIGHT = 40;

/** Shop awning over the stage shelf. The scalloped hem is what makes it read as cloth. */
export function Awning({ width, height = HEIGHT }: { width: number; height?: number }) {
  const stripe = WIDTH / STRIPES;
  const radius = BAND;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none">
      {Array.from({ length: STRIPES }, (_, index) => {
        const fill = index % 2 === 0 ? ACCENT : '#FFFFFF';
        const x = index * stripe;

        return (
          <Rect key={`stripe-${index}`} x={x} y={0} width={stripe} height={BAND} fill={fill} />
        );
      })}
      {Array.from({ length: STRIPES }, (_, index) => (
        <Circle
          key={`hem-${index}`}
          cx={index * stripe + stripe / 2}
          cy={BAND}
          r={radius}
          fill={index % 2 === 0 ? ACCENT : '#FFFFFF'}
        />
      ))}
    </Svg>
  );
}
