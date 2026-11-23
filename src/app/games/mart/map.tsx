import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MART_AWNING_COLORS, MartShelfPlank, MartStall } from '@/components/mart/MartStall';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanBookButton } from '@/components/mart/OceanCircleButton';
import { OceanLockBadge } from '@/components/mart/OceanDecor';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { getCornerWords, MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';
import { FONT } from '@/theme';

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export default function MartMap() {
  const { go } = useStageRouter();
  const cornerStatus = useMartStore((state) => state.cornerStatus);
  const completedWords = useMartStore((state) => state.completedWords);
  const { width, height } = useWindowDimensions();
  // 가로 화면에서는 세 코너를 나란히, 세로 화면에서는 위아래로 쌓는다.
  const landscape = width > height;

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar title="바다 마트" onPressWordbook={() => go('/games/mart/wordbook')} />
        <ScrollView
          contentContainerStyle={{
            flexDirection: landscape ? 'row' : 'column',
            paddingHorizontal: 20,
            paddingTop: landscape ? 40 : 8,
            paddingBottom: 130,
            gap: 22,
          }}
        >
          {MART_CORNER_ORDER.map((cornerId) => {
            const corner = MART_CORNERS[cornerId];
            const locked = cornerStatus[cornerId] === 'locked';
            const words = getCornerWords(cornerId);
            const doneCount = words.filter((word) => completedWords.has(word)).length;
            const progress = words.length > 0 ? doneCount / words.length : 0;

            return (
              <Pressable
                key={cornerId}
                disabled={locked}
                style={landscape ? { flex: 1 } : undefined}
                onPress={() => go(`/games/mart/corner/${cornerId}`)}
                accessibilityLabel={`${corner.title} 코너`}
              >
                <MartStall
                  awningColor={locked ? '#9AA7BC' : MART_AWNING_COLORS[cornerId]}
                  innerStyle={{ paddingHorizontal: 18, paddingTop: 18 }}
                >
                  {/* 진열대에 걸린 코너 이름판 */}
                  <View
                    style={{
                      alignSelf: 'center',
                      minWidth: '70%',
                      paddingVertical: 14,
                      paddingHorizontal: 24,
                      borderRadius: 16,
                      backgroundColor: locked ? '#E7EDF7' : '#FFF6E5',
                      borderWidth: 4,
                      borderColor: locked ? '#9AA7BC' : MART_AWNING_COLORS[cornerId],
                      alignItems: 'center',
                    }}
                  >
                    <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 40, fontFamily: FONT, color: locked ? '#8E99AB' : '#1B3A6B' }}>
                      {locked ? ' ' : corner.title}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 12 }}>
                    <View
                      style={{
                        flex: 1,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.35)',
                        overflow: 'hidden',
                      }}
                    >
                      <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: '#5CCB4E' }} />
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: FONT, color: 'white' }}>
                      {doneCount} / {words.length}
                    </Text>
                  </View>
                  <View style={{ marginHorizontal: -18 }}>
                    <MartShelfPlank dimmed={locked} />
                  </View>
                  {locked ? (
                    <View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <OceanLockBadge size={64} />
                    </View>
                  ) : null}
                </MartStall>
              </Pressable>
            );
          })}
        </ScrollView>
        <Image
          source={NUA_MASCOT}
          resizeMode="contain"
          style={{ position: 'absolute', left: 14, bottom: 14, width: 100, height: 100 }}
        />
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 18, alignItems: 'center' }}>
          <OceanBookButton
            displaySize={78}
            accessibilityLabel="단어장 (크게)"
            onPress={() => go('/games/mart/wordbook')}
          />
        </View>
      </OceanBackground>
    </SafeAreaView>
  );
}
