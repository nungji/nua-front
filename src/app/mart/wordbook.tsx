import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MartTopBar } from '@/components/mart/MartTopBar';
import { MartWordCard } from '@/components/mart/MartWordCard';
import { MART_WORDS } from '@/data/martWords';
import { MART_WORD_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

export default function MartWordbook() {
  const collectedWords = useMartStore((state) => state.collectedWords);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MartTopBar title="나의 단어장" />
      <View className="flex-1 flex-row flex-wrap p-4 gap-4 justify-center content-start">
        {MART_WORD_ORDER.map((wordId) => {
          const word = MART_WORDS[wordId];
          const collected = collectedWords.includes(wordId);
          return <MartWordCard key={wordId} label={word.label} imageSrc={word.imageSrc} locked={!collected} />;
        })}
      </View>
    </SafeAreaView>
  );
}
