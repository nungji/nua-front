import { useMemo, useRef, useState } from 'react';
import { Animated, Image, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import { CUSTOMER_COUNT, isShelf, isSuccess, orderSize, availablePack } from './game';
import type { Action, State } from './game';
import { ART, BasketArt, Character, Coin, CounterArt, GlossyButton, OutlinedLabel, Register, ShelfArt, Shell, ShellPack } from './PortraitArt';
import { PORTRAIT, PORTRAIT_BASKET, SHELF_SLOTS } from './portraitLayout';
import { BASKET, SHELF, FLOOR, FLOOR_SLOTS, containsPoint, floorSlotAt, TAP_DISTANCE } from './interaction';

export const COLORS = { background: '#02B6EF', ink: '#143A9F' };
export const SCREENS = ['손님 도착', '손님 맞이', '주문 받기', '주문서 열기', '주문 확인', '진열대로', '진열대 도착', '조개 고르기', '조개 담기', '주문 수량 완성', '많이 담았어요', '계산대로', '건네주기', '수량 확인', '주문 성공', '많아요', '조개 되돌리기', '수량 수정 완료', '주문 성공', '모자라요', '조개 더 담기', '수량 수정 완료', '주문 성공', '보상', '장사 완료', '오늘의 결과'].map(name => ({ name }));
const at = (left: number, top: number, width?: number, height?: number): ViewStyle => ({ position: 'absolute', left, top, width, height });

function Button({ label, text, onPress, x, y, w = 252, h = 76, yellow = false, disabled = false }: { label: string; text: string; onPress: () => void; x: number; y: number; w?: number; h?: number; yellow?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [at(x, y, w, h), { opacity: disabled ? .72 : 1, transform: [{ scale: pressed ? .96 : 1 }] }]}>
    <View pointerEvents="none"><GlossyButton width={w} height={h} yellow={yellow} /><View style={StyleSheet.absoluteFill}><OutlinedLabel text={text} width={w} height={h - 6} fontSize={text.length > 10 ? 22 : text.length > 7 ? 25 : 30} /></View></View>
  </Pressable>;
}

function Header({ state, onExit }: { state: State; onExit: () => void }) {
  return <>
    <Button label="게임 선택으로 돌아가기" text="‹" x={10} y={28} w={54} h={54} onPress={onExit} />
    <View style={[at(69, 28, 309, 49), styles.header]}>
      {Array.from({ length: CUSTOMER_COUNT }, (_, i) => <View key={i} style={{ opacity: i <= state.completed ? 1 : .24 }}><Character kind="customer" width={35} height={39} />{i < state.completed && <Text style={styles.check}>✓</Text>}</View>)}
      <View style={styles.divider} /><Coin size={33} /><Text testID="shellstore-coins" style={styles.coinCount}>{state.coins}</Text>
    </View>
  </>;
}

function Order({ onPress, target }: { onPress: () => void; target: number }) {
  return <Pressable accessibilityRole="button" accessibilityLabel="주문서 다시 보기" onPress={onPress} style={[at(247, 100, 128, 48), styles.ticket]}><Shell size={38} /><Text style={styles.orderNumber}>×{target}</Text><Text style={styles.star}>★</Text></Pressable>;
}

function DraggablePack({ rect, label, count, scale, onTap, onDrop, onDrag, selected = false, separated = false, children }: {
  rect: { x: number; y: number; w: number; h: number }; label: string; count: number; scale: number;
  onTap: () => void; onDrop: (x: number, y: number) => void; onDrag: (quantity: number) => void; selected?: boolean; separated?: boolean; children?: ReactNode;
}) {
  const offset = useRef(new Animated.ValueXY()).current;
  const travel = useRef(0);
  const [dragging, setDragging] = useState(false);
  const current = useRef({ scale, onTap, onDrop, onDrag, count, rect });
  current.current = { scale, onTap, onDrop, onDrag, count, rect };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { offset.stopAnimation(); offset.setValue({ x: 0, y: 0 }); travel.current = 0; },
    onPanResponderMove: (_, g) => {
      travel.current = Math.max(travel.current, Math.abs(g.dx) + Math.abs(g.dy));
      if (travel.current > TAP_DISTANCE) { setDragging(true); current.current.onDrag(current.current.count); }
      offset.setValue({ x: g.dx / current.current.scale, y: g.dy / current.current.scale });
    },
    onPanResponderRelease: (_, g) => {
      const now = current.current;
      const x = now.rect.x + now.rect.w / 2 + g.dx / now.scale;
      const y = now.rect.y + now.rect.h / 2 + g.dy / now.scale;
      const distance = Math.max(travel.current, Math.abs(g.dx) + Math.abs(g.dy));
      setDragging(false); now.onDrag(0);
      // A drag returning to its origin is a cancellation, never an activation.
      if (distance <= TAP_DISTANCE) now.onTap();
      else if (Math.abs(g.dx) + Math.abs(g.dy) > TAP_DISTANCE) now.onDrop(x, y);
      Animated.spring(offset, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
    onPanResponderTerminate: () => { setDragging(false); current.current.onDrag(0); offset.setValue({ x: 0, y: 0 }); },
  }), [offset]);
  const keyboard = Platform.OS === 'web' ? { tabIndex: 0 as const, onKeyDown: (e: { key: string; preventDefault: () => void }) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } } } : {};
  return <Animated.View {...responder.panHandlers} {...keyboard} accessible accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected }} accessibilityHint="원하는 자리로 끌어서 놓아 주세요" accessibilityActions={[{ name: 'activate' }]} onAccessibilityAction={onTap} onAccessibilityTap={onTap} style={[at(rect.x, rect.y, rect.w, rect.h), selected && styles.selectedPack, { zIndex: dragging ? 50 : 5, transform: offset.getTranslateTransform() }]}>{children ?? <ShellPack count={count} width={rect.w} height={rect.h} separated={separated} />}</Animated.View>;
}

