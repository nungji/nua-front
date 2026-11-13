import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStageRouter } from '@/hooks/useStageRouter';
import { OceanBackground } from '@/components/mart/OceanBackground';
import { OceanNextButton } from '@/components/mart/OceanCircleButton';
import { OceanBigStar } from '@/components/mart/OceanDecor';
import { OceanCornerCard } from '@/components/mart/OceanCornerCard';
import { OceanTopBar } from '@/components/mart/OceanTopBar';
import { getWordCorner, MART_CORNERS } from '@/data/martWords';
import { MART_CORNER_ORDER } from '@/enums';
import { useMartStore } from '@/store/useMartStore';

const NUA_MASCOT = require('../../../assets/mart/nua-mascot.png');

export default function MartCornerClear() {
  const { go } = useStageRouter();
  const activeWord = useMartStore((state) => state.activeWord);
  const cornerId = activeWord ? getWordCorner(activeWord) : null;
  const corner = cornerId ? MART_CORNERS[cornerId] : null;
  const nextCornerId = cornerId ? MART_CORNER_ORDER[MART_CORNER_ORDER.indexOf(cornerId) + 1] : null;
  const nextCorner = nextCornerId ? MART_CORNERS[nextCornerId] : null;

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <OceanBackground>
        <OceanTopBar onBack={() => go('/games/mart/map')} onPressWordbook={() => go('/games/mart/wordbook')} />
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, gap: 18 }}>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <OceanBigStar size={44} />
            <OceanBigStar size={54} />
            <OceanBigStar size={44} />
          </View>

          <Text style={{ fontSize: 20, fontWeight: '800', color: '#1B3A6B', textAlign: 'center' }}>
            {corner ? `${corner.title} 코너 완료!` : '코너 완료!'}
          </Text>

          {cornerId ? <OceanCornerCard cornerId={cornerId} title={corner?.title ?? ''} variant="compact" status="completed" /> : null}

          {nextCorner ? (
            <View
              style={{
                width: '100%',
                borderRadius: 26,
                padding: 16,
                backgroundColor: 'rgba(255,168,210,0.9)',
                borderWidth: 2,
                borderColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ width: 28, height: 24, borderRadius: 8, backgroundColor: '#FF9CC5' }} />
              </View>
              <Text style={{ flex: 1, color: 'white', fontWeight: '800', fontSize: 15 }}>
                다음 코너 {nextCorner.title}이(가) 열렸어요!
              </Text>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#33C24D',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: '-15deg' }],
                }}
              >
                <MartCheckGlyph />
              </View>
            </View>
          ) : null}

          <Image source={NUA_MASCOT} resizeMode="contain" style={{ width: 180, height: 180 }} />
        </View>
        <View style={{ alignItems: 'center', paddingBottom: 18 }}>
          <OceanNextButton onPress={() => go('/games/mart/map')} />
        </View>
      </OceanBackground>
    </SafeAreaView>
  );
}

function MartCheckGlyph() {
  return <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>✓</Text>;
}
