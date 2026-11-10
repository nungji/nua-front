import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MartWordCard } from '@/components/mart/MartWordCard';
import { MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartWordbook() {
  const completedWords = useMartStore((state) => state.completedWords);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="나의 단어장" />
      <ScrollView contentContainerClassName="p-4 gap-6">
        {MART_CORNER_ORDER.map((cornerId) => {
          const corner = MART_CORNERS[cornerId];
          return (
            <View key={cornerId}>
              <Text className="text-base font-bold mb-3">{corner.title}</Text>
              <View className="flex-row flex-wrap gap-4">
                {corner.rows
                  .flatMap((row) => row.words)
                  .map((word) => (
                    <MartWordCard key={word} label={word} locked={!completedWords.has(word)} />
                  ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
