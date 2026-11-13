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
              <View
                key={row.tier}
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(234,247,255,0.94)',
                  borderWidth: 3,
                  borderColor: '#8FD0FF',
                  padding: 14,
                  opacity: unlocked ? 1 : 0.85,
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 34,
                    backgroundColor: '#F5C26B',
                    opacity: 0.55,
                  }}
                />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1B3A6B', marginBottom: 10 }}>
                  {row.tier}. {row.label}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
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
                        style={{
                          width: 92,
                          height: 104,
                          borderRadius: 18,
                          alignItems: 'center',
                          padding: 6,
                          backgroundColor: 'white',
                          borderWidth: 2,
                          borderColor: !unlocked ? '#C7D3E6' : completed ? '#33C24D' : '#7CC4FF',
                          opacity: !unlocked ? 0.5 : 1,
                        }}
                      >
                        <View
                          style={{
                            width: 66,
                            height: 24,
                            borderRadius: 6,
                            backgroundColor: !unlocked ? '#E7EDF7' : completed ? '#E3FBE6' : '#EAF7FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 4,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#1B3A6B' }}>{unlocked ? word : '?'}</Text>
                        </View>
                        {wordImage ? (
                          <Image
                            source={wordImage}
                            resizeMode="cover"
                            style={{ width: 72, height: 48, borderRadius: 10 }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 72,
                              height: 48,
                              borderRadius: 10,
                              backgroundColor: !unlocked ? '#D7E3F2' : '#A9DBFF',
                            }}
                          />
                        )}
                        <View style={{ marginTop: 4 }}>
                          <MartIcon name={!unlocked ? 'lock' : completed ? 'check' : 'hand'} size={16} />
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
