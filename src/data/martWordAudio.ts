import type { AudioSource } from 'expo-audio';

// 식료품 코너 20단어는 실제 발음 파일이 있다(src/assets/mart/audio). 나머지 코너는
// 아직 에셋이 없어 재생 버튼을 눌러도 아무 일도 일어나지 않는다.
const MART_WORD_AUDIO: Record<string, AudioSource> = {
  우유: require('../assets/mart/audio/우유.mp3'),
  오이: require('../assets/mart/audio/오이.mp3'),
  포도: require('../assets/mart/audio/포도.mp3'),
  두부: require('../assets/mart/audio/두부.mp3'),
  고기: require('../assets/mart/audio/고기.mp3'),
  자두: require('../assets/mart/audio/자두.mp3'),
  가지: require('../assets/mart/audio/가지.mp3'),
  치즈: require('../assets/mart/audio/치즈.mp3'),
  사과: require('../assets/mart/audio/사과.mp3'),
  과자: require('../assets/mart/audio/과자.mp3'),
  배추: require('../assets/mart/audio/배추.mp3'),
  새우: require('../assets/mart/audio/새우.mp3'),
  바나나: require('../assets/mart/audio/바나나.mp3'),
  토마토: require('../assets/mart/audio/토마토.mp3'),
  고구마: require('../assets/mart/audio/고구마.mp3'),
  요거트: require('../assets/mart/audio/요거트.mp3'),
  수박: require('../assets/mart/audio/수박.mp3'),
  당근: require('../assets/mart/audio/당근.mp3'),
  김치: require('../assets/mart/audio/김치.mp3'),
  사탕: require('../assets/mart/audio/사탕.mp3'),
};

export function getMartWordAudio(word: string): AudioSource | undefined {
  return MART_WORD_AUDIO[word];
}
