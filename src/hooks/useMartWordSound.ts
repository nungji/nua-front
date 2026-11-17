import { useAudioPlayer } from 'expo-audio';
import type { AudioSource } from 'expo-audio';
import { getMartSyllableAudio } from '@/data/martSyllableAudio';
import { getMartWordAudio } from '@/data/martWordAudio';

function useMartSound(source: AudioSource | undefined): () => void {
  const player = useAudioPlayer(source ?? null);

  return function playSound() {
    if (!source) return;
    player.seekTo(0).finally(() => player.play());
  };
}

/** 단어 전체 발음을 재생한다. 에셋이 없는 단어는 눌러도 아무 일도 일어나지 않는다. */
export function useMartWordSound(word: string): () => void {
  return useMartSound(getMartWordAudio(word));
}

/** 음절 하나의 발음을 재생한다. 에셋이 없는 음절은 눌러도 아무 일도 일어나지 않는다. */
export function useMartSyllableSound(syllable: string): () => void {
  return useMartSound(getMartSyllableAudio(syllable));
}
