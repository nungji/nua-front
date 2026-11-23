import { useId } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

export const ART = {
  logo: require('../../assets/shellstore/logo.png'),
  ocean: require('../../assets/shellstore/ocean.png'),
  cashier: require('../../assets/shellstore/cashier.png'),
  customer: require('../../assets/characters/shell.png'),
};

/** Independent, state-driven graphics recreated from the flattened Figma artwork. */
export function Shell({ size = 48 }: { size?: number }) {
  const id = useId();
  return <Svg width={size} height={size} viewBox="0 0 64 64">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#FFA1AB" /><Stop offset="1" stopColor="#FF354F" /></LinearGradient></Defs>
    <Path d="M27 53C17 50 3 36 4 26Q4 15 15 19Q13 8 25 12Q31 1 39 11Q51 7 52 19Q63 17 61 29Q58 43 39 53L42 58Q32 62 22 58Z" stroke="white" strokeWidth="6" strokeLinejoin="round" fill="white" />
    <Path d="M27 53C17 50 3 36 4 26Q4 15 15 19Q13 8 25 12Q31 1 39 11Q51 7 52 19Q63 17 61 29Q58 43 39 53L42 58Q32 62 22 58Z" stroke="#E52E48" strokeWidth="2.4" strokeLinejoin="round" fill={`url(#${id})`} />
    <Path d="M28 51L15 22M31 50L25 15M34 50L39 15M37 51L52 23" stroke="#E73B50" strokeWidth="3" strokeLinecap="round" />
    <Ellipse cx="29" cy="15" rx="4" ry="3" fill="white" opacity=".85" /><Ellipse cx="13" cy="25" rx="3" ry="4" fill="white" opacity=".8" />
  </Svg>;
}

export function ShellPack({ count, width = 94, height = 58, badge = false, separated = false }: { count: number; width?: number; height?: number; badge?: boolean; separated?: boolean }) {
  const n = Math.max(0, count);
  if (separated) {
    const columns = Math.min(n, n > 9 ? 5 : 3);
    const rows = Math.ceil(n / Math.max(1, columns));
    const size = Math.min(38, width / Math.max(1, columns), height / Math.max(1, rows));
    return <View pointerEvents="none" style={{ width, height }}>
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / columns);
        const cells = Math.min(columns, n - row * columns);
        return <View key={i} style={{ position: 'absolute', left: (width - cells * size) / 2 + (i % columns) * size, top: row * size }}><Shell size={size} /></View>;
      })}
    </View>;
  }
  const rows = Math.ceil(n / 5);
  const size = Math.min(48, width / (Math.min(Math.max(n, 1), 5) * .62 + .38), (height - (badge ? 15 : 0)) / (1 + .58 * Math.max(0, rows - 1)));
  return <View pointerEvents="none" style={{ width, height }}>
    {Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / 5);
      const rowCount = Math.min(5, n - row * 5);
      const step = Math.min(size * .62, (width - size) / Math.max(1, rowCount - 1));
      return <View key={i} style={{ position: 'absolute', left: (width - size - step * (rowCount - 1)) / 2 + (i % 5) * step, top: row * (size * .58), transform: [{ rotate: `${((i % 3) - 1) * 9}deg` }] }}><Shell size={size} /></View>;
    })}
    {badge && <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}><OutlinedLabel text={`×${count}`} width={48} height={23} fontSize={19} pill /></View>}
  </View>;
}

export function OutlinedLabel({ text, width, height, fontSize = 28, fill = '#FFF', stroke = '#1440AE', pill = false }: { text: string; width: number; height: number; fontSize?: number; fill?: string; stroke?: string; pill?: boolean }) {
  return <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    {pill && <Rect x="1" y="1" width={width - 2} height={height - 2} rx={height / 2} fill="#F4FEFF" stroke="#009EE8" strokeWidth="1.5" />}
    <SvgText x={width / 2} y={height / 2 + fontSize * .35} textAnchor="middle" fontWeight="900" fontSize={fontSize} fill={pill ? '#132E88' : fill} stroke={pill ? 'none' : stroke} strokeWidth={pill ? 0 : 4} strokeLinejoin="round">{text}</SvgText>
    {!pill && <SvgText x={width / 2} y={height / 2 + fontSize * .35} textAnchor="middle" fontWeight="900" fontSize={fontSize} fill={fill}>{text}</SvgText>}
  </Svg>;
}

