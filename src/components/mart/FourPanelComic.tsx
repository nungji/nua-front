import { ScrollView, View } from 'react-native';
import { MartComicPanel } from './MartComicPanel';
import { MartRoundButton } from './MartRoundButton';

interface FourPanelComicProps {
  panels: (string | undefined)[];
  onNext: () => void;
}

export function FourPanelComic({ panels, onNext }: FourPanelComicProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="items-center justify-between py-6"
    >
      <View className="flex-row flex-wrap w-[350px] justify-between">
        {panels.map((src, index) => (
          <View key={index} className="mb-2">
            <MartComicPanel imageSrc={src} />
          </View>
        ))}
      </View>
      <MartRoundButton variant="primary" icon="next" onPress={onNext} />
    </ScrollView>
  );
}
