import { Circle, Ellipse, G, Path } from 'react-native-svg';
import type { Piece } from './game/types';

// Painted details stay inside each existing collision shape and rotate with the piece.
const FACES: Record<number, string> = {
  1: 'pearl', 2: 'body', 3: 'head', 4: 'stem', 5: 'shell', 6: 'body',
  7: 'body', 8: 'cap', 9: 'hull', 10: 'head', 11: 'body', 12: 'body',
  13: 'body', 14: 'leafMiddle', 15: 'arch', 16: 'hull', 17: 'shell',
  18: 'body', 19: 'tower', 20: 'hall'
};

export function OceanPieceDetail({ piece }: { piece: Piece }) {
  const match = /^ocean(\d+)_(.+)$/.exec(piece.id);
  if (!match) return null;
  const stage = Number(match[1]);
  const part = match[2];
  const w = piece.width;
  const h = piece.height;
  const face = FACES[stage] === part;
  const unit = Math.min(w, h);
  const cy = stage === 20 ? h * .18 : piece.shape === 'dome' ? h * .63 : h * .5;
  const eye = Math.max(1.5, unit * 0.045);
  return <G>
    {(/shell|cap|head/.test(part) && piece.shape === 'dome') && <G stroke="#FFFFFF55" strokeWidth={Math.max(2, w * 0.025)} strokeLinecap="round">
      {[0.18, 0.34, 0.66, 0.82].map(x => <Path key={x} d={`M${w * x} 3 Q${w * x} ${h * .5} ${w * .5} ${h * .94}`} fill="none" />)}
    </G>}
    {(part === 'shell' && piece.shape === 'circle') && <Path d={`M${w * .7} ${h * .65} C${w * .96} ${h * .05} ${w * .1} ${h * .05} ${w * .2} ${h * .56} S${w * .76} ${h * .84} ${w * .6} ${h * .4} Q${w * .4} ${h * .25} ${w * .4} ${h * .5}`} fill="none" stroke="#FFFFFF70" strokeWidth={unit * .075} strokeLinecap="round" />}
    {(/leg|arm|flipper/.test(part)) && <G fill="#FFFFFF70">
      {[.3,.55,.8].map(y => <Circle key={y} cx={w * .5} cy={h * y} r={Math.min(w * .18,h * .09)} />)}
    </G>}
    {part === 'body' && [2,6,11,13].includes(stage) && <G fill="#FFFFFF45">
      {[.25,.45,.65].map(x => <Ellipse key={x} cx={w * x} cy={h * .24} rx={w * .055} ry={h * .035} />)}
    </G>}
    {part.startsWith('window') && <G><Circle cx={w/2} cy={h/2} r={unit*.39} fill="#30A9D7" stroke="#FFF2C8" strokeWidth={unit*.12} /><Ellipse cx={w*.4} cy={h*.35} rx={w*.12} ry={h*.08} fill="white" /></G>}
    {part === 'gate' && <Path d={`M${w*.2} ${h*.9}V${h*.4}Q${w*.5} 0 ${w*.8} ${h*.4}V${h*.9}`} fill="#73D4E3" stroke="#FFF0BF" strokeWidth={unit*.12} />}
    {face && <G>
      <Ellipse cx={w*.32} cy={cy+eye*1.8} rx={eye*1.8} ry={eye} fill="#FF91B2" opacity={.85} />
      <Ellipse cx={w*.68} cy={cy+eye*1.8} rx={eye*1.8} ry={eye} fill="#FF91B2" opacity={.85} />
      {![2, 10, 11, 13].includes(stage) && <G><Circle cx={w*.4} cy={cy} r={eye} fill="#253D68" /><Circle cx={w*.6} cy={cy} r={eye} fill="#253D68" />
      <Circle cx={w*.4-eye*.25} cy={cy-eye*.3} r={eye*.28} fill="white" /><Circle cx={w*.6-eye*.25} cy={cy-eye*.3} r={eye*.28} fill="white" /></G>}
      <Path d={`M${w*.46} ${cy+eye*1.7} Q${w*.5} ${cy+eye*3.4} ${w*.54} ${cy+eye*1.7}`} fill="none" stroke="#694374" strokeWidth={Math.max(1.5,eye*.65)} strokeLinecap="round" />
    </G>}
  </G>;
}
