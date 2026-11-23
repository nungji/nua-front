import type { ReactNode } from 'react';
import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

const AWNING_STRIPE_WIDTH = 44;
const STALL_WOOD = '#F6C453';
const STALL_WOOD_DARK = '#D9902A';
const STALL_BACK = '#4A4E69';

/** 코너별 차양 줄무늬 색. */
export const MART_AWNING_COLORS = {
  grocery: '#E8413B',
  household: '#FF5FA2',
  electronics: '#7B4DFF',
} as const;

function stripeColor(index: number, color: string): string {
  return index % 2 === 0 ? color : 'white';
}

/** 진열대 위의 줄무늬 차양. 아래 끝은 반원 물결 모양. 줄무늬 폭은 화면 폭과 상관없이 비슷하게 유지한다. */
function MartAwning({ color, small }: { color: string; small?: boolean }) {
  const [width, setWidth] = useState(0);
  const count = small ? 5 : Math.max(8, Math.round(width / AWNING_STRIPE_WIDTH));
  const stripes = Array.from({ length: count }, (_, i) => i);
  const scallopHeight = width > 0 ? width / count / 2 : 0;

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <View
        style={{
          flexDirection: 'row',
          height: small ? 12 : 30,
          borderTopLeftRadius: small ? 6 : 14,
          borderTopRightRadius: small ? 6 : 14,
          overflow: 'hidden',
        }}
      >
        {stripes.map((i) => (
          <View key={i} style={{ flex: 1, backgroundColor: stripeColor(i, color) }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', height: scallopHeight }}>
        {stripes.map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: stripeColor(i, color),
              borderBottomLeftRadius: scallopHeight,
              borderBottomRightRadius: scallopHeight,
            }}
          />
        ))}
      </View>
    </View>
  );
}

/** 선반 판 한 장. 칸들 아래에 깔면 칸끼리 이어져 한 줄의 선반이 된다. */
export function MartShelfPlank({ dimmed }: { dimmed?: boolean }) {
  return (
    <View style={{ alignSelf: 'stretch' }}>
      <View style={{ height: 4, backgroundColor: dimmed ? '#D5DBE5' : '#FBE3A6' }} />
      <View style={{ height: 8, backgroundColor: dimmed ? '#B4BECD' : STALL_WOOD }} />
      <View style={{ height: 4, backgroundColor: dimmed ? '#8E99AB' : STALL_WOOD_DARK }} />
    </View>
  );
}

interface MartStallProps {
  awningColor: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** 진열대 안쪽(어두운 뒷판)의 스타일. */
  innerStyle?: StyleProp<ViewStyle>;
  /** 상품 하나짜리 작은 진열대. */
  small?: boolean;
}

/** 줄무늬 차양 + 나무 틀 + 어두운 뒷판으로 된 마트 진열대. 안쪽 내용은 children으로 채운다. */
export function MartStall({ awningColor, children, style, innerStyle, small }: MartStallProps) {
  return (
    <View style={style}>
      <View style={{ zIndex: 1 }}>
        <MartAwning color={awningColor} small={small} />
      </View>
      <View
        style={{
          marginHorizontal: small ? 4 : 10,
          marginTop: small ? -5 : -12,
          backgroundColor: STALL_WOOD,
          borderWidth: small ? 3 : 5,
          borderTopWidth: 0,
          borderColor: STALL_WOOD_DARK,
          borderBottomLeftRadius: small ? 6 : 10,
          borderBottomRightRadius: small ? 6 : 10,
          paddingTop: small ? 6 : 14,
          paddingHorizontal: small ? 3 : 8,
          paddingBottom: small ? 4 : 10,
        }}
      >
        <View style={[{ backgroundColor: STALL_BACK, borderRadius: small ? 4 : 6, overflow: 'hidden' }, innerStyle]}>
          {children}
        </View>
      </View>
    </View>
  );
}
