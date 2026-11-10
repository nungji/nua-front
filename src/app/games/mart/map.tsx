import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartIcon } from '@/components/mart/MartIcon';
import { MartImagePlaceholder } from '@/components/mart/MartImagePlaceholder';
import { MartRoundButton } from '@/components/mart/MartRoundButton';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartMap() {
  const { go } = useStageRouter();
  const cornerStatus = useMartStore((state) => state.cornerStatus);
  const allCompleted = MART_CORNER_ORDER.every((id) => cornerStatus[id] === 'completed');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="마트 지도" rightIcon="book" onPressRight={() => go('/games/mart/wordbook')} />
      <View className="flex-1 items-center justify-center gap-6 p-4">
        {MART_CORNER_ORDER.map((cornerId) => {
          const corner = MART_CORNERS[cornerId];
          const status = cornerStatus[cornerId];
          const locked = status === 'locked';
          const icon = locked ? 'lock' : status === 'completed' ? 'check' : 'hand';
          return (
            <Pressable
              key={cornerId}
              disabled={locked}
              onPress={() => go(`/games/mart/corner/${cornerId}`)}
              className={`w-[300px] h-[120px] rounded-2xl p-3 flex-row items-center gap-3 bg-gray-50 ${
                locked ? 'opacity-50' : ''
              }`}
            >
              <MartImagePlaceholder className="w-[90px] h-[90px] rounded-xl" />
              <View className="flex-1">
                <Text className="text-lg font-bold">{locked ? '???' : corner.title}</Text>
              </View>
              <MartIcon name={icon} size={24} />
            </Pressable>
          );
        })}
      </View>
      {allCompleted ? (
        <View className="items-center pb-6">
          <MartRoundButton variant="primary" icon="next" onPress={() => go('/games/mart/ending')} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
