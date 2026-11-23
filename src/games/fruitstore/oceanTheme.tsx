import { useId } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { OceanBackButton } from '@/components/mart/OceanCircleButton';
import { OceanCustomer, OceanPearl, OceanShell } from '@/components/mart/OceanShell';

export const OCEAN = { background: '#08A9EB', ink: '#1B3A6B', blue: '#2D8CF0', border: '#BFE3FF', pink: '#FF75B6', green: '#5CCB4E' };

export function OceanPanel({ width, height, warm = false }: { width: number; height: number; warm?: boolean }) {
  const id = useId();
  return <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <Defs><LinearGradient id={id} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={warm ? '#FFA24C' : '#5BC0FF'} /><Stop offset="1" stopColor={warm ? '#FF5A1F' : '#1E78E8'} /></LinearGradient></Defs>
    <Rect x="1.5" y="1.5" width={width - 3} height={height - 3} rx={Math.min(22, height / 2 - 2)} fill={`url(#${id})`} stroke="white" strokeWidth="3" />
    <Rect x={width * 0.18} y="5" width={width * 0.64} height="3" rx="2" fill="white" opacity="0.35" />
  </Svg>;
}

export function OceanLayerArt({ name, width, height, unhappy = false, quantity = 0 }: { name: string; width: number; height: number; unhappy?: boolean; quantity?: number }) {
  if (['Fruit On Shelf', 'Shelf Sliver Fruit', 'Lifted Fruit', 'Fruit Icon', 'Dot'].includes(name)) return <OceanShell size={Math.min(width, height)} />;
  if (name === 'Cashier Group') return <Image source={require('../../assets/mart/nua-mascot.png')} resizeMode="contain" style={{ position: 'absolute', left: -22, width: width + 44, height }} />;
  if (name === 'Customer Group') return <OceanCustomer width={width} height={height} unhappy={unhappy} />;
  if (['Coin', 'Coin Icon', 'Pearl'].includes(name)) return <OceanPearl size={Math.min(width, height)} />;
  if (name === 'Back Button') return <OceanBackButton />;
  if (name.endsWith('Button')) return <OceanPanel width={width} height={height} warm />;
  if (name === 'Counter') return <View style={{ width, height }}><OceanPanel width={width} height={height} /><Text style={styles.shopLabel}>조개 상점</Text></View>;
  if (name === 'Basket') {
    const columns = quantity <= 6 ? 3 : 6;
    const size = Math.min(18, (width - 48) / columns);
    return <View style={[styles.basket, { width, height }]}><View style={styles.basketHandle} /><View style={{ flexDirection: 'row', flexWrap: 'wrap', width: size * columns }}>{Array.from({ length: quantity }, (_, i) => <OceanShell key={i} size={size} />)}</View></View>;
  }
  return null;
}

export const hasOceanArt = (name: string) => ['Fruit On Shelf', 'Shelf Sliver Fruit', 'Lifted Fruit', 'Fruit Icon', 'Dot', 'Cashier Group', 'Customer Group', 'Coin', 'Coin Icon', 'Pearl', 'Counter', 'Basket'].includes(name) || name.endsWith('Button');

const styles = StyleSheet.create({
  shopLabel: { position: 'absolute', top: 26, width: '100%', textAlign: 'center', color: 'white', fontWeight: '800', fontSize: 19 },
  basket: { borderRadius: 18, backgroundColor: '#ECF8FF', borderWidth: 3, borderColor: '#79BFFF', justifyContent: 'center', paddingLeft: 12 },
  basketHandle: { position: 'absolute', top: -11, left: 28, width: 36, height: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 3, borderColor: '#79BFFF', backgroundColor: 'transparent' },
});
