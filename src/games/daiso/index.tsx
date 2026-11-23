import { useReducer } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, SvgUri } from 'react-native-svg';
import { TopBar } from '@/components/TopBar';
import { useStageRouter } from '@/hooks/useStageRouter';
import { FONT } from '@/theme';
import type { GameSceneProps } from '../types';
import { INITIAL, transition } from './game';
import { ItemArt, ResultArt } from './ResultArt';

const ART = {
  story1: require('../../assets/daiso/story-1.png'),
  story2: require('../../assets/daiso/story-2.png'),
  sad: require('../../assets/daiso/stage-sad.png'),
  happy: require('../../assets/daiso/stage-happy.png'),
  shelf: require('../../assets/daiso/item-shelf.png'),
  ring: require('../../assets/daiso/stage-ring.svg'),
};
// Metro supplies a URL on web and an asset number on native.
const ringUri = Platform.OS === 'web' ? (typeof ART.ring === 'string' ? ART.ring : ART.ring.uri) : Image.resolveAssetSource(ART.ring).uri;

function Button({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 22, paddingVertical: 9, borderRadius: 24, backgroundColor: secondary ? '#FFFFFF' : '#4C8E78', borderWidth: 2, borderColor: secondary ? '#B4CCBB' : '#FFFFFF', opacity: pressed ? .75 : 1 })}><Text style={{ fontFamily: FONT, fontSize: 16, color: secondary ? '#4C7964' : '#FFFFFF' }}>{label}</Text></Pressable>;
}

function Seabed({ width, height }: { width: number; height: number }) {
  return <Svg pointerEvents="none" width={width} height={height} style={{ position: 'absolute' }}>
    <Path d={`M0 0H${width}V${height}H0Z`} fill="#EAE2C1" />
    {Array.from({ length: 24 }, (_, i) => <Ellipse key={i} cx={(i * 139 + 32) % width} cy={(i * 83 + 35) % height} rx={18 + i % 3 * 10} ry={6 + i % 3 * 2} fill={i % 2 ? '#D9CCA8' : '#F5EDDA'} opacity=".55" />)}
    {Array.from({ length: 9 }, (_, i) => <Path key={i} d={`M${i % 2 ? width - 30 : 15} ${i * 150 + 50}q-12-25 0-45q15 18 8 42q18-30 25-22q8 13-25 28`} fill="#91B79A" opacity=".55" />)}
  </Svg>;
}

export function DaisoIcon({ width = 64, height = 64 }: { width?: number; height?: number }) {
  return <Svg width={width} height={height} viewBox="0 0 100 100"><Path d="M14 36L24 88Q50 98 76 88L86 36Z" fill="#E5B775" stroke="white" strokeWidth="7" strokeLinejoin="round" /><Path d="M25 36Q25 4 50 8Q75 4 75 36" fill="none" stroke="white" strokeWidth="12" /><Path d="M25 36Q25 4 50 8Q75 4 75 36" fill="none" stroke="#F7D89E" strokeWidth="6" /><Ellipse cx="50" cy="36" rx="35" ry="8" fill="#9CE0E3" /><Path d="M35 53L38 80M65 53L62 80" stroke="#FFE9BA" strokeWidth="5" strokeLinecap="round" /><Circle cx="45" cy="65" r="3" fill="#825D44" /><Circle cx="57" cy="65" r="3" fill="#825D44" /><Path d="M45 74Q51 80 57 74" fill="none" stroke="#825D44" strokeWidth="3" /></Svg>;
}

