import { Redirect, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { MartIcon } from '@/components/mart/MartIcon';
import { MART_AWNING_COLORS, MartShelfPlank, MartStall } from '@/components/mart/MartStall';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { getMartWordImage } from '@/data/martWordImages';
import { isRowUnlocked, MART_CORNERS } from '@/data/martWords';
import type { MartCornerId } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

const STALLS_PER_ROW = 2;
const SCREEN_PADDING = 12;
const STALL_GAP = 16;
// 진열대의 나무 틀·뒷판 여백(좌우 합). 상품 사진 폭 계산에 쓴다.
const STALL_HORIZONTAL_CHROME = 10 * 2 + 5 * 2 + 8 * 2 + 12 * 2;

function isMartCornerId(value: string | undefined): value is MartCornerId {
  return value === 'grocery' || value === 'household' || value === 'electronics';
}

interface ShelfWord {
  word: string;
  tier: number;
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export default function MartCornerScreen() {
  const { go } = useStageRouter();
  const { width, height } = useWindowDimensions();
  const { corner: cornerParam } = useLocalSearchParams<{ corner: string }>();
  const completedWords = useMartStore((state) => state.completedWords);
  const startStage = useMartStore((state) => state.startStage);

  if (!isMartCornerId(cornerParam)) {
    return <Redirect href="/games/mart/map" />;
  }

  const corner = MART_CORNERS[cornerParam];
  const awningColor = MART_AWNING_COLORS[cornerParam];
  const words: ShelfWord[] = corner.rows.flatMap((row) => row.words.map((word) => ({ word, tier: row.tier })));
  const rows = chunk(words, STALLS_PER_ROW);

  const stallWidth = Math.floor((width - SCREEN_PADDING * 2 - STALL_GAP * (STALLS_PER_ROW - 1)) / STALLS_PER_ROW);
  const productWidth = stallWidth - STALL_HORIZONTAL_CHROME;
  // 가로 화면에서 너무 커지지 않게 화면 높이의 1/3을 넘지 않도록 한다.
  const productHeight = Math.round(Math.min(productWidth * 0.6, height / 3));

  function renderStall({ word, tier }: ShelfWord) {
    const unlocked = isRowUnlocked(cornerParam as MartCornerId, tier, completedWords);
    const completed = completedWords.has(word);
    const wordImage = unlocked ? getMartWordImage(word) : undefined;

    return (
      <Pressable
        key={word}
        disabled={!unlocked}
        onPress={() => {
          startStage(word);
          go(`/games/mart/stage/${word}`);
        }}
        style={{ width: stallWidth }}
      >
        <MartStall
          awningColor={unlocked ? awningColor : '#9AA7BC'}
          innerStyle={{ paddingHorizontal: 12, paddingTop: 12, alignItems: 'center' }}
        >
          {/* 진열대 위 상품 */}
          {wordImage ? (
            // 투명 배경 3D 아이콘을 흰 둥근 타일 위에 올린다.
            <View
              style={{
                width: productHeight,
                height: productHeight,
                borderRadius: 20,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={wordImage}
                resizeMode="contain"
                style={{ width: productHeight * 0.75, height: productHeight * 0.75 }}
              />
            </View>
          ) : (
            <View
              style={{
                width: productWidth,
                height: productHeight,
                borderRadius: 10,
                backgroundColor: unlocked ? '#A9DBFF' : '#7A8094',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!unlocked ? <MartIcon name="lock" size={36} /> : null}
            </View>
          )}
          <View style={{ alignSelf: 'stretch', marginHorizontal: -12, marginTop: 4 }}>
            <MartShelfPlank dimmed={!unlocked} />
          </View>
          {/* 선반 앞에 걸린 상품표 — 스테이지를 깨기 전에는 가려져 있다. */}
          <View style={{ width: 3, height: 6, backgroundColor: '#8A5A1A' }} />
          <View
            style={{
              minWidth: '50%',
              height: 44,
              marginBottom: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !unlocked ? '#E7EDF7' : completed ? '#E3FBE6' : 'white',
              borderWidth: 3,
              borderColor: !unlocked ? '#C7D3E6' : completed ? '#33C24D' : '#FF8A1F',
            }}
          >
            <Text
              numberOfLines={1}
              style={{ fontSize: 22, fontWeight: '800', color: '#1B3A6B' }}
            >
              {completed ? word : '?'}
            </Text>
          </View>
        </MartStall>
      </Pressable>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar title={corner.title} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 12, paddingBottom: 24, gap: 24 }}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', gap: STALL_GAP }}>
              {row.map(renderStall)}
            </View>
          ))}
        </ScrollView>
      </OceanBackground>
    </SafeAreaView>
  );
}
