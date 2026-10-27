import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { buildPuzzle, STAGES, stageHint } from '@/game/stages';
import { StageConfig } from '@/game/types';
import { buildGridLines, buildMapNodes, mapContentHeight } from '@/game/worldmap';

const PREVIEW_BOARD = { width: 400, height: 288 };
const STONE_SIZE = 66;

type Preview = {
  path: string;
  viewBox: string;
};

function buildPreview(stage: StageConfig): Preview {
  const puzzle = buildPuzzle(stage, PREVIEW_BOARD);
  const minX = Math.min(...puzzle.pieces.map((piece) => piece.slot.x));
  const maxX = Math.max(...puzzle.pieces.map((piece) => piece.slot.x + piece.width));
  const minY = Math.min(...puzzle.pieces.map((piece) => piece.slot.y));
  const maxY = Math.max(...puzzle.pieces.map((piece) => piece.slot.y + piece.height));
  const padding = 8;

  return {
    path: puzzle.silhouette,
    viewBox: `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`
  };
}

export default function StageMapScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const contentHeight = mapContentHeight(STAGES.length);
  const nodes = useMemo(() => buildMapNodes(STAGES.length, width), [width]);
  const grid = useMemo(() => buildGridLines(width, contentHeight), [width, contentHeight]);
  const previews = useMemo(() => {
    const map: Record<number, Preview> = {};

    for (const stage of STAGES) {
      map[stage.id] = buildPreview(stage);
    }

    return map;
  }, []);

  const stage = selected === null ? null : STAGES.find((item) => item.id === selected) ?? null;
  const path = nodes.map((node) => `${node.x},${node.y}`).join(' L ');

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
  }, [contentHeight]);

  return (
    <SafeAreaView className="flex-1 bg-[#EAF2FB]" edges={['top']}>
      <View className="px-6 pb-2 pt-3">
        <Text className="text-3xl font-bold text-slate-900">수리공</Text>
        <Text className="mt-1 text-base text-slate-500">고칠 물건을 골라 주세요</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ height: contentHeight }}
        showsVerticalScrollIndicator={false}
      >
        {/* 배경 아트 자리 — 나중에 이 자리에 벡터 배경 이미지를 깔고, 격자/경로/스톤을 그 위 레이어로 둡니다. */}
        <Svg width={width} height={contentHeight} style={{ position: 'absolute' }}>
          {grid.map((line, index) => (
            <Path
              key={`grid-${index}`}
              d={`M${line.from.x},${line.from.y} L${line.to.x},${line.to.y}`}
              stroke="#CBD8E8"
              strokeWidth={1}
            />
          ))}
        </Svg>

        <Svg width={width} height={contentHeight} style={{ position: 'absolute' }}>
          <Path
            d={`M ${path}`}
            stroke="#E8A87C"
            strokeWidth={7}
            strokeDasharray="2 13"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {nodes.map((node) => {
          const stageItem = STAGES[node.id - 1];
          const active = node.id === selected;
          const size = STONE_SIZE * node.scale;

          return (
            <Pressable
              key={node.id}
              onPress={() => setSelected(node.id)}
              style={{
                position: 'absolute',
                left: node.x - size / 2,
                top: node.y - size / 2,
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: size * 0.72,
                  width: size * 0.86,
                  height: size * 0.3,
                  borderRadius: size,
                  backgroundColor: '#C3CEDA'
                }}
              />
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: size,
                  backgroundColor: active ? '#F05A28' : '#FFFFFF',
                  borderWidth: active ? 3 : 2,
                  borderColor: active ? '#FFFFFF' : '#F0A36B',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text
                  className={
                    active ? 'font-bold text-white' : 'font-bold text-slate-700'
                  }
                  style={{ fontSize: size * 0.38 }}
                >
                  {node.id}
                </Text>
              </View>
              <Text
                className="absolute text-[11px] font-medium text-slate-500"
                style={{ top: size + 2 }}
                numberOfLines={1}
              >
                {stageItem.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {stage ? (
        <Animated.View
          key={stage.id}
          entering={SlideInDown.duration(220)}
          exiting={SlideOutDown.duration(160)}
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-slate-200 bg-white px-6 pb-10 pt-5"
        >
          <View className="flex-row items-center" style={{ gap: 18 }}>
            <View
              className="items-center justify-center rounded-3xl bg-slate-50"
              style={{ width: 132, height: 152 }}
            >
              <Svg width={116} height={136} viewBox={previews[stage.id].viewBox}>
                <Path d={previews[stage.id].path} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={2} />
              </Svg>
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {stage.id}. {stage.name}
              </Text>
              <Text className="mt-2 text-base text-gray-500">{stageHint(stage)}</Text>

              <View className="mt-4 flex-row items-center" style={{ gap: 3 }}>
                {STAGES.map((item) => (
                  <View
                    key={item.id}
                    className={
                      item.id <= stage.id
                        ? 'h-2 flex-1 rounded-full bg-orange-400'
                        : 'h-2 flex-1 rounded-full bg-slate-200'
                    }
                  />
                ))}
              </View>
              <Text className="mt-2 text-sm text-gray-400">
                난이도 {stage.id} / {STAGES.length}
              </Text>
            </View>

            <Pressable
              onPress={() => router.push(`/stage/${stage.id}`)}
              className="items-center justify-center rounded-full bg-orange-500"
              style={{ width: 76, height: 76 }}
            >
              <Text className="text-2xl font-bold text-white">▶</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}