export function DaisoScene({ game }: GameSceneProps) {
  const { back } = useStageRouter();
  const { width, height } = useWindowDimensions();
  const [state, dispatch] = useReducer(transition, INITIAL);
  const availableHeight = Math.max(150, height - 145);
  const storyWidth = Math.min(width - 40, availableHeight * 982 / 389, 1080);
  const panelSize = Math.min(availableHeight, width * .48, 460);
  const resultLabels = state.item === 'bucket'
    ? ['양동이를 들고 호숫가로!', '양동이에 물을 담아요.', '시든 꽃에 물을 주어요.', '꽃도 친구도 활짝!']
    : ['양말을 들고 호숫가로!', '양말에 물을 담아 볼까요?', '물이 새어 나와요. 다른 물건을 골라요.'];
  const mapScale = Math.min(1.5, Math.max(.8, width / 650));
  const mapWidth = 402 * mapScale;
  const mapHeight = 851 * mapScale;
  const stages = [{ x: 224, y: 44 }, { x: 37, y: 222 }, { x: 224, y: 429 }, { x: 46, y: 549 }];

  return <View testID="daiso-game" style={{ flex: 1, backgroundColor: '#F7F2E3' }}>
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <TopBar title={state.phase === 'map' ? game.title : '1. 꽃을 도와줘!'} onBack={() => state.phase === 'map' ? back() : dispatch({ type: 'back' })} />
      {state.phase === 'map' ? <ScrollView testID="daiso-map" style={{ flex: 1, backgroundColor: '#EAE2C1' }} contentContainerStyle={{ height: mapHeight, alignItems: 'center' }}>
        <Seabed width={width} height={mapHeight} />
        <View style={{ width: mapWidth, height: mapHeight }}>
          {stages.map((position, index) => <View key={index} style={{ position: 'absolute', left: position.x * mapScale, top: position.y * mapScale, width: 164 * mapScale, height: 180 * mapScale }}>
            <Pressable testID={`daiso-stage-${index + 1}`} accessibilityRole="button" accessibilityLabel={index === 0 ? '1. 꽃을 도와줘' : `${index + 1}. 준비 중`} accessibilityState={{ disabled: index > 0 }} disabled={index > 0} onPress={() => dispatch({ type: 'start' })} style={{ width: 164 * mapScale, height: 152 * mapScale }}>
              <View pointerEvents="none" style={{ position: 'absolute', width: 164, height: 152, left: (164 * mapScale - 164) / 2, top: (152 * mapScale - 152) / 2, transform: [{ scale: mapScale }] }}><SvgUri uri={ringUri} /></View>
              {index === 0 ? <Image source={state.completed ? ART.happy : ART.sad} resizeMode="contain" style={{ position: 'absolute', left: 41 * mapScale, top: 44 * mapScale, width: 91 * mapScale, height: 61 * mapScale }} /> : <Text style={{ position: 'absolute', top: 57 * mapScale, width: '100%', textAlign: 'center', fontFamily: FONT, color: '#8C978A', fontSize: 20 * mapScale }}>준비 중</Text>}
            </Pressable>
            <Text style={{ textAlign: 'center', fontFamily: FONT, fontSize: 14 * mapScale, color: '#50745D', marginTop: 6 }}>{index === 0 ? state.completed ? '✓ 꽃을 도와줬어요!' : '1. 꽃을 도와줘!' : ''}</Text>
          </View>)}
        </View>
      </ScrollView> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 16, paddingBottom: 8 }}>
        {state.phase === 'story' && <>
          <Image testID="daiso-story" source={state.page === 0 ? ART.story1 : ART.story2} resizeMode="contain" style={{ width: storyWidth, height: storyWidth * (state.page === 0 ? 384 : 389) / 982 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}><Text style={{ fontFamily: FONT, color: '#6B795D' }}>{state.page + 1} / 2</Text><Button label={state.page === 0 ? '다음 이야기' : '도와주러 가기'} onPress={() => dispatch({ type: 'next' })} /></View>
        </>}
        {state.phase === 'choose' && <View testID="daiso-choose" style={{ width: '100%', flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Image source={ART.shelf} resizeMode="contain" style={{ width: Math.min(width * .6, 732), height: Math.min(width * .6, 732) * 46 / 366 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Math.min(width * .04, 40) }}>
            <View style={{ alignItems: 'center', gap: 8 }}><Image source={ART.sad} resizeMode="contain" style={{ width: Math.min(130, width * .17), height: Math.min(100, availableHeight * .4) }} /><Text style={{ fontFamily: FONT, color: '#715B47', fontSize: 15 }}>물을 담아 꽃을 도와줘!</Text></View>
            {(['bucket', 'sock'] as const).map(item => <Pressable key={item} testID={`daiso-item-${item}`} accessibilityRole="button" accessibilityLabel={item === 'bucket' ? '양동이 선택' : '양말 선택'} onPress={() => dispatch({ type: 'choose', item })} style={({ pressed }) => ({ alignItems: 'center', padding: 12, borderRadius: 20, borderWidth: 3, borderColor: '#DDCDB0', backgroundColor: pressed ? '#F6E5B6' : '#FFFFFF', minWidth: Math.min(155, width * .2) })}><ItemArt item={item} size={Math.min(115, availableHeight * .38)} /><Text style={{ fontFamily: FONT, color: '#715B47', fontSize: 17 }}>{item === 'bucket' ? '양동이' : '양말'}</Text></Pressable>)}
          </View>
        </View>}
        {state.phase === 'result' && state.item && <View testID={`daiso-result-${state.item}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <ResultArt item={state.item} page={state.page} size={panelSize} />
          <View style={{ width: Math.min(260, width * .35), alignItems: 'center', gap: 18 }}><Text style={{ fontFamily: FONT, fontSize: 18, textAlign: 'center', color: '#715B47' }}>{resultLabels[state.page]}</Text><Text style={{ color: '#66866C', fontFamily: FONT }}>{state.page + 1} / {state.item === 'bucket' ? 4 : 3}</Text><Button label={state.page === (state.item === 'bucket' ? 3 : 2) ? state.item === 'bucket' ? '완료' : '다시 고르기' : '다음 장면'} onPress={() => dispatch({ type: 'next' })} /></View>
        </View>}
        {state.phase === 'complete' && <View testID="daiso-complete" style={{ alignItems: 'center', gap: 14 }}><Image source={ART.happy} resizeMode="contain" style={{ width: 120, height: Math.min(105, availableHeight * .45) }} /><Text style={{ color: '#4C8E78', fontFamily: FONT, fontSize: 24 }}>꽃을 도와줬어요!</Text><View style={{ flexDirection: 'row', gap: 12 }}><Button label="한 번 더" secondary onPress={() => dispatch({ type: 'restart' })} /><Button label="스테이지 지도" onPress={() => dispatch({ type: 'map' })} /></View></View>}
      </View>}
    </SafeAreaView>
  </View>;
}
