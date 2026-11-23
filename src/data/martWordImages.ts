import type { ImageSourcePropType } from 'react-native';

// 마트 60단어 전체의 상품 아이콘(피그마 '글자 마트 · 상품 컴포넌트', src/assets/mart/products-icon).
const MART_WORD_IMAGES: Record<string, ImageSourcePropType> = {
  우유: require('../assets/mart/products-icon/우유.png'),
  오이: require('../assets/mart/products-icon/오이.png'),
  포도: require('../assets/mart/products-icon/포도.png'),
  두부: require('../assets/mart/products-icon/두부.png'),
  고기: require('../assets/mart/products-icon/고기.png'),
  자두: require('../assets/mart/products-icon/자두.png'),
  가지: require('../assets/mart/products-icon/가지.png'),
  치즈: require('../assets/mart/products-icon/치즈.png'),
  사과: require('../assets/mart/products-icon/사과.png'),
  과자: require('../assets/mart/products-icon/과자.png'),
  배추: require('../assets/mart/products-icon/배추.png'),
  새우: require('../assets/mart/products-icon/새우.png'),
  바나나: require('../assets/mart/products-icon/바나나.png'),
  토마토: require('../assets/mart/products-icon/토마토.png'),
  고구마: require('../assets/mart/products-icon/고구마.png'),
  요거트: require('../assets/mart/products-icon/요거트.png'),
  수박: require('../assets/mart/products-icon/수박.png'),
  당근: require('../assets/mart/products-icon/당근.png'),
  김치: require('../assets/mart/products-icon/김치.png'),
  사탕: require('../assets/mart/products-icon/사탕.png'),
  비누: require('../assets/mart/products-icon/비누.png'),
  휴지: require('../assets/mart/products-icon/휴지.png'),
  모자: require('../assets/mart/products-icon/모자.png'),
  바지: require('../assets/mart/products-icon/바지.png'),
  치마: require('../assets/mart/products-icon/치마.png'),
  세제: require('../assets/mart/products-icon/세제.png'),
  베개: require('../assets/mart/products-icon/베개.png'),
  가위: require('../assets/mart/products-icon/가위.png'),
  의자: require('../assets/mart/products-icon/의자.png'),
  수세미: require('../assets/mart/products-icon/수세미.png'),
  바구니: require('../assets/mart/products-icon/바구니.png'),
  기저귀: require('../assets/mart/products-icon/기저귀.png'),
  칫솔: require('../assets/mart/products-icon/칫솔.png'),
  치약: require('../assets/mart/products-icon/치약.png'),
  수건: require('../assets/mart/products-icon/수건.png'),
  우산: require('../assets/mart/products-icon/우산.png'),
  양말: require('../assets/mart/products-icon/양말.png'),
  장갑: require('../assets/mart/products-icon/장갑.png'),
  거울: require('../assets/mart/products-icon/거울.png'),
  그릇: require('../assets/mart/products-icon/그릇.png'),
  시계: require('../assets/mart/products-icon/시계.png'),
  라디오: require('../assets/mart/products-icon/라디오.png'),
  카메라: require('../assets/mart/products-icon/카메라.png'),
  마이크: require('../assets/mart/products-icon/마이크.png'),
  스피커: require('../assets/mart/products-icon/스피커.png'),
  다리미: require('../assets/mart/products-icon/다리미.png'),
  마우스: require('../assets/mart/products-icon/마우스.png'),
  키보드: require('../assets/mart/products-icon/키보드.png'),
  게임기: require('../assets/mart/products-icon/게임기.png'),
  드라이기: require('../assets/mart/products-icon/드라이기.png'),
  전구: require('../assets/mart/products-icon/전구.png'),
  밥솥: require('../assets/mart/products-icon/밥솥.png'),
  이어폰: require('../assets/mart/products-icon/이어폰.png'),
  리모컨: require('../assets/mart/products-icon/리모컨.png'),
  노트북: require('../assets/mart/products-icon/노트북.png'),
  선풍기: require('../assets/mart/products-icon/선풍기.png'),
  냉장고: require('../assets/mart/products-icon/냉장고.png'),
  세탁기: require('../assets/mart/products-icon/세탁기.png'),
  청소기: require('../assets/mart/products-icon/청소기.png'),
  전화기: require('../assets/mart/products-icon/전화기.png'),
};

export function getMartWordImage(word: string): ImageSourcePropType | undefined {
  return MART_WORD_IMAGES[word];
}

// 피그마에서 가져온 아이콘. 자체 배경 타일이 그려져 있어 흰 타일 안에 작게 넣지 않고 타일 크기 그대로 보여준다.
const FIGMA_ICON_WORDS: ReadonlySet<string> = new Set([
  '두부', '자두', '요거트', '김치', '치마', '세제', '베개', '기저귀', '치약', '수건',
  '스피커', '다리미', '드라이기', '밥솥', '리모컨', '선풍기', '냉장고', '세탁기', '청소기',
]);

export function hasOwnIconBackground(word: string): boolean {
  return FIGMA_ICON_WORDS.has(word);
}
