import { useMemo, useRef } from 'react';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

import designs from './design.json';
import { CUSTOMER_COUNT, isShelf, isSuccess, ORDER_SIZE } from './game';
import type { Action, State } from './game';

type Layer = {
  id: string; parent: string; name: string; type: string;
  x: number; y: number; w: number; h: number;
  color?: string; fillOpacity?: number; radius?: number; text?: string;
  fontSize?: number; font?: { family: string; style: string }; align?: string;
  rotation?: number; opacity?: number; hidden?: boolean;
  shadow?: { x: number; y: number; blur: number; alpha: number }[];
};
type Design = { id: string; name: string; nodes: Layer[] };
export const SCREENS = designs as Design[];
export const COLORS = { background: '#fcf3e4', fruit: '#ef4e4e', green: '#24c5a5', orange: '#f98c36', pink: '#f4779c', ink: '#33291f' };

function layerStyle(node: Layer): ViewStyle {
  const shadow = node.shadow?.[0];
  const transparentGroup = !node.color && (node.type === 'FRAME' || node.type === 'GROUP');
  return {
    position: 'absolute', left: node.x, top: node.y, width: node.w, height: node.h,
    backgroundColor: node.type === 'TEXT' ? undefined : node.color,
    borderRadius: node.type === 'ELLIPSE' ? Math.max(node.w, node.h) / 2 : node.radius,
    opacity: (node.opacity ?? 1) * (node.fillOpacity ?? 1),
    transform: node.rotation ? [{ rotate: `${-node.rotation}deg` }] : undefined,
    transformOrigin: 'top left',
    boxShadow: shadow && !transparentGroup ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px rgba(0,0,0,${shadow.alpha})` : undefined,
    filter: shadow && transparentGroup && Platform.OS === 'web' ? `drop-shadow(${shadow.x}px ${shadow.y}px ${shadow.blur / 2}px rgba(0,0,0,${shadow.alpha}))` : undefined,
  };
}

function LayerView({ node, childrenByParent }: { node: Layer; childrenByParent: Map<string, Layer[]> }) {
  if (node.hidden) return null;
  if (node.type === 'TEXT') {
    const textStyle: TextStyle = {
      color: node.color, fontSize: node.fontSize,
      fontFamily: node.font?.family === 'Gaegu' ? 'GaeguBold' : 'DunggeunmisoBold',
      textAlign: node.align === 'LEFT' ? 'left' : node.align === 'RIGHT' ? 'right' : 'center',
      lineHeight: node.h, includeFontPadding: false,
    };
    return <Text selectable={false} style={[layerStyle(node), textStyle]}>{node.text}</Text>;
  }
  return <View style={layerStyle(node)}>{childrenByParent.get(node.id)?.map(child => <LayerView key={child.id} node={Platform.OS !== 'web' && node.shadow && child.color && child.type !== 'TEXT' ? { ...child, shadow: child.shadow ?? node.shadow } : child} childrenByParent={childrenByParent} />)}</View>;
}

/** A fruit is both tappable and draggable. A cancelled drop never changes stock. */
function Fruit({ node, index, scale, pick }: { node: Layer; index: number; scale: number; pick: () => void }) {
  const offset = useRef(new Animated.ValueXY()).current;
  const current = useRef({ scale, pick, node });
  current.current = { scale, pick, node };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) + Math.abs(g.dy) > 8,
    onPanResponderMove: (_, g) => offset.setValue({ x: g.dx / current.current.scale, y: g.dy / current.current.scale }),
    onPanResponderRelease: (_, g) => {
      const { node: fruit, scale: zoom, pick: add } = current.current;
      const x = fruit.x + fruit.w / 2 + g.dx / zoom;
      const y = fruit.y + fruit.h / 2 + g.dy / zoom;
      const tapped = Math.abs(g.dx) + Math.abs(g.dy) <= 8;
      if (tapped || (x >= 680 && x <= 852 && y >= 280 && y <= 393)) add();
      Animated.spring(offset, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
    onPanResponderTerminate: () => offset.setValue({ x: 0, y: 0 }),
  }), [offset]);
  const keyboard = Platform.OS === 'web' ? {
    tabIndex: 0 as const,
    onKeyDown: (event: { key: string; preventDefault: () => void }) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(); }
    },
  } : {};
  return (
    <Animated.View {...responder.panHandlers} {...keyboard} accessible accessibilityRole="button"
      accessibilityLabel={`과일 ${index + 1} 담기`} accessibilityHint="누르거나 바구니로 끌어 주세요"
      accessibilityActions={[{ name: 'activate' }]} onAccessibilityAction={pick} onAccessibilityTap={pick}
      style={[layerStyle(node), { transform: offset.getTranslateTransform() }]} />
  );
}

function Hit({ node, label, onPress }: { node: Layer; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ position: 'absolute', left: node.x, top: node.y, width: node.w, height: Math.max(node.h, 44), borderRadius: 24 }} />;
}

export function FruitStoreBoard({ state, scale, preview, dispatch, onExit, onOrder }: {
  state: State; scale: number; preview: boolean; dispatch: (action: Action) => void; onExit: () => void; onOrder: () => void;
}) {
  const design = SCREENS[state.screen];
  const shelf = isShelf(state.screen);
  const count = state.selected.length;
  const layers = useMemo(() => {
    if (preview) return design.nodes;
    const avatar = design.nodes.find(n => n.name === 'Avatar Pill');
    const badge = design.nodes.find(n => n.name === 'Count Badge');
    const dots = design.nodes.filter(n => n.parent === avatar?.id && n.type === 'ELLIPSE' && n.w === 28);
    const comparisonDots = design.nodes.filter(n => n.name === 'Dot');
    const shownCompleted = state.completed + (isSuccess(state.screen) ? 1 : 0);
    return design.nodes.filter(n => n.name !== 'Lifted Fruit' && (!shelf || n.name !== 'Fruit On Shelf')).map(n => {
      if (n.type === 'TEXT' && n.parent === avatar?.id) return { ...n, text: String(state.coins) };
      const dot = dots.indexOf(n);
      if (dot >= 0) return { ...n, color: dot < shownCompleted ? COLORS.green : dot === shownCompleted ? '#75b4f1' : '#d9d9de' };
      if (badge && n.type === 'TEXT' && Math.abs(n.x - badge.x) < 1 && Math.abs(n.y - badge.y) < 1) return { ...n, text: String(count), ...(shelf ? { x: 789, y: 305.5, w: 39, h: 39 } : {}) };
      if (shelf && n.name === 'Basket') return { ...n, x: 690, y: 300, w: 146, h: 50 };
      if (shelf && n.name === 'Count Badge') return { ...n, x: 789, y: 305.5, w: 39, h: 39 };
      if (shelf && (n.name === 'Go To Counter Button' || n.text === '계산대로 ›')) return { ...n, x: 690, y: 350, w: 146, h: 43 };
      if (state.screen === 19 && n.name === 'Dot') return { ...n, color: comparisonDots.indexOf(n) < count ? COLORS.fruit : '#ffffff' };
      if (n.name === '01') return { ...n, text: String(state.completed + 1).padStart(2, '0') };
      if (state.screen === 23 && state.completed === CUSTOMER_COUNT && n.text === '다음 손님 ›') return { ...n, text: '오늘 장사 끝 ›' };
      return n;
    });
  }, [design, preview, shelf, state.screen, state.completed, state.coins, count]);
  const childrenByParent = useMemo(() => {
    const map = new Map<string, Layer[]>();
    layers.forEach(n => map.set(n.parent, [...(map.get(n.parent) ?? []), n]));
    return map;
  }, [layers]);
  const find = (name: string) => layers.find(n => n.name === name);
  const actions: { name: string; label: string; action: () => void }[] = [];
  if (!preview) {
    actions.push({ name: 'Back Button', label: '게임 선택으로 돌아가기', action: onExit });
    if ([0, 1, 2].includes(state.screen)) actions.push({ name: 'Customer Group', label: '손님 주문 받기', action: () => dispatch({ type: 'advance' }) });
    if (state.screen === 4) actions.push({ name: 'Confirm Button', label: '과일 5개 주문 확인', action: () => dispatch({ type: 'advance' }) });
    if (shelf) {
      actions.push({ name: 'Basket', label: `바구니 ${count}개, 눌러서 한 개 되돌리기`, action: () => dispatch({ type: 'remove' }) });
      actions.push({ name: 'Go To Counter Button', label: '계산대로 이동', action: () => dispatch({ type: 'counter' }) });
    }
    if (state.screen === 12) actions.push({ name: 'Hand Over Button', label: `과일 ${count}개 건네주기`, action: () => dispatch({ type: 'advance' }) });
    if ([15, 19].includes(state.screen)) actions.push({ name: 'Back To Shelf Button', label: count > ORDER_SIZE ? '과일이 많아요. 진열대에서 되돌리기' : '과일이 모자라요. 진열대에서 더 담기', action: () => dispatch({ type: 'shelf' }) });
    if (state.screen === 23) actions.push({ name: 'Next Customer Button', label: state.completed === CUSTOMER_COUNT ? '오늘 장사 마치기' : '다음 손님 맞이하기', action: () => dispatch({ type: 'advance' }) });
    if (state.screen === 24) actions.push({ name: 'End Of Day Button', label: '오늘 장사 결과 보기', action: () => dispatch({ type: 'advance' }) });
    if (state.screen === 25) actions.push({ name: 'Back To Shop Button', label: '가게로 돌아가 새로 시작', action: () => dispatch({ type: 'restart' }) });
    if (find('Ticket') && !isSuccess(state.screen) && ![15, 19].includes(state.screen)) actions.push({ name: 'Ticket', label: '주문서 다시 보기', action: onOrder });
  }
  return (
    <View testID={`fruitstore-screen-${state.screen + 1}`} style={styles.board}>
      <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
        {childrenByParent.get(design.id)?.map(n => <LayerView key={n.id} node={n} childrenByParent={childrenByParent} />)}
      </View>
      {!preview && shelf && SCREENS[7].nodes.filter(n => n.name === 'Fruit On Shelf').map((n, index) => !state.selected.includes(index) && <Fruit key={n.id} node={n} index={index} scale={scale} pick={() => dispatch({ type: 'pick', fruit: index })} />)}
      {actions.map(({ name, label, action }) => {
        const node = find(name);
        return node ? <Hit key={name} node={node} label={label} onPress={action} /> : null;
      })}
      {!preview && shelf && count > 0 && !find('Go To Counter Button') && (
        <Pressable accessibilityRole="button" accessibilityLabel="계산대로 이동" onPress={() => dispatch({ type: 'counter' })} style={styles.counterButton}>
          <Text style={styles.buttonText}>계산대로 ›</Text>
        </Pressable>
      )}
      {!preview && state.screen === 12 && <Pressable accessibilityRole="button" accessibilityLabel="진열대로 돌아가 수량 바꾸기" onPress={() => dispatch({ type: 'shelf' })} style={styles.shelfReturn}><Text style={styles.buttonText}>‹ 진열대로</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { width: 852, height: 393, overflow: 'hidden', backgroundColor: COLORS.background },
  counterButton: { position: 'absolute', left: 690, top: 350, width: 146, height: 43, backgroundColor: COLORS.green, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  shelfReturn: { position: 'absolute', left: 16, top: 340, width: 150, height: 44, backgroundColor: COLORS.green, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: 'GaeguBold', fontSize: 16, color: '#fff' },
});
