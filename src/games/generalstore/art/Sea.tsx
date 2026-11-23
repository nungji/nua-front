import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { CustomerId, Mood } from '../game/types';
import { Customer } from './Customer';
import { INK_NIGHT } from './colors';

const SAND = '#EFDCB0';
const SAND_DARK = '#E2CB9A';
const ROCK = '#B7C0C4';
const ROCK_DARK = '#98A3A8';
const WEED = '#4FA36E';
const CORAL = '#F07C6C';

/** Top-down seabed for the stage select: sand, caustics, coral and weed along the edges. */
export function SeabedBackdrop({ width, height }: { width: number; height: number }) {
  const weeds = Array.from({ length: Math.ceil(height / 220) }, (_, row) => row);

  return (
    <Svg width={width} height={height} style={{ position: 'absolute' }} viewBox={`0 0 ${width} ${height}`}>
      <Rect x={0} y={0} width={width} height={height} fill={SAND} />
      <Rect x={0} y={0} width={width} height={height} fill="#8FD6E8" opacity={0.18} />

      {/* sand ripples */}
      {Array.from({ length: Math.ceil(height / 46) }, (_, index) => (
        <Path
          key={`ripple-${index}`}
          d={`M0 ${index * 46 + 20} Q ${width * 0.25} ${index * 46 + 8} ${width * 0.5} ${index * 46 + 22} T ${width} ${index * 46 + 16}`}
          stroke={SAND_DARK}
          strokeWidth={2}
          fill="none"
          opacity={0.55}
        />
      ))}

      {/* light caustics */}
      {Array.from({ length: Math.ceil(height / 120) }, (_, index) => (
        <Path
          key={`caustic-${index}`}
          d={`M${width * 0.1} ${index * 120 + 40} q 40 -26 80 0 q 40 26 80 0 q 40 -26 80 0`}
          stroke="#FFFFFF"
          strokeWidth={3}
          fill="none"
          opacity={0.22}
        />
      ))}

      {/* coral and rocks hugging both edges */}
      {weeds.map((row) => {
        const y = row * 220 + 110;
        const left = row % 2 === 0;

        return (
          <Path
            key={`weed-${row}`}
            d={`M${left ? 18 : width - 18} ${y} q ${left ? 14 : -14} -26 ${left ? 4 : -4} -52 q ${left ? -10 : 10} -22 ${left ? 2 : -2} -40`}
            stroke={WEED}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
      {weeds.map((row) => {
        const y = row * 220 + 150;
        const left = row % 2 === 1;

        return (
          <Path
            key={`coral-${row}`}
            d={`M${left ? 26 : width - 26} ${y} q ${left ? 10 : -10} -30 ${left ? 26 : -26} -34 q ${left ? -4 : 4} -22 ${left ? 18 : -18} -26`}
            stroke={CORAL}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
      {weeds.map((row) => {
        const y = row * 220 + 186;
        const left = row % 2 === 0;

        return (
          <Ellipse
            key={`rock-${row}`}
            cx={left ? 34 : width - 34}
            cy={y}
            rx={30}
            ry={22}
            fill={ROCK}
          />
        );
      })}
    </Svg>
  );
}

/** Ring of boulders that frames a stage photo. Drawn on a transparent background. */
export function RockRing({ size }: { size: number }) {
  const center = size / 2;
  const radius = size * 0.42;
  const stones = 13;

  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: stones }, (_, index) => {
        const angle = (Math.PI * 2 * index) / stones - Math.PI / 2;
        const wobble = 1 + ((index * 37) % 11) / 60;
        const stone = size * 0.115 * wobble;

        return (
          <Circle
            key={`stone-${index}`}
            cx={center + Math.cos(angle) * radius}
            cy={center + Math.sin(angle) * radius}
            r={stone}
            fill={index % 3 === 0 ? ROCK_DARK : ROCK}
          />
        );
      })}
    </Svg>
  );
}

const FISH_BODY = '#F2A24B';
const FISH_BELLY = '#FBE0B6';
const OCTO_BODY = '#B98AD8';
const OCTO_LIGHT = '#DCC2EE';

function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'happy') {
    return (
      <>
        <Path d="M38 50 Q42 44 46 50" stroke={INK_NIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <Path d="M54 50 Q58 44 62 50" stroke={INK_NIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <Path d="M44 62 Q50 70 56 62" stroke={INK_NIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      </>
    );
  }

  return (
    <>
      <Circle cx={42} cy={50} r={4} fill={INK_NIGHT} />
      <Circle cx={58} cy={50} r={4} fill={INK_NIGHT} />
      <Circle cx={43.4} cy={48.6} r={1.4} fill="#FFFFFF" />
      <Circle cx={59.4} cy={48.6} r={1.4} fill="#FFFFFF" />
      <Path d="M36 44 Q40 41 44 43" stroke={INK_NIGHT} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6} />
      <Path d="M64 44 Q60 41 56 43" stroke={INK_NIGHT} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6} />
      <Path d="M45 66 Q50 60 55 66" stroke={INK_NIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Path d="M36 58 Q41 65 36 69 Q31 65 36 58 Z" fill="#7FC3E6" />
    </>
  );
}

export function Fish({ mood = 'sad', width = 120 }: { mood?: Mood; width?: number }) {
  return (
    <Svg width={width} height={width} viewBox="0 0 100 100">
      <Path d="M64 86 Q92 74 96 52 Q88 60 78 62 Q86 74 64 86 Z" fill={FISH_BODY} opacity={0.95} />
      <Ellipse cx={50} cy={60} rx={30} ry={32} fill={FISH_BODY} />
      <Ellipse cx={50} cy={72} rx={20} ry={18} fill={FISH_BELLY} />
      <Path d="M50 28 Q56 12 68 20 Q60 26 58 34 Z" fill={FISH_BODY} />
      <Path d="M50 28 Q44 12 32 20 Q40 26 42 34 Z" fill={FISH_BODY} />
      <Path d="M22 58 Q12 66 18 78 Q26 72 28 62 Z" fill={FISH_BODY} />
      <Path d="M78 58 Q88 66 82 78 Q74 72 72 62 Z" fill={FISH_BODY} />
      <Ellipse cx={50} cy={54} rx={26} ry={18} fill={FISH_BODY} />
      <Ellipse cx={50} cy={58} rx={20} ry={12} fill={FISH_BELLY} opacity={0.6} />
      <Eyes mood={mood} />
    </Svg>
  );
}

export function Octopus({ mood = 'sad', width = 120 }: { mood?: Mood; width?: number }) {
  return (
    <Svg width={width} height={width} viewBox="0 0 100 100">
      <Path d="M24 70 Q12 80 18 94 Q26 86 30 76 Z" fill={OCTO_LIGHT} />
      <Path d="M36 74 Q30 88 36 100 Q42 90 44 78 Z" fill={OCTO_BODY} />
      <Path d="M50 76 Q46 92 52 100 Q58 90 58 78 Z" fill={OCTO_LIGHT} />
      <Path d="M64 74 Q70 88 66 100 Q58 90 56 78 Z" fill={OCTO_BODY} />
      <Path d="M76 70 Q90 82 84 96 Q76 88 72 78 Z" fill={OCTO_LIGHT} />
      <Ellipse cx={50} cy={52} rx={30} ry={30} fill={OCTO_BODY} />
      <Ellipse cx={50} cy={56} rx={22} ry={20} fill={OCTO_LIGHT} opacity={0.55} />
      <Circle cx={24} cy={44} r={4} fill={OCTO_BODY} opacity={0.5} />
      <Circle cx={76} cy={44} r={4} fill={OCTO_BODY} opacity={0.5} />
      <Eyes mood={mood} />
    </Svg>
  );
}

/** Every customer drawing behind one prop so screens do not care which species it is. */
export function CustomerArt({ id, mood = 'sad', width = 120 }: { id: CustomerId; mood?: Mood; width?: number }) {
  if (id === 'fish') {
    return <Fish mood={mood} width={width} />;
  }

  if (id === 'octopus') {
    return <Octopus mood={mood} width={width} />;
  }

  return <Customer id={id} mood={mood} width={width} />;
}
