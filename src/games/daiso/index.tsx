import { useReducer } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { StageBackdrop } from '@/components/StageBackdrop';
import { HomeOceanLife } from '@/components/HomeOceanLife';
import { GAME_CHARACTERS } from '@/components/GameCharacter';
import { DaisoIcon } from '@/components/icons/DaisoIcon';
export { DaisoIcon } from '@/components/icons/DaisoIcon';
import { TopBar } from '@/components/TopBar';
import { useStageRouter } from '@/hooks/useStageRouter';
import { FONT } from '@/theme';
import type { GameSceneProps } from '../types';
import { INITIAL, transition } from './game';
import { ItemArt, ResultArt, OceanStoryPanel } from './ResultArt';

function Button({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 22, paddingVertical: 9, borderRadius: 24, backgroundColor: secondary ? '#FFFFFF' : '#078FD6', borderWidth: 2, borderColor: secondary ? '#A8F2FF' : '#FFFFFF', opacity: pressed ? .75 : 1 })}><Text style={{ fontFamily: FONT, fontSize: 16, color: secondary ? '#176C9E' : '#FFFFFF' }}>{label}</Text></Pressable>;
}

function Seabed({ width, height }: { width: number; height: number }) {
  return <Svg pointerEvents="none" width={width} height={height} style={{ position: 'absolute' }}>
    <Path d={`M0 0H${width}V${height}H0Z`} fill="#54CFE51A" />
    {Array.from({ length: 24 }, (_, i) => <Ellipse key={i} cx={(i * 139 + 32) % width} cy={(i * 83 + 35) % height} rx={18 + i % 3 * 10} ry={6 + i % 3 * 2} fill={i % 2 ? '#ABEDFF' : '#E6FFFF'} opacity=".55" />)}
    {Array.from({ length: 9 }, (_, i) => <Path key={i} d={`M${i % 2 ? width - 30 : 15} ${i * 150 + 50}q-12-25 0-45q15 18 8 42q18-30 25-22q8 13-25 28`} fill="#89E2D6" opacity=".55" />)}
  </Svg>;
}

