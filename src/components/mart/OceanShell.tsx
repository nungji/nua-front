import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

/** Counting-game shell, using the ocean UI's outlined pink gradient and white highlight. */
export function OceanShell({ size = 52 }: { size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs><LinearGradient id={id} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#FFD2E9" /><Stop offset="1" stopColor="#FF75B6" /></LinearGradient></Defs>
      <Path d="M25 53C17 48 6 38 5 28C4 21 10 16 16 19C14 10 23 6 29 12C32 4 42 8 43 16C50 11 58 17 55 25C64 27 60 39 52 44L39 54Z" fill={`url(#${id})`} stroke="#C8498D" strokeWidth="2.5" strokeLinejoin="round" />
      <Path d="M29 50L16 23M32 49L30 16M35 49L43 20M38 49L52 29" fill="none" stroke="#E363A6" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M25 50Q32 46 39 50L42 56Q32 61 22 56Z" fill="#FFABD3" stroke="#C8498D" strokeWidth="2.5" strokeLinejoin="round" />
      <Path d="M10 26Q9 22 13 22M21 16L23 15" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function OceanPearl({ size = 28 }: { size?: number }) {
  const id = useId();
  return <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs><RadialGradient id={id} cx="35%" cy="30%" r="75%"><Stop offset="0" stopColor="#FFFFFF" /><Stop offset="0.5" stopColor="#F2EDFF" /><Stop offset="1" stopColor="#B899EC" /></RadialGradient></Defs>
    <Circle cx="16" cy="16" r="13" fill={`url(#${id})`} stroke="#8B6CCC" strokeWidth="2" />
    <Ellipse cx="12" cy="10" rx="4" ry="3" fill="white" />
  </Svg>;
}

export function OceanCustomer({ width = 100, height = 160, unhappy = false }: { width?: number; height?: number; unhappy?: boolean }) {
  return <Svg width={width} height={height} viewBox="0 0 100 160">
    <Ellipse cx="50" cy="149" rx="40" ry="7" fill="#12509C" opacity="0.2" />
    <Path d="M20 97Q3 111 9 136Q13 145 24 136L30 125Q29 151 43 148L50 132Q58 153 68 146L71 126Q85 147 92 134Q99 116 80 97Z" fill="#CBA6FF" stroke="#7051AF" strokeWidth="3" strokeLinejoin="round" />
    <Path d="M10 83C6 26 94 24 90 83Q89 120 50 121Q11 120 10 83Z" fill="#D6B7FF" stroke="#7051AF" strokeWidth="3" />
    <Ellipse cx="32" cy="61" rx="13" ry="7" fill="#F2E5FF" transform="rotate(-24 32 61)" />
    <Ellipse cx="31" cy="91" rx="8" ry="5" fill="#FF9FCB" /><Ellipse cx="71" cy="91" rx="8" ry="5" fill="#FF9FCB" />
    <Circle cx="35" cy="81" r="4" fill="#1B3A6B" /><Circle cx="66" cy="81" r="4" fill="#1B3A6B" />
    <Path d={unhappy ? 'M44 99Q50 91 57 99' : 'M44 94Q50 103 57 94'} stroke="#1B3A6B" strokeWidth="3" fill="none" strokeLinecap="round" />
  </Svg>;
}
