import { Image, View, type ImageSourcePropType } from 'react-native';

// Original transparent character artwork supplied by the designer.
export const GAME_CHARACTERS: Record<string, ImageSourcePropType> = {
  fruitstore: require('../assets/characters/shell.png'),
  daiso: require('../assets/characters/daiso.png'),
  mart: require('../assets/characters/mart.png'),
  repairman: require('../assets/characters/repairman.png'),
};

export function GameCharacter({ game, width = 64, height = 64 }: { game: string; width?: number; height?: number }) {
  return <View pointerEvents="none"><Image testID={`character-${game}`} accessible={false} source={GAME_CHARACTERS[game]} resizeMode="contain" style={{ width, height }} /></View>;
}
