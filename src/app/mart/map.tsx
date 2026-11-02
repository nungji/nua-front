import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartIcon } from '@/components/mart/MartIcon';
import { MartImagePlaceholder } from '@/components/mart/MartImagePlaceholder';
import { MartRoundButton } from '@/components/mart/MartRoundButton';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MART_WORDS } from '@/data/martWords';
import { MART_WORD_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartMap() {
  const router = useRouter();
  const wordStatus = useMartStore((state) => state.wordStatus);
  const startStage = useMartStore((state) => state.startStage);
  const allCompleted = MART_WORD_ORDER.every((id) => wordStatus[id] === 'completed');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="마트 지도" rightIcon="book" onPressRight={() => router.push('/mart/wordbook')} />
      <View className="flex-1 flex-row flex-wrap p-4 justify-between content-start">
        {MART_WORD_ORDER.map((wordId) => {
          const word = MART_WORDS[wordId];
          const status = wordStatus[wordId];
          const locked = status === 'locked';
          const icon = locked ? 'lock' : status === 'completed' ? 'check' : 'hand';
          return (
            <Pressable
              key={wordId}
              disabled={locked}
              onPress={() => {
                startStage(wordId);
                router.push(`/mart/stage/${wordId}`);
              }}
              className={`w-[140px] h-[146px] mb-4 rounded-2xl p-2 items-center bg-gray-50 ${
                locked ? 'opacity-50' : ''
              }`}
            >
              <View className="w-[80px] h-[24px] rounded bg-gray-200 items-center justify-center mb-1">
                <Text className="text-xs">{locked ? '' : word.label}</Text>
              </View>
              <MartImagePlaceholder imageSrc={word.imageSrc} className="w-[120px] h-[70px] rounded" />
              <View className="mt-1">
                <MartIcon name={icon} size={20} />
              </View>
            </Pressable>
          );
        })}
      </View>
      {allCompleted ? (
        <View className="items-center pb-6">
          <MartRoundButton variant="primary" icon="next" onPress={() => router.push('/mart/ending')} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
