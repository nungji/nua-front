import { Redirect, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartIcon } from '@/components/mart/MartIcon';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { getMartWordImage } from '@/data/martWordImages';
import { isRowUnlocked, MART_CORNERS } from '@/data/martWords';
import type { MartCornerId } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

function isMartCornerId(value: string | undefined): value is MartCornerId {
  return value === 'grocery' || value === 'household' || value === 'electronics';
}

export default function MartCornerScreen() {
  const { go } = useStageRouter();
  const { corner: cornerParam } = useLocalSearchParams<{ corner: string }>();
  const completedWords = useMartStore((state) => state.completedWords);
  const startStage = useMartStore((state) => state.startStage);

  if (!isMartCornerId(cornerParam)) {
    return <Redirect href="/games/mart/map" />;
  }

  const corner = MART_CORNERS[cornerParam];

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar title={corner.title} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24, gap: 18 }}>
          {corner.rows.map((row) => {
            const unlocked = isRowUnlocked(cornerParam, row.tier, completedWords);
            return (
              // 진열대 한 단: 위쪽 안내판 + 뒷판 + 상품이 올라간 선반 + 선반 앞에 걸린 상품표.
              <View
                key={row.tier}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: '#FFF6E5',
                  borderWidth: 4,
                  borderColor: '#B9731F',
                  opacity: unlocked ? 1 : 0.7,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: 7,
                    paddingHorizontal: 14,
                    backgroundColor: unlocked ? '#FF8A1F' : '#9AA7BC',
                  }}
                >
                  {!unlocked ? <MartIcon name="lock" size={14} /> : null}
                  <Text style={{ fontSize: 14, fontWeight: '800', color: 'white' }}>
                    {row.tier}. {row.label}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {row.words.map((word) => {
                    const completed = completedWords.has(word);
                    const wordImage = unlocked ? getMartWordImage(word) : undefined;
                    return (
                      <Pressable
                        key={word}
                        disabled={!unlocked}
                        onPress={() => {
                          startStage(word);
                          go(`/games/mart/stage/${word}`);
                        }}
                        style={{ flexGrow: 1, flexBasis: 100, alignItems: 'center' }}
                      >
                        {/* 선반 위 상품 */}
                        <View style={{ height: 76, justifyContent: 'flex-end', alignItems: 'center' }}>
                          {wordImage ? (
                            <Image
                              source={wordImage}
                              resizeMode="cover"
                              style={{
                                width: 76,
                                height: 60,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                borderWidth: 2,
                                borderColor: 'white',
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                width: 76,
                                height: 60,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                backgroundColor: unlocked ? '#A9DBFF' : '#D7DEE9',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {!unlocked ? <MartIcon name="lock" size={18} /> : null}
                            </View>
                          )}
                        </View>
                        {/* 선반 판 — 칸끼리 이어져 한 줄의 선반이 된다. */}
                        <View style={{ alignSelf: 'stretch', height: 4, backgroundColor: '#F7C873' }} />
                        <View style={{ alignSelf: 'stretch', height: 9, backgroundColor: '#E8A23D' }} />
                        <View style={{ alignSelf: 'stretch', height: 4, backgroundColor: '#B9731F' }} />
                        {/* 선반 앞에 걸린 상품표 — 스테이지를 깨기 전에는 가려져 있다. */}
                        <View style={{ height: 46, alignItems: 'center' }}>
                          <View style={{ width: 3, height: 5, backgroundColor: '#8A5A1A' }} />
                          <View
                            style={{
                              minWidth: 72,
                              height: 30,
                              paddingHorizontal: 6,
                              borderRadius: 6,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              backgroundColor: !unlocked ? '#E7EDF7' : completed ? '#E3FBE6' : 'white',
                              borderWidth: 2.5,
                              borderColor: !unlocked ? '#C7D3E6' : completed ? '#33C24D' : '#FF8A1F',
                            }}
                          >
                            <Text style={{ fontSize: 13, fontWeight: '800', color: '#1B3A6B' }}>
                              {completed ? word : '?'}
                            </Text>
                            {unlocked ? <MartIcon name={completed ? 'check' : 'hand'} size={13} /> : null}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </OceanBackground>
    </SafeAreaView>
  );
}
