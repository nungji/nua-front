import { Redirect, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartIcon } from '@/components/mart/MartIcon';
import { MartImagePlaceholder } from '@/components/mart/MartImagePlaceholder';
import { MartTopBar } from '@/components/mart/MartTopBar';
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
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title={corner.title} />
      <View className="flex-1 p-4 gap-5">
        {corner.rows.map((row) => {
          const unlocked = isRowUnlocked(cornerParam, row.tier, completedWords);
          return (
            <View key={row.tier} className={unlocked ? '' : 'opacity-40'}>
              <Text className="text-xs text-gray-500 mb-2">
                {row.tier}. {row.label}
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {row.words.map((word) => {
                  const completed = completedWords.has(word);
                  return (
                    <Pressable
                      key={word}
                      disabled={!unlocked}
                      onPress={() => {
                        startStage(word);
                        go(`/games/mart/stage/${word}`);
                      }}
                      className="w-[90px] h-[100px] rounded-2xl p-1 items-center bg-gray-50"
                    >
                      <View className="w-[60px] h-[18px] rounded bg-gray-200 items-center justify-center mb-1">
                        <Text className="text-[10px]">{unlocked ? word : ''}</Text>
                      </View>
                      <MartImagePlaceholder className="w-[80px] h-[50px] rounded" />
                      <View className="mt-1">
                        <MartIcon name={!unlocked ? 'lock' : completed ? 'check' : 'hand'} size={16} />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
