import Svg, { Circle, Path } from 'react-native-svg';

/** Pure decoration: no events, game state, or puzzle geometry. */
export function PearlMarker({ size, active }: { size: number; active: boolean }) {
  return <Svg pointerEvents="none" width={size} height={size} viewBox="0 0 80 80" style={{ position: 'absolute' }}>
    <Path d="M12 56Q1 43 11 35Q2 20 20 21Q18 5 34 13Q42 0 50 14Q66 8 64 24Q80 25 69 39Q79 52 64 58L54 71H26Z" fill={active ? '#FFAEBD' : '#BAF5F0'} stroke="white" strokeWidth="4" strokeLinejoin="round" />
    <Path d="M19 34L30 56M32 23L36 54M48 23L44 54M61 35L51 56" stroke={active ? '#ED799C' : '#6ACCCB'} strokeWidth="3" strokeLinecap="round" />
    <Circle cx="40" cy="43" r="20" fill={active ? '#FFF1C9' : '#F3FFFF'} stroke="white" strokeWidth="3" />
    <Circle cx="34" cy="32" r="4" fill="white" />
  </Svg>;
}

export function ReefCorners() {
  return <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 760 471" preserveAspectRatio="none" style={{ position: 'absolute' }}>
    <Path d="M0 437Q110 410 216 448T480 450T760 432V471H0Z" fill="#FFE8AD" opacity=".65" />
    <Path d="M18 464V413M18 440Q38 435 37 419M18 428Q5 425 6 412M737 465V425M737 446Q716 441 717 428M737 437Q752 431 752 414" fill="none" stroke="#FFB5CE" strokeWidth="8" strokeLinecap="round" />
    <Circle cx="24" cy="25" r="10" fill="#FFFFFF55" stroke="white" strokeWidth="2" /><Circle cx="47" cy="43" r="5" fill="#FFFFFF88" />
    <Circle cx="731" cy="27" r="8" fill="#FFFFFF55" stroke="white" strokeWidth="2" />
  </Svg>;
}
