import { View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { CustomerId, ItemId, Mood } from '../game/types';
import { Customer } from './Customer';
import { ItemArt } from './Item';
import { Shopkeeper } from './Shopkeeper';
import { LINE, WOOD, WOOD_DARK } from './colors';

type StallProps = {
  width: number;
  height: number;
  landscape: boolean;
  customer: CustomerId;
  customerMood?: Mood;
  items?: ItemId[];
  tried?: ItemId[];
  hintItem?: ItemId | null;
  onPick?: (item: ItemId) => void;
  handover?: ItemId | null;
  entering?: boolean;
};

const COUNTER_BOTTOM = '15%';

/** Shelf rows: four on the top board, the rest on the lower one. */
function splitRows(items: ItemId[]) {
  return [items.slice(0, 4), items.slice(4)];
}

export function Stall({
  width,
  height,
  landscape,
  customer,
  customerMood = 'sad',
  items,
  tried = [],
  hintItem = null,
  onPick,
  handover = null,
  entering = false
}: StallProps) {
  const rows = items ? (landscape ? [items] : splitRows(items)) : [];
  const perRow = rows[0]?.length ?? 4;
  const tile = Math.min(landscape ? 78 : 74, Math.floor((width * 0.9 - (perRow - 1) * 8) / perRow));
  const customerWidth = Math.min(landscape ? height * 0.62 : width * 0.42, 210);
  const keeperWidth = Math.min(landscape ? height * 0.68 : width * 0.4, 200);

  const customerNode = <Customer id={customer} mood={customerMood} width={customerWidth} />;

  return (
    <View className="flex-1" style={{ backgroundColor: '#F6E7CB' }}>
      {/* wall */}
      <Svg width="100%" height="100%" style={{ position: 'absolute' }} viewBox="0 0 200 300" preserveAspectRatio="none">
        <Rect x={0} y={0} width={200} height={300} fill="#F6E7CB" />
        <Path d="M0 152 H200 M0 232 H200" stroke="#EFDCBB" strokeWidth={1.5} />
        <Path d="M24 96 V150 M72 96 V150 M120 96 V150 M168 96 V150" stroke="#EED9B6" strokeWidth={1.5} />
      </Svg>

      {/* left doorway */}
      <View style={{ position: 'absolute', left: 0, bottom: 0, width: width * 0.15, height: '78%' }}>
        <Svg width="100%" height="100%" viewBox="0 0 56 150" preserveAspectRatio="none">
          <Rect x={0} y={0} width={56} height={150} fill="#8A6446" />
          <Rect x={7} y={8} width={42} height={142} fill="#FBE7C0" />
          <Rect x={7} y={8} width={42} height={142} fill="#F2A649" opacity={0.16} />
          <Rect x={0} y={0} width={56} height={10} fill="#6F4F35" />
          <Rect x={46} y={8} width={3} height={142} fill="#6F4F35" opacity={0.35} />
        </Svg>
      </View>

      {/* wall sign */}
      <View style={{ position: 'absolute', top: '36%', right: width * 0.08 }}>
        <Svg width={92} height={74} viewBox="0 0 92 74">
          <Rect x={0} y={0} width={92} height={74} rx={8} fill="#F7EEDD" stroke="#C08A5E" strokeWidth={4} />
          <Path d="M30 46 h32 l-4 16 h-24 Z" fill="#8FA8BF" />
          <Path d="M34 46 q14 -12 24 0" stroke="#5D7387" strokeWidth={3.4} fill="none" />
          <Path d="M38 30 q6 -8 16 -6" stroke="#7FB86E" strokeWidth={3} fill="none" strokeLinecap="round" />
        </Svg>
      </View>

      {/* display shelf */}
      {items ? (
        <View style={{ position: 'absolute', top: landscape ? 6 : 10, left: width * 0.04, right: width * 0.04 }}>
          <View
            style={{
              borderRadius: 20,
              borderWidth: 7,
              borderColor: WOOD_DARK,
              backgroundColor: '#F1DFC0',
              paddingHorizontal: 8,
              paddingTop: 10,
              paddingBottom: 6
            }}
          >
            {rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`}>
                <View className="flex-row items-end justify-around">
                  {row.map((item) => {
                    const used = tried.includes(item);
                    const hinted = hintItem === item && !used;

                    return (
                      <View
                        key={item}
                        accessibilityRole="button"
                        accessibilityLabel={item}
                        onStartShouldSetResponder={() => !used}
                        onResponderRelease={() => {
                          if (!used) {
                            onPick?.(item);
                          }
                        }}
                        style={{
                          width: tile,
                          height: tile,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 16,
                          backgroundColor: used ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
                          borderWidth: hinted ? 3 : 2,
                          borderColor: hinted ? '#F2C14E' : 'rgba(176,128,80,0.25)',
                          opacity: used ? 0.45 : 1
                        }}
                      >
                        <ItemArt id={item} width={Math.round(tile * 0.8)} />
                      </View>
                    );
                  })}
                </View>

                <View
                  style={{
                    height: 10,
                    marginTop: 2,
                    marginHorizontal: -8,
                    borderRadius: 5,
                    backgroundColor: WOOD
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* shopkeeper behind the counter */}
      <View style={{ position: 'absolute', right: width * 0.02, bottom: '9%' }}>
        <Shopkeeper width={keeperWidth} />
      </View>

      {/* counter top */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: COUNTER_BOTTOM, height: 16 }}>
        <Svg width="100%" height="100%" viewBox="0 0 200 16" preserveAspectRatio="none">
          <Rect x={0} y={0} width={200} height={13} fill="#D6A87C" />
          <Rect x={0} y={11} width={200} height={5} fill="#A06E45" />
        </Svg>
      </View>

      {/* counter front */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: COUNTER_BOTTOM }}>
        <Svg width="100%" height="100%" viewBox="0 0 200 120" preserveAspectRatio="none">
          <Rect x={0} y={0} width={200} height={120} fill="#C08A5E" />
          <Rect x={0} y={0} width={200} height={120} fill="#A06E45" opacity={0.16} />
          <Path d="M14 12 V110 M54 12 V110 M94 12 V110 M134 12 V110 M174 12 V110" stroke="#A06E45" strokeWidth={2} opacity={0.45} />
          <Rect x={0} y={0} width={200} height={4} fill="#D6A87C" />
        </Svg>
      </View>

      {/* handover object over the counter */}
      {handover ? (
        <View style={{ position: 'absolute', left: width * 0.43, bottom: '13.5%' }}>
          <ItemArt id={handover} width={58} />
        </View>
      ) : null}

      {/* the customer, walking in from the doorway */}
      {entering ? (
        <Animated.View
          entering={SlideInLeft.springify().damping(16)}
          style={{ position: 'absolute', left: width * 0.07, bottom: '2%' }}
        >
          {customerNode}
        </Animated.View>
      ) : (
        <View style={{ position: 'absolute', left: width * 0.07, bottom: '2%' }}>{customerNode}</View>
      )}

      <View
        style={{
          position: 'absolute',
          left: width * 0.04,
          right: width * 0.04,
          bottom: 4,
          height: 3,
          borderRadius: 2,
          backgroundColor: LINE,
          opacity: 0.3
        }}
      />
    </View>
  );
}
