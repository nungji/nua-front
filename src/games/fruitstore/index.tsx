import { useEffect, useReducer, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityInfo, ActivityIndicator, AppState, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStageRouter } from '@/hooks/useStageRouter';
import type { GameSceneProps } from '../types';
import { gameReducer, initialState, isShelf, transitionDelay } from './game';
import { COLORS, FruitStoreBoard, SCREENS } from './Scene';

export function FruitStoreScene(_props: GameSceneProps) {
  const { back } = useStageRouter();
  const params = useLocalSearchParams<{ screen?: string }>();
  const requested = Number(params.screen);
  const preview = Number.isInteger(requested) && requested >= 1 && requested <= SCREENS.length;
  const [previewIndex, setPreviewIndex] = useState(preview ? requested - 1 : 0);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [orderOpen, setOrderOpen] = useState(false);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [fontsLoaded, fontError] = useFonts({
    GaeguBold: require('../../assets/fruitstore/Gaegu-Bold.ttf'),
    DunggeunmisoBold: require('../../assets/fruitstore/Dunggeunmiso-Bold.otf'),
  });
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min((width - insets.left - insets.right) / 852, (height - insets.top - insets.bottom) / 393);
  useEffect(() => { if (preview) setPreviewIndex(requested - 1); }, [requested, preview]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', value => setActive(value === 'active'));
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (preview || !active || (!fontsLoaded && !fontError) || orderOpen) return;
    const delay = transitionDelay(state.screen);
    if (delay === null) return;
    const timer = setTimeout(() => dispatch({ type: 'advance' }), delay);
    return () => clearTimeout(timer);
  }, [state.screen, preview, active, fontsLoaded, fontError, orderOpen]);
  useEffect(() => {
    if (!preview && isShelf(state.screen)) AccessibilityInfo.announceForAccessibility(`바구니에 과일 ${state.selected.length}개. 주문은 5개예요.`);
  }, [state.selected.length, state.screen, preview]);

  if (!fontsLoaded && !fontError) return <View style={styles.root}><ActivityIndicator color={COLORS.orange} accessibilityLabel="과일 가게 준비 중" /></View>;
  const shown = preview ? { ...state, screen: previewIndex } : state;
  return (
    <View style={[styles.root, { paddingLeft: insets.left, paddingRight: insets.right, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar hidden />
      <View style={{ width: 852 * scale, height: 393 * scale }}>
        <View style={{ position: 'absolute', width: 852, height: 393, left: (852 * scale - 852) / 2, top: (393 * scale - 393) / 2, transform: [{ scale }] }}>
          <FruitStoreBoard state={shown} scale={scale} preview={preview} dispatch={dispatch} onExit={back} onOrder={() => setOrderOpen(true)} />
          {orderOpen && !preview && <View accessibilityViewIsModal style={StyleSheet.absoluteFill}>
            <FruitStoreBoard state={{ ...state, screen: 4 }} scale={scale} preview={false} dispatch={() => setOrderOpen(false)} onExit={() => setOrderOpen(false)} onOrder={() => {}} />
          </View>}
        </View>
      </View>
      {width < height && <Text style={styles.rotate}>화면을 가로로 돌리면 더 크게 놀 수 있어요.</Text>}
      {preview && <View style={styles.previewBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="이전 디자인 화면" onPress={() => setPreviewIndex(i => (i + 25) % 26)} style={styles.previewButton}><Text>‹</Text></Pressable>
        <Text style={styles.previewLabel}>{previewIndex + 1}/26 · {SCREENS[previewIndex].name}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="다음 디자인 화면" onPress={() => setPreviewIndex(i => (i + 1) % 26)} style={styles.previewButton}><Text>›</Text></Pressable>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  rotate: { position: 'absolute', bottom: 40, color: COLORS.ink, fontFamily: 'GaeguBold', fontSize: 18 },
  previewBar: { position: 'absolute', bottom: 0, backgroundColor: '#ffffffed', borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  previewLabel: { fontSize: 11, color: COLORS.ink },
  previewButton: { minWidth: 44, height: 32, alignItems: 'center', justifyContent: 'center' },
});
