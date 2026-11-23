import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ShellPack } from './PortraitArt';

/** Picture-only speech bubble. The explanation is available to screen readers. */
export function OrderFeedback({ count, target }: { count: number; target: number }) {
  const correct = count === target;
  const excess = count > target;
  const difference = Math.abs(count - target);
  const color = correct ? '#20BFA0' : '#EF9D3B';
  return <View testID={correct ? 'order-feedback-correct' : excess ? 'order-feedback-excess' : 'order-feedback-short'} accessible accessibilityLabel={correct ? '주문에 딱 맞아요. 고마워요!' : excess ? `조개 ${difference}개를 덜어 주세요` : `조개 ${difference}개를 더 담아 주세요`} style={{ position: 'absolute', left: 165, top: 220, width: 209, height: 130, borderRadius: 34, borderWidth: 4, borderColor: 'white', backgroundColor: correct ? '#DDFFF2' : '#FFF3CF', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 #8BD4E8' }}>
    <View style={{ position: 'absolute', right: 38, bottom: -18, width: 23, height: 23, borderRadius: 12, borderWidth: 3, borderColor: 'white', backgroundColor: correct ? '#DDFFF2' : '#FFF3CF' }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Svg width={66} height={66} viewBox="0 0 64 64">
        <Circle cx="32" cy="32" r="28" fill={color} stroke="white" strokeWidth="4" />
        {correct ? <Path d="M18 32L28 42L47 22" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" /> : <>
          <Path d="M18 32H46" stroke="white" strokeWidth="7" strokeLinecap="round" />
          {!excess && <Path d="M32 18V46" stroke="white" strokeWidth="7" strokeLinecap="round" />}
        </>}
      </Svg>
      <ShellPack count={correct ? target : difference} width={105} height={74} separated />
    </View>
    {correct && <Svg width={60} height={20} viewBox="0 0 60 20"><Path d="M22 5Q15 -3 12 5Q10 10 22 18Q34 10 32 5Q29 -3 22 5" fill="#FF82B6" /><Path d="M48 2L50 7L56 8L51 12L52 18L47 15L42 18L43 12L39 8L45 7Z" fill="#FFD052" /></Svg>}
  </View>;
}