export function GlossyButton({ width, height, yellow = false }: { width: number; height: number; yellow?: boolean }) {
  const id = useId();
  return <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor={yellow ? '#FFF244' : '#8CFFFF'} /><Stop offset=".4" stopColor={yellow ? '#FFE213' : '#03F2F0'} /><Stop offset="1" stopColor={yellow ? '#FFB500' : '#00A8F5'} /></LinearGradient></Defs>
    <Rect x="3" y="6" width={width - 6} height={height - 8} rx={height / 2} fill={yellow ? '#FF741B' : '#2260CB'} />
    <Rect x="3" y="2" width={width - 6} height={height - 9} rx={height / 2} fill={`url(#${id})`} stroke="white" strokeWidth="4" />
    <Rect x="9" y="8" width={width - 18} height={height - 21} rx={(height - 18) / 2} fill="none" stroke={yellow ? '#FFF790' : '#7CFAFF'} strokeWidth="2" />
    <Ellipse cx="25" cy="18" rx="9" ry="4" fill="white" transform="rotate(-30 25 18)" /><Circle cx="15" cy="30" r="3" fill="white" />
  </Svg>;
}

export function Coin({ size = 32 }: { size?: number }) {
  const id = useId();
  return <Svg width={size} height={size} viewBox="0 0 40 40"><Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#FFF074" /><Stop offset="1" stopColor="#FF9900" /></LinearGradient></Defs><Circle cx="20" cy="20" r="18" fill="#FFB600" stroke="#B65B09" strokeWidth="2.5" /><Circle cx="20" cy="20" r="14" fill={`url(#${id})`} stroke="#FFF192" strokeWidth="2" /><Path d="M20 9L24 16L31 17L26 23L27 30L20 27L13 30L14 23L9 17L16 16Z" fill="#FFBE23" stroke="#FFF58B" strokeWidth="1.5" /></Svg>;
}

export function ShelfArt() {
  const id = useId();
  return <Svg width={360} height={266} viewBox="0 0 360 266">
    <Defs><LinearGradient id={`${id}a`} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#C9A7FF" /><Stop offset="1" stopColor="#427FF7" /></LinearGradient><LinearGradient id={`${id}b`} x1="0%" y1="0%" x2="100%" y2="100%"><Stop stopColor="#00BDF3" /><Stop offset="1" stopColor="#0066D4" /></LinearGradient><LinearGradient id={`${id}c`} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#FFF6B1" /><Stop offset="1" stopColor="#FFD46A" /></LinearGradient></Defs>
    <Path d="M20 65Q20 18 70 26Q105 -3 145 14Q180 -9 216 12Q258 -1 288 28Q339 18 340 65Z" fill={`url(#${id}a)`} stroke="white" strokeWidth="5" />
    <Rect x="12" y="48" width="336" height="208" rx="30" fill={`url(#${id}b)`} stroke="#81F2FF" strokeWidth="8" />
    {[104,168,232].map(y => <G key={y}><Path d={`M24 ${y}Q25 ${y - 15} 42 ${y - 15}H318Q337 ${y - 15} 338 ${y}V${y + 9}H24Z`} fill={`url(#${id}c)`} /><Rect x="24" y={y + 7} width="314" height="7" rx="3" fill="#6BEAFF" /></G>)}
    <Path d="M16 249V75Q16 47 33 48M345 249V75Q345 47 328 48" stroke="#A4F6FF" strokeWidth="12" fill="none" strokeLinecap="round" />
    <Path d="M74 20L79 31L92 30L83 40L88 53L74 47L63 55L65 41L55 33L69 31Z" fill="#FF91D4" stroke="#FFBBE7" strokeWidth="3" />
    <Circle cx="280" cy="44" r="6" fill="#D9EEFF" opacity=".5" /><Circle cx="295" cy="33" r="4" fill="white" opacity=".6" />
  </Svg>;
}

