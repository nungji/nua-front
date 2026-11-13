import { useAudioPlayer } from 'expo-audio';
import { getMartWordAudio } from '@/data/martWordAudio';

/** 발음 듣기 버튼에서 쓴다. 에셋이 없는 단어는 눌러도 아무 일도 일어나지 않는다. */
export function useMartWordSound(word: string): () => void {
  const source = getMartWordAudio(word);
  const player = useAudioPlayer(source ?? null);

  return function playWordSound() {
    if (!source) return;
    player.seekTo(0).finally(() => player.play());
  };
}
