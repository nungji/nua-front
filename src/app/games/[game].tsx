import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { GAMES, gameIndexById } from '@/games';

export default function GameRoute() {
  const { game } = useLocalSearchParams<{ game: string }>();
  const index = gameIndexById(game);

  if (index < 0) {
    return <Redirect href="/" />;
  }

  const entry = GAMES[index];

  return (
    <>
      <Stack.Screen options={{ orientation: entry.id === 'fruitstore' ? 'portrait' : 'landscape' }} />
      <entry.Scene game={entry} index={index} />
    </>
  );
}