export function CounterArt({ width = 300, height = 112 }: { width?: number; height?: number }) {
  const id = useId();
  return <Svg width={width} height={height} viewBox="0 0 300 112">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#A491FF" /><Stop offset="1" stopColor="#7146F5" /></LinearGradient></Defs>
    <Rect x="5" y="12" width="290" height="94" rx="22" fill={`url(#${id})`} stroke="#FFF6DA" strokeWidth="4" />
    <Path d="M8 77Q40 55 73 77T143 77T213 77T292 76" fill="none" stroke="#C1A4FF" strokeWidth="9" opacity=".8" />
    <Rect x="3" y="4" width="294" height="23" rx="12" fill="#32C8F1" stroke="#DDFFFF" strokeWidth="4" /><Path d="M20 9H280" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <Ellipse cx="149" cy="64" rx="22" ry="15" fill="#DCD4FF" /><Path d="M166 64L185 48V80Z" fill="#DCD4FF" /><Circle cx="140" cy="61" r="3" fill="#8D79E9" />
    {[80,101,209,229].map((x,i)=><Circle key={x} cx={x} cy={49 + (i % 2) * 27} r="5" fill="#DCD4FF" />)}
  </Svg>;
}

export function Register() {
  return <Svg width={66} height={63} viewBox="0 0 66 63"><Rect x="28" y="38" width="10" height="18" rx="3" fill="#4585CE" /><Rect x="12" y="52" width="44" height="7" rx="3" fill="#66ACED" /><Rect x="3" y="3" width="60" height="42" rx="8" fill="#8BB6FF" stroke="#E7FFFF" strokeWidth="3" /><Rect x="8" y="8" width="50" height="30" rx="5" fill="#3262B0" /><Ellipse cx="30" cy="23" rx="12" ry="8" fill="#66A7FF" /><Path d="M39 23L50 14V32Z" fill="#66A7FF" /></Svg>;
}

export function BasketArt({ count, width = 130, height = 94 }: { count: number; width?: number; height?: number }) {
  return <View style={{ width, height }} pointerEvents="none">
    <Svg width={width} height={height} viewBox="0 0 130 94" style={StyleSheet.absoluteFill}><Path d="M31 28L39 6H95L103 28" stroke="#009E98" strokeWidth="6" fill="none" /><Path d="M7 31L20 85Q65 100 112 85L125 31Z" fill="#00C8B5" stroke="#75FFF0" strokeWidth="4" /></Svg>
    <View style={{ position: 'absolute', top: 2, left: 14 }}><ShellPack count={count} width={width - 28} height={50} badge={false} /></View>
    <Svg width={width} height={height} viewBox="0 0 130 94" style={StyleSheet.absoluteFill}><Path d="M12 46L20 85Q65 100 112 85L120 46Z" fill="#07C8B8" stroke="#73FFEE" strokeWidth="3" /><Rect x="5" y="37" width="120" height="13" rx="6" fill="#61F5DB" stroke="#C8FFEF" strokeWidth="3" />{[26,43,86,103].map(x=><Path key={x} d={`M${x} 58L${x + 1} 73`} stroke="#009D99" strokeWidth="6" strokeLinecap="round" />)}<Ellipse cx="64" cy="70" rx="13" ry="9" fill="#D8FFFF" /><Path d="M75 70L85 63V77Z" fill="#D8FFFF" /></Svg>
    <View style={{ position: 'absolute', left: (width - 44) / 2, top: 34 }}><OutlinedLabel text={String(count)} width={44} height={26} fontSize={22} pill /></View>
  </View>;
}

export function Character({ kind, width, height }: { kind: 'cashier' | 'customer'; width: number; height: number }) {
  return <Image source={ART[kind]} resizeMode="contain" style={{ width, height }} />;
}

export function Logo() {
  return <Image source={ART.logo} resizeMode="contain" style={{ width: 310, height: 140 }} />;
}