export function FruitStoreBoard({ state, scale, preview, dispatch, onExit, onOrder }: {
  state: State; scale: number; preview: boolean; dispatch: (action: Action) => void; onExit: () => void; onOrder: () => void;
}) {
  const [dragSource, setDragSource] = useState<'shelf' | 'floor' | 'basket' | null>(null);
  const [chosenSlot, setChosenSlot] = useState<number | null>(null);
  const chosen = chosenSlot !== null && state.floor[chosenSlot].length > 0 ? chosenSlot : null;
  const shelf = isShelf(state.screen);
  const count = state.selected.length;
  const target = orderSize(state);
  const correction = [15, 19].includes(state.screen);
  const success = isSuccess(state.screen) || state.screen === 23;
  const advance = () => dispatch({ type: 'advance', fromScreen: state.screen });
  const scene = state.screen;
  const { x, y, w, h } = PORTRAIT_BASKET;
  return <View testID={`fruitstore-screen-${scene + 1}`}  style={styles.board}>
    <Image source={ART.ocean} resizeMode="cover" style={styles.background} accessible={false} />
    <>
      <Header state={state} onExit={onExit} />
      {shelf ? <>
        <Order onPress={onOrder} target={target} />
        <View pointerEvents="none" style={at(15, 147)}><ShelfArt /></View>
        <View pointerEvents="none" style={at(225, 558)}><Character kind="cashier" width={145} height={121} /></View>
        <View pointerEvents="none" style={at(70, 663)}><CounterArt width={310} height={116} /></View>
        <View pointerEvents="none" style={at(303, 616)}><Register /></View>
        {count > 0 ? <DraggablePack rect={BASKET} label={`바구니 조개 ${count}개 꺼내기`} count={count} scale={scale} onTap={() => {}} onDrag={n => setDragSource(n ? 'basket' : null)} onDrop={(dropX, dropY) => { const target = floorSlotAt(dropX, dropY); if (target !== null) { dispatch({ type: 'unbasket', slot: target }); setChosenSlot(target); } }}><BasketArt count={count} /></DraggablePack> : <View testID="empty-shell-basket" style={at(x, y, w, h)}><BasketArt count={0} /></View>}
        {dragSource === 'floor' && <View pointerEvents="none" style={[at(x, y, w, h), styles.dropTarget]} />}

        <Text pointerEvents="none" style={[at(20, 408, 350, 18), styles.floorInstruction]}>{dragSource === 'shelf' ? '먼저 모래 위에 놓아 주세요' : dragSource === 'floor' ? '겹쳐서 합치거나 바구니로 옮겨요' : state.floor.every(group => group.length > 0) ? '묶음을 합치거나 바구니로 옮겨 주세요' : '바닥에서 조개를 합쳐 보세요'}</Text>
        <View pointerEvents="none" style={[at(FLOOR.x, FLOOR.y, FLOOR.w, FLOOR.h), styles.floorArea, (dragSource === 'shelf' || dragSource === 'basket') && styles.floorActive]} />
        {FLOOR_SLOTS.map((slot, index) => <View key={`spot-${index}`} pointerEvents="none" style={[at(slot.x, slot.y, slot.w, slot.h), styles.floorSpot]} />)}
        {state.floor.map((group, index) => group.length > 0 && <DraggablePack key={`floor-${index}`} rect={FLOOR_SLOTS[index]} separated label={`바닥 조개 묶음 ${index + 1}, ${group.length}개 선택`} count={group.length} scale={scale} selected={chosen === index} onDrag={n => setDragSource(n ? 'floor' : null)} onTap={() => {
          setChosenSlot(chosen === index ? null : index);
        }} onDrop={(dropX, dropY) => {
          if (containsPoint(BASKET, dropX, dropY)) { dispatch({ type: 'basket-floor', slot: index }); setChosenSlot(null); return; }
          if (containsPoint(SHELF, dropX, dropY)) { dispatch({ type: 'return-floor', slot: index }); setChosenSlot(null); return; }
          const target = floorSlotAt(dropX, dropY);
          if (target !== null && target !== index) { dispatch({ type: 'move-floor', from: index, to: target }); setChosenSlot(target); }
        }} />)}
        {chosen !== null ? <View style={[at(23, 565, 210, 46), styles.floorTools]}>
          <Pressable accessibilityRole="button" accessibilityLabel="선택한 바닥 묶음에서 조개 하나 떼기" disabled={state.floor[chosen].length < 2 || !state.floor.some(group => group.length === 0)} accessibilityState={{ disabled: state.floor[chosen].length < 2 || !state.floor.some(group => group.length === 0) }} onPress={() => dispatch({ type: 'split-floor', slot: chosen })} style={[styles.floorTool, (state.floor[chosen].length < 2 || !state.floor.some(group => group.length === 0)) && { opacity: .35 }]}><Text style={styles.toolIcon}>✂</Text><Text style={styles.toolLabel}>떼기</Text></Pressable>
          <Text pointerEvents="none" style={[styles.floorInstruction, { flex: 1, paddingTop: 5 }]}>겹치면 합쳐져요{'\n'}위로 끌면 진열대로</Text>
        </View> : <Text pointerEvents="none" style={[at(25, 569, 196, 38), styles.floorInstruction]}>{state.floor.some(group => group.length) ? '묶음을 겹치면 합쳐져요\n묶음을 누르면 나눌 수 있어요' : '진열대에서 바닥으로 끌어 주세요 ↓'}</Text>}

        <Button label="계산대로 이동" text="계산대로 ❯" x={75} y={720} w={246} h={79} onPress={() => dispatch({ type: 'counter' })} disabled={count === 0} />
        {SHELF_SLOTS.map((slot, index) => { const remaining = availablePack(state, index).length; return remaining > 0 && <DraggablePack key={`shelf-${index}`} rect={slot} label={`조개 묶음 ${index + 1}, ${remaining}개 바닥에 놓기`} count={remaining} scale={scale} onDrag={n => setDragSource(n ? 'shelf' : null)} onTap={() => {}} onDrop={(dropX, dropY) => { const target = floorSlotAt(dropX, dropY); if (target !== null) { dispatch({ type: 'stage-pack', pack: index, slot: target }); setChosenSlot(target); } }} />; })}

      </> : <>
        <View pointerEvents="none" style={at(-18, 220, 130, 15)}><View style={styles.sideShelf} /></View>
        <View pointerEvents="none" style={at(22, 169)}><Shell size={66} /></View>
        <View pointerEvents="none" style={at(-18, 311, 130, 15)}><View style={styles.sideShelf} /></View>
        <View pointerEvents="none" style={at(22, 260)}><Shell size={66} /></View>
        <View pointerEvents="none" style={at(41, 319)}><Character kind="cashier" width={210} height={172} /></View>
        <View pointerEvents="none" style={at(16, 476)}><CounterArt width={222} height={83} /></View>
        <View pointerEvents="none" style={at(29, 425)}><Register /></View>
        <View pointerEvents="none" style={at(240, 370)}><Character kind="customer" width={142} height={193} /></View>
        {scene >= 3 && scene < 24 && <View style={[at(177, 231, 185, 100), styles.thought]}><Shell size={52} /><Text style={styles.orderNumber}>×{target}</Text><View style={styles.thoughtDot} /></View>}
        {scene === 4 && <>
          <View style={[at(55, 580, 280, 64), styles.comparison]}>{Array.from({ length: target }, (_, i) => <Shell key={i} size={Math.min(43, 250 / target)} />)}</View>
          <Button label={`조개 ${target}개 주문 확인`} text="확인 ✓" x={95} y={662} w={200} onPress={advance} />
        </>}
        {scene >= 11 && scene <= 23 && <View pointerEvents="none" style={at(230, 459)}><BasketArt count={count} width={115} height={84} /></View>}
        {scene === 12 && <>
          <Button label={`조개 ${count}개 건네주기`} text="건네주기 ❯" x={70} y={647} onPress={advance} />
          <Pressable accessibilityRole="button" accessibilityLabel="진열대로 돌아가 수량 바꾸기" onPress={() => dispatch({ type: 'shelf' })} style={[at(95, 738, 200, 44), styles.return]}><Text style={styles.returnText}>‹ 진열대로 돌아가기</Text></Pressable>
        </>}
        {(correction || success) && <>
          <View style={[at(54, 571, 282, 76), styles.comparison]}><View><ShellPack count={count} width={73} height={56} /></View><Text style={[styles.equal, { color: correction ? '#FF3157' : '#25B87C' }]}>{correction ? '≠' : '='}</Text><Shell size={44} /><Text style={styles.orderNumber}>×{target}</Text></View>
          {correction && <><Text style={[styles.feedback, at(40, 646, 310), { marginTop: 0, fontSize: 14 }]}>{count > target ? '조개가 조금 많아요' : '조개를 조금 더 담아 볼까요?'}</Text><Button label={count > target ? '조개가 많아요. 진열대에서 되돌리기' : '조개가 모자라요. 진열대에서 더 담기'} text="⟳" x={100} y={663} w={190} onPress={() => dispatch({ type: 'shelf' })} /></>}
          {success && scene !== 23 && <Text style={[styles.feedback, at(40, 665, 310)]}>딱 맞아요! 고마워요!</Text>}
        </>}
        {scene === 23 && <><View style={[at(139, 657, 112, 48), styles.reward]}><Coin size={37} /><Text style={styles.orderNumber}>+3</Text></View><Button label={state.completed === CUSTOMER_COUNT ? '오늘 장사 마치기' : '다음 손님 맞이하기'} text={state.completed === CUSTOMER_COUNT ? '오늘 장사 끝 ✓' : '다음 손님 ❯'} x={70} y={725} onPress={advance} /></>}
        {scene < 3 && <Pressable accessibilityRole="button" accessibilityLabel="손님 주문 받기" onPress={advance} style={at(240, 370, 142, 193)} />}
        {[0, 1, 2, 3, 5, 6, 11, 13].includes(scene) && <Text style={[styles.feedback, at(35, 622, 320)]}>{scene < 4 ? '어서 오세요!' : scene < 7 ? '조개를 골라 볼까요?' : scene === 13 ? '함께 세어 볼까요?' : '손님에게 가져가요'}</Text>}
        {scene >= 24 && <View style={[at(34, 188, 322, 526), styles.summary]}><Text style={styles.summaryTitle}>오늘 장사 끝!</Text><Character kind="cashier" width={155} height={145} /><Text style={styles.summaryCopy}>친구 {state.completed}명의 주문을 완성했어요</Text><View style={styles.reward}><Coin size={48} /><Text testID="shellstore-total" style={styles.total}>{state.coins}</Text></View><Text style={styles.summaryCopy}>고마워요, 꼬마 점원!</Text><Button label={scene === 24 ? '오늘 장사 결과 보기' : '가게로 돌아가 새로 시작'} text={scene === 24 ? '결과 보기 ❯' : '다시 놀기 ⟳'} x={30} y={420} w={260} yellow onPress={scene === 24 ? advance : () => dispatch({ type: 'restart' })} /></View>}
      </>}
    </>
    {preview && <View pointerEvents="none" style={StyleSheet.absoluteFill} />}
  </View>;
}

