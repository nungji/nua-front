import { View } from 'react-native';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { CustomerId, ItemId } from '../game/types';
import { ItemArt } from './Item';
import { CustomerArt } from './Sea';
import { Shopkeeper } from './Shopkeeper';
import { LINE, WOOD, WOOD_DARK } from './colors';

type MartProps = {
  width: number;
  height: number;
  landscape: boolean;
  customer: CustomerId;
  items: ItemId[];
  tried?: ItemId[];
  hintItem?: ItemId | null;
  onPick?: (item: ItemId) => void;
  entering?: boolean;
};

const WATER_WALL = '#CFEAF2';
const SAND = '#EFDCB0';

function splitRows(items: ItemId[]) {
  return [items.slice(0, 4), items.slice(4)];
}

/** Underwater mart interior: two empty shelf boards, counter, hero on the right, customer at the door. */
export function Mart({
  width,
  height,
  landscape,
  customer,
  items,
  tried = [],
  hintItem = null,
  onPick,
  entering = false
}: MartProps) {
  const rows = landscape ? [items] : splitRows(items);
  const perRow = rows[0]?.length ?? 4;
  const tile = Math.min(landscape ? 76 : 74, Math.floor((width * 0.56 - (perRow - 1) * 8) / perRow));
  const customerWidth = Math.min(landscape ? height * 0.6 : width * 0.4, 200);
  const keeperWidth = Math.min(landscape ? height * 0.58 : width * 0.38, 190);

  return (
    <View className="flex-1" style={{ backgroundColor: WATER_WALL }}>
      {/* water wall + sand floor */}
      <Svg width="100%" height="100%" style={{ position: 'absolute' }} viewBox="0 0 200 200" preserveAspectRatio="none">
        <Rect x={0} y={0} width={200} height={200} fill={WATER_WALL} />
        <Rect x={0} y={0} width={200} height={200} fill="#7FD3E8" opacity={0.16} />
        <Path d="M0 40 q30 -14 60 0 q30 14 60 0 q30 -14 60 0" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.25} />
        <Path d="M0 76 q30 12 60 0 q30 -12 60 0 q30 12 60 0" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.2} />
        <Rect x={0} y={132} width={200} height={68} fill={SAND} />
        <Path d="M0 132 H200" stroke="#E2CB9A" strokeWidth={2} />
        <Path d="M0 150 q34 -10 68 0 q34 10 68 0 q34 -10 64 0" stroke="#E2CB9A" strokeWidth={1.6} fill="none" opacity={0.7} />
        <Path d="M12 130 q-6 -26 6 -36 q4 20 -2 36" stroke="#4FA36E" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path d="M188 130 q8 -22 -4 -34 q-6 18 0 34" stroke="#4FA36E" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Circle cx={168} cy={54} r={5} fill="#FFFFFF" opacity={0.5} />
        <Circle cx={178} cy={40} r={3} fill="#FFFFFF" opacity={0.4} />
        <Circle cx={30} cy={62} r={4} fill="#FFFFFF" opacity={0.45} />
      </Svg>

      {/* shelf unit, two empty boards */}
      <View style={{ position: 'absolute', left: width * 0.2, right: width * 0.2, top: landscape ? 6 : 10 }}>
        <View
          style={{
            borderRadius: 14,
            borderWidth: 6,
            borderColor: WOOD_DARK,
            backgroundColor: '#F7EBD6',
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 4
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
                        borderRadius: 12,
                        backgroundColor: used ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
                        borderWidth: hinted ? 3 : 2,
                        borderColor: hinted ? '#F2C14E' : 'rgba(176,128,80,0.22)',
                        opacity: used ? 0.45 : 1
                      }}
                    >
                      <ItemArt id={item} width={Math.round(tile * 0.78)} />
                    </View>
                  );
                })}
              </View>

              <View style={{ height: 9, marginTop: 2, marginHorizontal: -8, borderRadius: 5, backgroundColor: WOOD }} />
            </View>
          ))}
        </View>
      </View>

      {/* counter at the bottom right of the frame */}
      <View style={{ position: 'absolute', left: width * 0.46, right: 0, bottom: 0, height: '30%' }}>
        <Svg width="100%" height="100%" viewBox="0 0 120 90" preserveAspectRatio="none">
          <Rect x={0} y={0} width={120} height={90} fill="#C08A5E" />
          <Rect x={0} y={0} width={120} height={90} fill="#A06E45" opacity={0.18} />
          <Rect x={0} y={0} width={120} height={12} fill="#D6A87C" />
          <Path d="M18 16 V86 M48 16 V86 M78 16 V86 M108 16 V86" stroke="#A06E45" strokeWidth={2} opacity={0.4} />
        </Svg>
      </View>

      {/* hero behind the counter */}
      <View style={{ position: 'absolute', right: width * 0.1, bottom: '27%' }}>
        <Shopkeeper width={keeperWidth} />
      </View>

      {/* customer at the entrance */}
      {entering ? (
        <Animated.View
          entering={SlideInLeft.springify().damping(16)}
          style={{ position: 'absolute', left: width * 0.06, bottom: '2%' }}
        >
          <CustomerArt id={customer} mood="sad" width={customerWidth} />
        </Animated.View>
      ) : (
        <View style={{ position: 'absolute', left: width * 0.06, bottom: '2%' }}>
          <CustomerArt id={customer} mood="sad" width={customerWidth} />
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          left: width * 0.05,
          right: width * 0.05,
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
