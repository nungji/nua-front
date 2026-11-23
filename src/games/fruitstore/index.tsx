import { useEffect, useReducer, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityInfo, AppState, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStageRouter } from '@/hooks/useStageRouter';
import type { GameSceneProps } from '../types';
import { gameReducer, initialState, isShelf, transitionDelay } from './game';
import { COLORS, FruitStoreBoard, SCREENS } from './Scene';
import { PORTRAIT, portraitGeometry } from './portraitLayout';
import type { Action } from './game';

export function FruitStoreScene(_props: GameSceneProps) {
  const { back } = useStageRouter();
  const params = useLocalSearchParams<{ screen?: string }>();
  const requested = Number(params.screen);
  const preview = Number.isInteger(requested) && requested >= 1 && requested <= SCREENS.length;
  const [previewIndex, setPreviewIndex] = useState(preview ? requested - 1 : 0);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [started, setStarted] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const geometry = portraitGeometry(width - insets.left - insets.right, height - insets.top - insets.bottom);
  const { scale } = geometry;
  useEffect(() => { if (preview) setPreviewIndex(requested - 1); }, [requested, preview]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', value => setActive(value === 'active'));
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (preview || !started || !active || orderOpen) return;
    const delay = transitionDelay(state.screen);
    if (delay === null) return;
    const timer = setTimeout(() => dispatch({ type: 'advance', fromScreen: state.screen }), delay);
    return () => clearTimeout(timer);
  }, [state.screen, preview, started, active, orderOpen]);
  useEffect(() => {
    if (!preview && isShelf(state.screen)) AccessibilityInfo.announceForAccessibility(`바구니에 조개 ${state.selected.length}개. 주문은 5개예요.`);
  }, [state.selected.length, state.screen, preview]);

  const previewCount = [10, 15, 16].includes(previewIndex) ? 6 : [8, 19, 20].includes(previewIndex) ? 3 : previewIndex >= 9 ? 5 : 0;
  const shown = preview ? { ...state, screen: previewIndex, selected: Array.from({ length: previewCount }, (_, i) => i), completed: previewIndex >= 24 ? 4 : 0, coins: previewIndex >= 24 ? 12 : 0 } : state;
  const send = (action: Action) => {
    if (preview) return;
    if (action.type === 'restart') setStarted(false);
    dispatch(action);
  };
  const safeArea = { paddingLeft: insets.left, paddingRight: insets.right, paddingTop: insets.top, paddingBottom: insets.bottom };
  const stageSize = { width: geometry.width, height: geometry.height };
  const stageTransform = { width: PORTRAIT.width, height: PORTRAIT.height, left: (geometry.width - PORTRAIT.width) / 2, top: (geometry.height - PORTRAIT.height) / 2, transform: [{ scale }] };
  return (
    <View style={[styles.root, safeArea]}>
      <StatusBar hidden />
      <View style={stageSize} aria-hidden={orderOpen} accessibilityElementsHidden={orderOpen} importantForAccessibility={orderOpen ? 'no-hide-descendants' : 'auto'}>
        <View pointerEvents={preview ? 'none' : 'auto'} style={[styles.stage, stageTransform]}>
          <FruitStoreBoard state={shown} scale={scale} preview={preview} dispatch={send} onExit={back} onOrder={() => { if (!preview) setOrderOpen(true); }} welcome={!started && !preview} onStart={() => setStarted(true)} />
        </View>
      </View>
      <Modal visible={orderOpen && !preview} transparent animationType="none" supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']} onRequestClose={() => setOrderOpen(false)}>
        <View style={[styles.root, safeArea]} accessibilityViewIsModal>
          <View style={stageSize}>
            <View style={[styles.stage, stageTransform]}>
              <FruitStoreBoard state={{ ...state, screen: 4 }} scale={scale} preview={false} dispatch={() => setOrderOpen(false)} onExit={() => setOrderOpen(false)} onOrder={() => {}} />
            </View>
          </View>
        </View>
      </Modal>
      {preview && <View style={styles.previewBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="이전 디자인 화면" onPress={() => setPreviewIndex(i => (i + 25) % 26)} style={styles.previewButton}><Text>‹</Text></Pressable>
        <Text style={styles.previewLabel}>{previewIndex + 1}/26 · {SCREENS[previewIndex].name}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="다음 디자인 화면" onPress={() => setPreviewIndex(i => (i + 1) % 26)} style={styles.previewButton}><Text>›</Text></Pressable>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { position: 'absolute' },
  root: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  previewBar: { position: 'absolute', bottom: 0, backgroundColor: '#ffffffed', borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  previewLabel: { fontSize: 11, color: COLORS.ink },
  previewButton: { minWidth: 44, height: 32, alignItems: 'center', justifyContent: 'center' },
});
