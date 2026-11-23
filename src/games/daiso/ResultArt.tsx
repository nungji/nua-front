import { useId } from 'react';
import { Image, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { GAME_CHARACTERS } from '@/components/GameCharacter';
import type { Item } from './game';

export function ItemArt({ item, size = 80, water = false }: { item: Item; size?: number; water?: boolean }) {
  const id = useId();
  return <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs><LinearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%"><Stop stopColor="#98F4F4" /><Stop offset="1" stopColor="#29B8D7" /></LinearGradient></Defs>
    {item === 'bucket' ? <>
      <Path d="M25 40Q25 1 50 8Q75 1 75 40" fill="none" stroke="white" strokeWidth="10" />
      <Path d="M25 40Q25 1 50 8Q75 1 75 40" fill="none" stroke="#FFD36D" strokeWidth="6" />
      <Path d="M15 33L26 88Q50 98 74 88L85 33Z" fill={`url(#${id})`} stroke="white" strokeWidth="6" />
      <Ellipse cx="50" cy="34" rx="35" ry="9" fill={water ? '#208FDD' : '#D6FFFF'} stroke="#61D9E8" strokeWidth="3" />
      <Path d="M32 48L37 77" stroke="white" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <Path d="M45 73Q32 61 40 58Q43 51 49 57Q55 49 59 57Q68 54 63 65L54 74L56 79H44Z" fill="#FF9CCB" stroke="white" strokeWidth="2" />
    </> : <><Path d="M34 9H68V57L85 64Q99 80 83 89H36Q22 84 26 69L34 53Z" fill="#C29CFA" stroke="white" strokeWidth="6" /><Path d="M34 21H68M34 30H68" stroke="#F6E9FF" strokeWidth="7" /><Path d="M29 71Q44 69 44 90M72 61Q62 75 70 90" fill="#E4C8FF" /><Path d="M49 42L52 49L60 49L54 54L56 62L49 58L43 62L45 54L39 49L47 49Z" fill="#FFE181" /></>}
  </Svg>;
}

export type OceanScene = 'wilt' | 'spring' | 'shop' | 'carry' | 'scoop' | 'pour' | 'happy' | 'leak';

/** Original nua PNG characters layered with native sea scenery; no substitute mascot. */
export function OceanStoryPanel({ scene, size, item = 'bucket' }: { scene: OceanScene; size: number; item?: Item }) {
  const happy = scene === 'happy';
  const flower = scene === 'wilt' || scene === 'pour' || happy;
  const hasItem = ['carry', 'scoop', 'pour', 'leak'].includes(scene);
  return <View testID={`daiso-scene-${scene}`} style={{ width: size, height: size, borderRadius: size * .08, overflow: 'hidden', backgroundColor: '#77E5F5', borderWidth: 3, borderColor: '#E8FFFF' }}>
    <Image source={require('../../assets/design/bg/ocean.png')} resizeMode="cover" style={{ position: 'absolute', width: size, height: size }} />
    <Svg width={size} height={size} viewBox="0 0 360 360" style={{ position: 'absolute' }}>
      <Path d="M0 292Q105 257 205 292Q280 312 360 283V360H0Z" fill="#FFE5A2" />
      <Ellipse cx="260" cy="324" rx="76" ry="16" fill="#DDBB7360" />
      {!flower && scene !== 'shop' && <><Ellipse cx="260" cy="281" rx="69" ry="39" fill="#38CADA" stroke="#BEFFFF" strokeWidth="5" /><Path d="M213 278Q254 238 298 279M226 263Q251 185 279 262" fill="none" stroke="#9EF4FF" strokeWidth="7" strokeLinecap="round" /><Circle cx="251" cy="207" r="6" fill="#C5FFFF" /></>}
      {scene === 'shop' && <><Rect x="195" y="175" width="145" height="137" rx="16" fill="#D1F9FC" stroke="white" strokeWidth="5" /><Path d="M190 166H345L336 200Q319 212 303 200Q286 213 270 200Q253 213 237 200Q220 212 198 200Z" fill="#8A7AE4" stroke="white" strokeWidth="4" /><Rect x="217" y="230" width="102" height="12" rx="6" fill="#69C9DC" /><Rect x="217" y="275" width="102" height="12" rx="6" fill="#69C9DC" /><Circle cx="237" cy="218" r="10" fill="#FFA4CE" /><Path d="M278 213L284 199L290 213L304 214L294 224L296 235L284 229L273 235L275 222L265 214Z" fill="#FFD66F" /></>}
      {flower && <><Path d="M232 292L244 337Q269 348 299 337L311 292Z" fill="#AB83E6" stroke="white" strokeWidth="4" /><Ellipse cx="271" cy="292" rx="40" ry="10" fill="#6C4BB0" /><Path d={happy ? 'M271 289V222' : 'M271 289Q260 228 307 256'} fill="none" stroke="#5FBA99" strokeWidth="8" strokeLinecap="round" /><G transform={happy ? 'translate(271 218)' : 'translate(306 252)'}>{[0,60,120,180,240,300].map(angle => <Ellipse key={angle} cx="0" cy="-15" rx="10" ry="15" fill={happy ? '#FF9CCB' : '#C1B8DA'} transform={`rotate(${angle})`} />)}<Circle r="10" fill={happy ? '#FFE18A' : '#A1A4BA'} /></G></>}
      {(scene === 'pour' || scene === 'leak') && [0, 1, 2].map(i => <Path key={i} d={`M${scene === 'pour' ? 250 + i * 12 : 198 + i * 12} ${scene === 'pour' ? 236 + i * 13 : 273 + i * 13}q-8 15 0 17q8-2 0-17`} fill="#5FCAFF" stroke="#DAFFFF" strokeWidth="1" />)}
    </Svg>
    <Image testID="daiso-story-shark" source={GAME_CHARACTERS.fruitstore} resizeMode="contain" style={{ position: 'absolute', left: size * .02, top: size * .27, width: size * .53, height: size * .66 }} />
    {hasItem && <View pointerEvents="none" style={{ position: 'absolute', left: size * (scene === 'pour' ? .49 : .38), top: size * (scene === 'pour' ? .45 : .61), transform: [{ rotate: scene === 'pour' ? '40deg' : '0deg' }] }}><ItemArt item={item} size={size * .25} water={scene === 'scoop' || scene === 'pour'} /></View>}
    <View pointerEvents="none" style={{ position: 'absolute', left: size * .12, top: size * .08, width: size * .25, height: size * .16, borderRadius: size * .07, backgroundColor: '#F3FFFF', borderWidth: 2, borderColor: '#A6F3FF', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size * .16} height={size * .1} viewBox="0 0 60 40">{happy ? <Path d="M5 19L22 34L53 5" stroke="#31C6AB" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : scene === 'leak' || scene === 'wilt' ? <><Circle cx="18" cy="12" r="3" fill="#3983A9" /><Circle cx="42" cy="12" r="3" fill="#3983A9" /><Path d="M17 31Q30 17 43 31" stroke="#3983A9" strokeWidth="4" fill="none" strokeLinecap="round" /></> : <Path d="M30 2Q7 29 30 37Q53 29 30 2Z" fill="#51CAEF" />}</Svg>
    </View>
  </View>;
}

export function ResultArt({ item, page, size }: { item: Item; page: number; size: number }) {
  const scenes: OceanScene[] = item === 'bucket' ? ['carry', 'scoop', 'pour', 'happy'] : ['carry', 'scoop', 'leak'];
  return <OceanStoryPanel scene={scenes[page]} size={size} item={item} />;
}
