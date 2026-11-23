import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { Item } from './game';

/** New vector illustrations for the result panels missing from the Figma sketch. */
export function ItemArt({ item, size = 80, water = false }: { item: Item; size?: number; water?: boolean }) {
  return <Svg width={size} height={size} viewBox="0 0 100 100">{item === 'bucket' ? <>
    <Path d="M25 40Q25 1 50 8Q75 1 75 40" fill="none" stroke="#8B7356" strokeWidth="6" />
    <Path d="M15 33L26 88Q50 98 74 88L85 33Z" fill="#DBAF72" stroke="#9A7856" strokeWidth="3" />
    <Ellipse cx="50" cy="34" rx="35" ry="9" fill={water ? '#78BBDA' : '#F5D8A6'} stroke="#9A7856" strokeWidth="3" />
    <Path d="M32 48L37 82M68 48L63 82" stroke="#FBE7BB" strokeWidth="5" strokeLinecap="round" />
  </> : <><Path d="M34 9H68V57L85 64Q99 80 83 89H36Q22 84 26 69L34 53Z" fill="#E99EAE" stroke="#BE7E92" strokeWidth="3" /><Path d="M34 21H68M34 30H68" stroke="#FFE5E8" strokeWidth="7" /><Path d="M29 71Q44 69 44 90M72 61Q62 75 70 90" fill="#F8C8D0" /></>}</Svg>;
}

function Squirrel({ happy }: { happy: boolean }) {
  return <G><Path d="M210 287Q280 240 258 213Q230 193 237 238" fill="none" stroke="#B88B62" strokeWidth="27" strokeLinecap="round" />
    <Ellipse cx="172" cy="284" rx="64" ry="49" fill="#BB8D65" /><Ellipse cx="171" cy="300" rx="32" ry="32" fill="#F3DEB8" />
    <Path d="M131 174L117 124L160 151M194 151L231 125L216 176" fill="#BB8D65" /><Path d="M132 158L127 139L148 153M206 155L221 139L216 162" fill="#F3DEB8" />
    <Ellipse cx="172" cy="199" rx="52" ry="47" fill="#BB8D65" />
    <Circle cx="153" cy="194" r="7" fill="#40342A" /><Circle cx="191" cy="194" r="7" fill="#40342A" /><Ellipse cx="172" cy="210" rx="7" ry="5" fill="#40342A" />
    <Path d={happy ? 'M158 223Q172 240 186 223' : 'M160 234Q172 218 184 234'} fill="none" stroke="#40342A" strokeWidth="5" strokeLinecap="round" />
    <Circle cx="135" cy="215" r="8" fill="#CA9278" /><Circle cx="209" cy="215" r="8" fill="#CA9278" />
    {!happy && <Path d="M139 205Q125 226 138 229Q149 225 139 205" fill="#8BC9E6" />}
  </G>;
}

export function ResultArt({ item, page, size }: { item: Item; page: number; size: number }) {
  const happy = item === 'bucket' && page === 3;
  const flower = item === 'bucket' && page >= 2;
  return <Svg width={size} height={size} viewBox="0 0 360 360">
    <Rect width="360" height="360" rx="20" fill="#D1E5F1" /><Circle cx="307" cy="45" r="25" fill="#F8E29A" />
    <Path d="M0 160Q100 90 230 155Q310 165 360 140V360H0Z" fill="#C7DCAF" />
    {!flower && <><Ellipse cx="180" cy="235" rx="157" ry="66" fill="#73B2D5" /><Path d="M51 221Q82 204 108 218M244 215Q281 201 309 218" fill="none" stroke="#B7E7F6" strokeWidth="7" strokeLinecap="round" /></>}
    <G transform="translate(-70 0)"><Squirrel happy={happy} /></G>
    {flower && <><Path d="M244 290L254 342H310L320 290Z" fill="#BA805C" /><Ellipse cx="282" cy="290" rx="40" ry="10" fill="#806C46" /><Path d={happy ? 'M282 289V234' : 'M282 289Q272 237 309 258'} fill="none" stroke="#8EAA70" strokeWidth="8" />
    <G transform={happy ? 'translate(282 226)' : 'translate(310 254)'}>{[0, 60, 120, 180, 240, 300].map(angle => <Ellipse key={angle} cx="0" cy="-16" rx="11" ry="16" fill={happy ? '#F3C96A' : '#C0B584'} transform={`rotate(${angle})`} />)}<Circle r="11" fill={happy ? '#C88D43' : '#A49A69'} /></G></>}
    <G transform={page === 2 && item === 'bucket' ? 'translate(230 200) rotate(40)' : 'translate(170 245)'}>
      {item === 'bucket' ? <><Path d="M8 8Q8 -30 33 -30Q58 -30 58 8" fill="none" stroke="#8B7356" strokeWidth="5" /><Path d="M0 0L10 62H56L66 0Z" fill="#DBAF72" stroke="#9A7856" strokeWidth="3" /><Ellipse cx="33" cy="0" rx="33" ry="8" fill={page > 0 ? '#74BADA' : '#F5D8A6'} /></> : <Path d="M0 -20H29V30L49 37Q61 57 43 62H4Q-10 57 -3 40Z" fill="#E99EAE" stroke="#BE7E92" strokeWidth="3" />}
    </G>
    {((item === 'sock' && page === 2) || (item === 'bucket' && page === 2)) && [0, 1, 2].map(i => <Path key={i} d={`M${225 + i * 18} ${288 + i * 5}q-13 20 0 23q13-3 0-23`} fill="#77BBDA" />)}
    {happy && <Path d="M55 68L70 85L99 51" fill="none" stroke="#4B9074" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>;
}