const styles = StyleSheet.create({
  board: { width: PORTRAIT.width, height: PORTRAIT.height, overflow: 'hidden', backgroundColor: COLORS.background },
  background: { position: 'absolute', width: '100%', height: '100%' },
  header: { borderWidth: 3, borderColor: 'white', borderRadius: 24, backgroundColor: '#E8FBFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', boxShadow: '0 4px 0 #298FE4' },
  check: { position: 'absolute', right: 0, bottom: 0, color: '#04AC8C', fontWeight: '900', fontSize: 17 },
  divider: { width: 3, height: 29, backgroundColor: '#51D9FA', marginHorizontal: 5, borderRadius: 3 },
  coinCount: { color: '#142D87', fontWeight: '900', fontSize: 26, minWidth: 30 },
  ticket: { backgroundColor: '#FFF4DD', borderWidth: 3, borderColor: 'white', borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 #75A4F2' },
  star: { position: 'absolute', left: -13, top: -21, color: '#FF87CC', fontSize: 38, textShadowColor: 'white', textShadowRadius: 2, textShadowOffset: { width: 0, height: 0 } },
  orderNumber: { color: '#123D9D', fontSize: 31, fontWeight: '900' },
  floorInstruction: { textAlign: 'center', color: '#805329', fontWeight: '700', fontSize: 12, lineHeight: 18 },
  floorArea: { borderWidth: 2, borderColor: '#FFF8DB', borderStyle: 'dashed', borderRadius: 25, backgroundColor: '#FFE5A0' },
  floorActive: { borderWidth: 3, borderColor: 'white', backgroundColor: '#FFF0B9' },
  floorSpot: { borderRadius: 22, backgroundColor: '#FFDF8222' },
  selectedPack: { borderWidth: 2, borderColor: '#00AEEB', borderRadius: 20, backgroundColor: '#FFFCE8AA' },
  floorTools: { flexDirection: 'row', gap: 7, zIndex: 10 },
  floorTool: { width: 65, height: 46, borderRadius: 17, backgroundColor: '#ECFEFF', borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center' },
  toolIcon: { color: '#1274BE', fontSize: 22, fontWeight: '900', lineHeight: 24 },
  toolLabel: { color: '#16449C', fontSize: 10, fontWeight: '700', lineHeight: 13 },
  dropTarget: { borderRadius: 19, outlineWidth: 3, outlineColor: 'white', outlineStyle: 'dashed', backgroundColor: '#FFFF9955' },
  sideShelf: { flex: 1, borderRadius: 20, backgroundColor: '#91E63D', borderWidth: 3, borderColor: '#DDFF9F', boxShadow: '0 8px 0 #26BA72' },
  thought: { borderRadius: 47, borderWidth: 3, borderColor: 'white', backgroundColor: '#F5F0FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 #9198F0' },
  thoughtDot: { position: 'absolute', width: 13, height: 13, borderRadius: 10, backgroundColor: 'white', bottom: -23, left: 79 },
  comparison: { borderRadius: 35, backgroundColor: '#FFFEF1', borderWidth: 3, borderColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, boxShadow: '0 4px 0 #F4B976' },
  equal: { fontSize: 43, fontWeight: '900', marginHorizontal: 2 },
  feedback: { textAlign: 'center', color: '#733F1A', fontSize: 19, fontWeight: '800', marginTop: 35 },
  return: { alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#FFF8DA', borderWidth: 2, borderColor: 'white' },
  returnText: { color: '#123D9D', fontWeight: '800', fontSize: 15 },
  reward: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  summary: { backgroundColor: '#F0FCFF', borderRadius: 35, borderWidth: 4, borderColor: 'white', alignItems: 'center', paddingTop: 22, gap: 15, boxShadow: '0 8px 0 #257BD955' },
  summaryTitle: { fontSize: 32, fontWeight: '900', color: COLORS.ink },
  summaryCopy: { color: COLORS.ink, fontSize: 16, fontWeight: '700' },
  total: { color: COLORS.ink, fontSize: 46, fontWeight: '900' },
});
