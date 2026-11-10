import { Redirect, useLocalSearchParams } from 'expo-router';

import { GAMES, gameIndexById } from '@/games';

export default function GameRoute() {
  const { game } = useLocalSearchParams<{ game: string }>();
  const index = gameIndexById(game);

  if (index < 0) {
    return <Redirect href="/" />;
  }

  const entry = GAMES[index];

  return <entry.Scene game={entry} index={index} />;
}
