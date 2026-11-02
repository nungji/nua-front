import { Pressable, Text } from 'react-native';

interface MartTileProps {
  glyph: string;
  used?: boolean;
  onPress: () => void;
}

export function MartTile({ glyph, used, onPress }: MartTileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={used}
      className={`w-[60px] h-[60px] rounded-xl items-center justify-center ${
        used ? 'bg-gray-100 opacity-40' : 'bg-yellow-200'
      }`}
    >
      <Text className="text-2xl font-bold">{glyph}</Text>
    </Pressable>
  );
}
