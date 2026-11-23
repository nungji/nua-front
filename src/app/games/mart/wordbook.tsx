import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { MartWordCard } from '@/components/mart/MartWordCard';
import { getMartWordImage } from '@/data/martWordImages';
import { MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';
import { FONT } from '@/theme';

export default function MartWordbook() {
  const completedWords = useMartStore((state) => state.completedWords);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar title="나의 단어장" />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
          {MART_CORNER_ORDER.map((cornerId) => {
            const corner = MART_CORNERS[cornerId];
            return (
              <View key={cornerId}>
                <Text style={{ fontSize: 15, fontFamily: FONT, color: 'white', marginBottom: 12 }}>
                  {corner.title}
                </Text>
                <View className="flex-row flex-wrap gap-4">
                  {corner.rows
                    .flatMap((row) => row.words)
                    .map((word) => (
                      <MartWordCard
                        key={word}
                        label={word}
                        imageSrc={getMartWordImage(word)}
                        locked={!completedWords.has(word)}
                      />
                    ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </OceanBackground>
    </SafeAreaView>
  );
}
