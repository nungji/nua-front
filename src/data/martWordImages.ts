import type { ImageSourcePropType } from 'react-native';

// 식료품 코너 20단어는 실제 사진 에셋이 있다(src/assets/mart/products). 나머지 코너는
// 아직 에셋이 없어 MartImagePlaceholder가 회색 박스로 대신 보여준다.
const MART_WORD_IMAGES: Record<string, ImageSourcePropType> = {
  우유: require('../assets/mart/products/우유.jpg'),
  오이: require('../assets/mart/products/오이.jpg'),
  포도: require('../assets/mart/products/포도.jpg'),
  두부: require('../assets/mart/products/두부.jpg'),
  고기: require('../assets/mart/products/고기.jpg'),
  자두: require('../assets/mart/products/자두.jpg'),
  가지: require('../assets/mart/products/가지.jpg'),
  치즈: require('../assets/mart/products/치즈.jpg'),
  사과: require('../assets/mart/products/사과.jpg'),
  과자: require('../assets/mart/products/과자.jpg'),
  배추: require('../assets/mart/products/배추.jpg'),
  새우: require('../assets/mart/products/새우.jpg'),
  바나나: require('../assets/mart/products/바나나.jpg'),
  토마토: require('../assets/mart/products/토마토.jpg'),
  고구마: require('../assets/mart/products/고구마.jpg'),
  요거트: require('../assets/mart/products/요거트.jpg'),
  수박: require('../assets/mart/products/수박.jpg'),
  당근: require('../assets/mart/products/당근.jpg'),
  김치: require('../assets/mart/products/김치.jpg'),
  사탕: require('../assets/mart/products/사탕.jpg'),
};

export function getMartWordImage(word: string): ImageSourcePropType | undefined {
  return MART_WORD_IMAGES[word];
}
