import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import type { CustomerId, Mood } from '../game/types';
import { CHEEK, INK_NIGHT } from './colors';

type Coat = {
  fur: string;
  belly: string;
  inner: string;
  face: string;
};

const COATS: Record<CustomerId, Coat> = {
  squirrel: { fur: '#C98A5B', belly: '#F4DCC0', inner: '#E7B48C', face: '#F4DCC0' },
  cat: { fur: '#E8A24B', belly: '#F7DDB4', inner: '#F0A6A6', face: '#F7DDB4' },
  rabbit: { fur: '#F1E7DC', belly: '#FFFDF7', inner: '#F3B8C0', face: '#FFFDF7' },
  fox: { fur: '#E07A3F', belly: '#FDF0E4', inner: '#C9612C', face: '#FDF0E4' },
  monkey: { fur: '#A9754F', belly: '#E8C9A8', inner: '#E8C9A8', face: '#E8C9A8' }
};

function Ears({ id, coat }: { id: CustomerId; coat: Coat }) {
  if (id === 'rabbit') {
    return (
      <>
        <Ellipse cx={37} cy={20} rx={7.5} ry={18} fill={coat.fur} transform="rotate(-8 37 20)" />
        <Ellipse cx={63} cy={20} rx={7.5} ry={18} fill={coat.fur} transform="rotate(8 63 20)" />
        <Ellipse cx={37} cy={21} rx={4} ry={13} fill={coat.inner} transform="rotate(-8 37 21)" />
        <Ellipse cx={63} cy={21} rx={4} ry={13} fill={coat.inner} transform="rotate(8 63 21)" />
      </>
    );
  }

  if (id === 'monkey') {
    return (
      <>
        <Circle cx={21} cy={54} r={9} fill={coat.fur} />
        <Circle cx={79} cy={54} r={9} fill={coat.fur} />
        <Circle cx={21} cy={54} r={4.5} fill={coat.inner} />
        <Circle cx={79} cy={54} r={4.5} fill={coat.inner} />
      </>
    );
  }

  const wide = id === 'fox';
  const left = wide ? 'M25 40 L10 8 L47 26 Z' : 'M27 34 L21 10 L44 25 Z';
  const right = wide ? 'M75 40 L90 8 L53 26 Z' : 'M73 34 L79 10 L56 25 Z';
  const leftInner = wide ? 'M28 36 L18 15 L44 27 Z' : 'M29 31 L25 17 L39 26 Z';
  const rightInner = wide ? 'M72 36 L82 15 L56 27 Z' : 'M71 31 L75 17 L61 26 Z';

  return (
    <>
      <Path d={left} fill={coat.fur} />
      <Path d={right} fill={coat.fur} />
      <Path d={leftInner} fill={coat.inner} />
      <Path d={rightInner} fill={coat.inner} />
    </>
  );
}

function Face({ mood }: { mood: Mood }) {
  const happy = mood === 'happy';

  return (
    <>
      {happy ? (
        <>
          <Path
            d="M37 51 Q41 46 45 51"
            stroke={INK_NIGHT}
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M55 51 Q59 46 63 51"
            stroke={INK_NIGHT}
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <Circle cx={41} cy={51} r={3.6} fill={INK_NIGHT} />
          <Circle cx={59} cy={51} r={3.6} fill={INK_NIGHT} />
          <Path d="M37 44 Q41 42 45 44" stroke={INK_NIGHT} strokeWidth={1.9} strokeLinecap="round" fill="none" opacity={0.55} />
          <Path d="M63 44 Q59 42 55 44" stroke={INK_NIGHT} strokeWidth={1.9} strokeLinecap="round" fill="none" opacity={0.55} />

        </>
      )}

      <Circle cx={31} cy={61} r={4.4} fill={CHEEK} opacity={0.45} />
      <Circle cx={69} cy={61} r={4.4} fill={CHEEK} opacity={0.45} />
      {mood === 'sad' ? <Path d="M36 56 Q41 63 36 67 Q31 63 36 56 Z" fill="#7FC3E6" /> : null}
      <Ellipse cx={50} cy={58} rx={3.2} ry={2.4} fill={INK_NIGHT} />

      {happy ? (
        <Path
          d="M44 64 Q50 71 56 64"
          stroke={INK_NIGHT}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <Path
          d="M45 69 Q50 63 55 69"
          stroke={INK_NIGHT}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </>
  );
}

type Props = {
  id: CustomerId;
  mood?: Mood;
  width?: number;
};

/** Flat vector stand-in for the character art that will replace it later. */
export function Customer({ id, mood = 'sad', width = 120 }: Props) {
  const coat = COATS[id];

  return (
    <Svg width={width} height={width} viewBox="0 0 100 100">
      {id === 'squirrel' ? (
        <>
          <Path
            d="M78 100 Q106 84 100 56 Q96 40 82 42 Q73 47 77 58 Q88 66 86 80 Q84 92 68 98 Z"
            fill={coat.fur}
          />
          <Path
            d="M82 96 Q96 82 92 62 Q89 52 83 52 Q86 64 84 76 Q82 88 74 94 Z"
            fill={coat.inner}
            opacity={0.55}
          />
        </>
      ) : null}
      <Path d="M14 100 Q14 74 50 74 Q86 74 86 100 Z" fill={coat.fur} />
      <Ellipse cx={50} cy={100} rx={17} ry={15} fill={coat.belly} />
      <Ears id={id} coat={coat} />
      <Ellipse cx={50} cy={52} rx={25} ry={23} fill={coat.fur} />
      {id === 'monkey' ? <Ellipse cx={50} cy={55} rx={19} ry={18} fill={coat.face} /> : null}
      {id === 'fox' ? (
        <Path d="M50 50 Q61 51 62 64 Q56 75 50 75 Q44 75 38 64 Q39 51 50 50 Z" fill={coat.face} />
      ) : null}
      {id === 'cat' ? (
        <>
          <Path d="M26 55 L10 51 M26 60 L10 60 M27 65 L12 69" stroke={INK_NIGHT} strokeWidth={1.7} strokeLinecap="round" opacity={0.6} />
          <Path d="M74 55 L90 51 M74 60 L90 60 M73 65 L88 69" stroke={INK_NIGHT} strokeWidth={1.7} strokeLinecap="round" opacity={0.6} />
        </>
      ) : null}
      <Face mood={mood} />
    </Svg>
  );
}