export function DaisoScene({ game }: GameSceneProps) {
  const { back } = useStageRouter();
  const { width, height } = useWindowDimensions();
  const [state, dispatch] = useReducer(transition, INITIAL);
  const availableHeight = Math.max(150, height - 145);
  const storySize = Math.min((width - 64) / 2, availableHeight - 12, 410);
  const panelSize = Math.min(availableHeight, width * .48, 460);
  const resultLabels = state.item === 'bucket'
    ? ['양동이를 들고 바다 샘으로!', '양동이에 물을 담아요.', '시든 꽃에 물을 주어요.', '꽃도 친구도 활짝!']
    : ['양말을 들고 바다 샘으로!', '양말에 물을 담아 볼까요?', '물이 새어 나와요. 다른 물건을 골라요.'];
  const mapScale = Math.min(1.5, Math.max(.8, width / 650));
  const mapWidth = 402 * mapScale;
  const mapHeight = 851 * mapScale;
  const stages = [{ x: 224, y: 44 }, { x: 37, y: 222 }, { x: 224, y: 429 }, { x: 46, y: 549 }];

  return <View testID="daiso-game" style={{ flex: 1, backgroundColor: '#008ECF' }}>
    <StageBackdrop />
    <HomeOceanLife />
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <TopBar title={state.phase === 'map' ? game.title : '1. 꽃을 도와줘!'} onBack={() => state.phase === 'map' ? back() : dispatch({ type: 'back' })} />
      {state.phase === 'map' ? <ScrollView testID="daiso-map" style={{ flex: 1 }} contentContainerStyle={{ height: mapHeight, alignItems: 'center' }}>
        <Seabed width={width} height={mapHeight} />
        <View style={{ width: mapWidth, height: mapHeight }}>
          {stages.map((position, index) => <View key={index} style={{ position: 'absolute', left: position.x * mapScale, top: position.y * mapScale, width: 164 * mapScale, height: 180 * mapScale }}>
            <Pressable testID={`daiso-stage-${index + 1}`} accessibilityRole="button" accessibilityLabel={index === 0 ? '1. 꽃을 도와줘' : `${index + 1}. 준비 중`} accessibilityState={{ disabled: index > 0 }} disabled={index > 0} onPress={() => dispatch({ type: 'start' })} style={{ width: 164 * mapScale, height: 152 * mapScale }}>
              <View pointerEvents="none" style={{ width: '100%', height: '100%', borderRadius: 100 * mapScale, backgroundColor: '#B8F5FF66', borderWidth: 5 * mapScale, borderColor: '#D5FCFF', alignItems: 'center', justifyContent: 'center', boxShadow: '0 7px 0 #057BB7' }}>
                <Svg width={164 * mapScale} height={152 * mapScale} viewBox="0 0 164 152" style={{ position: 'absolute' }}>{Array.from({ length: 12 }, (_, i) => <Circle key={i} cx={82 + Math.cos(i * Math.PI / 6) * 72} cy={76 + Math.sin(i * Math.PI / 6) * 65} r="8" fill="#E1FFFF" stroke="#89D6F1" strokeWidth="2" />)}</Svg>
                {index === 0 ? <Image source={GAME_CHARACTERS.fruitstore} resizeMode="contain" style={{ width: 100 * mapScale, height: 106 * mapScale }} /> : <Text style={{ textAlign: 'center', fontFamily: FONT, color: '#F0FFFF', fontSize: 20 * mapScale }}>준비 중</Text>}
              </View>
            </Pressable>
            <Text style={{ textAlign: 'center', fontFamily: FONT, fontSize: 14 * mapScale, color: '#FFFFFF', marginTop: 6 }}>{index === 0 ? state.completed ? '✓ 꽃을 도와줬어요!' : '1. 꽃을 도와줘!' : ''}</Text>
          </View>)}
        </View>
      </ScrollView> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 16, paddingBottom: 8 }}>
        {state.phase === 'story' && <>
          <View testID="daiso-story" style={{ flexDirection: 'row', gap: 16 }}>
            <OceanStoryPanel scene={state.page === 0 ? 'wilt' : 'spring'} size={storySize} />
            <OceanStoryPanel scene={state.page === 0 ? 'spring' : 'shop'} size={storySize} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}><Text style={{ fontFamily: FONT, color: '#FFFFFF' }}>{state.page + 1} / 2</Text><Button label={state.page === 0 ? '다음 이야기' : '도와주러 가기'} onPress={() => dispatch({ type: 'next' })} /></View>
        </>}
        {state.phase === 'choose' && <View testID="daiso-choose" style={{ width: '100%', flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 6, borderRadius: 28, borderWidth: 3, borderColor: '#D4FFFF', backgroundColor: '#087FBDCC' }}><DaisoIcon width={42} height={42} /><Text style={{ color: 'white', fontFamily: FONT, fontSize: 20 }}>바다 만물상</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Math.min(width * .04, 40) }}>
            <View style={{ alignItems: 'center', gap: 8 }}><Image testID="daiso-customer-shark" source={GAME_CHARACTERS.fruitstore} resizeMode="contain" style={{ width: Math.min(200, width * .22), height: Math.min(235, availableHeight * .64) }} /><Text style={{ fontFamily: FONT, color: '#155987', fontSize: 15, backgroundColor: '#EEFFFF', padding: 10, borderRadius: 15 }}>물을 담아 꽃을 도와줘!</Text></View>
            {(['bucket', 'sock'] as const).map(item => <Pressable key={item} testID={`daiso-item-${item}`} accessibilityRole="button" accessibilityLabel={item === 'bucket' ? '양동이 선택' : '양말 선택'} onPress={() => dispatch({ type: 'choose', item })} style={({ pressed }) => ({ alignItems: 'center', padding: 12, borderRadius: 20, borderWidth: 3, borderColor: '#C0FCFF', backgroundColor: pressed ? '#9CEAF4' : '#E6FCFFF2', boxShadow: '0 7px 0 #087EB7', minWidth: Math.min(155, width * .2) })}><ItemArt item={item} size={Math.min(115, availableHeight * .38)} /><Text style={{ fontFamily: FONT, color: '#155987', fontSize: 17 }}>{item === 'bucket' ? '양동이' : '양말'}</Text></Pressable>)}
          </View>
        </View>}
        {state.phase === 'result' && state.item && <View testID={`daiso-result-${state.item}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <ResultArt item={state.item} page={state.page} size={panelSize} />
          <View style={{ width: Math.min(260, width * .35), alignItems: 'center', gap: 18, padding: 16, borderRadius: 24, backgroundColor: '#E7FCFFF2', borderWidth: 3, borderColor: '#A2EDFF' }}><Text style={{ fontFamily: FONT, fontSize: 18, textAlign: 'center', color: '#155987' }}>{resultLabels[state.page]}</Text><Text style={{ color: '#277CA9', fontFamily: FONT }}>{state.page + 1} / {state.item === 'bucket' ? 4 : 3}</Text><Button label={state.page === (state.item === 'bucket' ? 3 : 2) ? state.item === 'bucket' ? '완료' : '다시 고르기' : '다음 장면'} onPress={() => dispatch({ type: 'next' })} /></View>
        </View>}
        {state.phase === 'complete' && <View testID="daiso-complete" style={{ alignItems: 'center', gap: 14 }}><Image source={GAME_CHARACTERS.fruitstore} resizeMode="contain" style={{ width: 180, height: Math.min(190, availableHeight * .55) }} /><Text style={{ color: '#FFFFFF', fontFamily: FONT, fontSize: 24 }}>꽃을 도와줬어요!</Text><View style={{ flexDirection: 'row', gap: 12 }}><Button label="한 번 더" secondary onPress={() => dispatch({ type: 'restart' })} /><Button label="스테이지 지도" onPress={() => dispatch({ type: 'map' })} /></View></View>}
      </View>}
    </SafeAreaView>
  </View>;
}
