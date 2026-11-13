import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Svg } from 'react-native-svg';

import { StageBackdrop } from '@/components/StageBackdrop';
import { TopBar } from '@/components/TopBar';
import { buildPuzzle, STAGES, stageHint } from '@/games/repairman/game/stages';
import { DESIGN_FRAME, stageScale } from '@/stage';
import { COLORS, FONT, SHADOW, withAlpha } from '@/theme';
import { StageConfig } from '@/games/repairman/game/types';
import { buildGridLines, buildMapNodes, mapContentHeight, MAP } from '@/games/repairman/game/worldmap';

const PREVIEW_BOARD = { width: 400, height: 288 };
const STONE_SIZE = 66;

type Preview = {
  path: string;
  viewBox: string;
};

type StageMapProps = {
  accent: string;
  onStart: (stageId: number) => void;
  onExit: () => void;
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

export function StageMap({ accent, onStart, onExit }: StageMapProps) {
  const { width, height } = useWindowDimensions();
  const scale = stageScale(width, height);
  const panelWidth = width - 32;
  const mapWidth = Math.min(panelWidth, DESIGN_FRAME.width);
  const mapOffset = (panelWidth - mapWidth) / 2;
  const stoneFactor = Math.min(scale, 1.4);
  const stone = Math.round(STONE_SIZE * stoneFactor);
  const stepY = MAP.stepY * stoneFactor;
  const sheetScale = Math.min(scale, 1.3);
  const scrollRef = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const contentHeight = mapContentHeight(STAGES.length, stepY);
  const nodes = useMemo(() => buildMapNodes(STAGES.length, mapWidth, stepY), [mapWidth, stepY]);
  const grid = useMemo(() => buildGridLines(mapWidth, contentHeight), [mapWidth, contentHeight]);
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
    <View className="flex-1" style={{ backgroundColor: COLORS.oceanDeep }}>
      <StageBackdrop dim={0.28} />

      <SafeAreaView className="flex-1" edges={['top']}>
        <TopBar title="수리공" onBack={onExit} />

      <View style={styles.mapPanel}>
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ height: contentHeight }}
          showsVerticalScrollIndicator={false}
        >
        {/* 배경 아트 자리 — 나중에 이 자리에 벡터 배경 이미지를 깔고, 격자/경로/스톤을 그 위 레이어로 둡니다. */}
        <Svg width={mapWidth} height={contentHeight} style={{ position: 'absolute', left: mapOffset }}>
          {grid.map((line, index) => (
            <Path
              key={`grid-${index}`}
              d={`M${line.from.x},${line.from.y} L${line.to.x},${line.to.y}`}
              stroke={withAlpha(COLORS.oceanMid, 0.22)}
              strokeWidth={1}
            />
          ))}
        </Svg>

        <Svg width={mapWidth} height={contentHeight} style={{ position: 'absolute', left: mapOffset }}>
          <Path
            d={`M ${path}`}
            stroke={COLORS.sand}
            strokeWidth={7}
            strokeDasharray="2 13"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {nodes.map((node) => {
          const stageItem = STAGES[node.id - 1];
          const active = node.id === selected;
          const size = stone * node.scale;

          return (
            <Pressable
              key={node.id}
              onPress={() => setSelected(node.id)}
              style={{
                position: 'absolute',
                left: node.x + mapOffset - size / 2,
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
                  backgroundColor: withAlpha(COLORS.shadow, 0.18)
                }}
              />
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: size,
                  backgroundColor: active ? accent : COLORS.white,
                  borderWidth: active ? 4 : 3,
                  borderColor: active ? COLORS.white : COLORS.sand,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontFamily: FONT, fontSize: size * 0.4, color: active ? COLORS.white : COLORS.oceanDeep }}>
                  {node.id}
                </Text>
              </View>
              <Text
                style={{ position: 'absolute', top: size + 2, fontFamily: FONT, fontSize: 12 * stoneFactor, color: '#60708A' }}
                numberOfLines={1}
              >
                {stageItem.name}
              </Text>
            </Pressable>
          );
        })}
        </ScrollView>
      </View>

      {stage ? (
        <Animated.View
          key={stage.id}
          entering={SlideInDown.duration(220)}
          exiting={SlideOutDown.duration(160)}
          style={[
            styles.sheet,
            { paddingHorizontal: 24 * sheetScale, paddingTop: 16 * sheetScale, paddingBottom: 18 * sheetScale }
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 * sheetScale }}>
            <View
              style={[
                styles.preview,
                { width: 132 * sheetScale, height: 152 * sheetScale, borderRadius: 24 * sheetScale }
              ]}
            >
              <Svg width={116 * sheetScale} height={136 * sheetScale} viewBox={previews[stage.id].viewBox}>
                <Path d={previews[stage.id].path} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={2} />
              </Svg>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.stageTitle, { fontSize: 24 * sheetScale }]}>
                {stage.id}. {stage.name}
              </Text>
              <Text style={[styles.stageHint, { fontSize: 15 * sheetScale, marginTop: 6 * sheetScale }]}>
                {stageHint(stage)}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 12 * sheetScale }}>
                {STAGES.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      height: 8 * sheetScale,
                      flex: 1,
                      borderRadius: 999,
                      backgroundColor: item.id <= stage.id ? COLORS.orange : '#E2E8F0'
                    }}
                  />
                ))}
              </View>
              <Text style={[styles.difficulty, { fontSize: 13 * sheetScale, marginTop: 6 * sheetScale }]}>
                난이도 {stage.id} / {STAGES.length}
              </Text>
            </View>

            <Pressable
              onPress={() => onStart(stage.id)}
              accessibilityRole="button"
              accessibilityLabel="시작"
              style={[
                styles.startButton,
                SHADOW.card,
                {
                  width: 76 * sheetScale,
                  height: 76 * sheetScale,
                  borderRadius: 38 * sheetScale,
                  backgroundColor: accent
                }
              ]}
            >
              <Svg width={26 * sheetScale} height={30 * sheetScale} viewBox="0 0 24 28">
                <Path d="M4 2 L21 14 L4 26 Z" fill={COLORS.white} />
              </Svg>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = {
  sheet: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28
  },
  preview: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#F8FAFC'
  },
  stageTitle: {
    fontFamily: FONT,
    color: '#1F2937'
  },
  stageHint: {
    fontFamily: FONT,
    color: '#6B7280'
  },
  difficulty: {
    fontFamily: FONT,
    color: '#9CA3AF'
  },
  startButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  },
  mapPanel: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 28,
    overflow: 'hidden' as const,
    backgroundColor: withAlpha(COLORS.foam, 0.94)
  },
};
