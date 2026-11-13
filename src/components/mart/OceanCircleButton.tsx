import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Pressable } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

let gradientSeq = 0;
function useGradientId(prefix: string): string {
  const ref = useRef<string | undefined>(undefined);
  if (!ref.current) {
    gradientSeq += 1;
    ref.current = `${prefix}-${gradientSeq}`;
  }
  return ref.current;
}

interface OceanCircleButtonProps {
  /** 피그마 원본에서의 버튼 박스 좌상단 좌표 (버튼 내부 아이콘 path들이 이 좌표계를 그대로 쓴다). */
  originX: number;
  originY: number;
  /** 피그마 원본에서의 버튼 박스 한 변 길이. */
  boxSize: number;
  /** 실제 렌더 크기(px). 생략하면 boxSize와 같다. */
  displaySize?: number;
  colors: [string, string];
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: ReactNode;
}

/** 바다 테마 원형 그라디언트 버튼(뒤로가기·단어장·다음 등)의 공통 껍데기. */
export function OceanCircleButton({
  originX,
  originY,
  boxSize,
  displaySize,
  colors,
  onPress,
  disabled,
  accessibilityLabel,
  children,
}: OceanCircleButtonProps) {
  const gradientId = useGradientId('ocean-circle-btn');
  const size = displaySize ?? boxSize;
  const cx = originX + boxSize / 2;
  const cy = originY + boxSize / 2;
  const r = boxSize / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Svg width={size} height={size} viewBox={`${originX} ${originY} ${boxSize} ${boxSize}`}>
        <Defs>
          <LinearGradient id={gradientId} x1={cx} y1={originY} x2={cx} y2={originY + boxSize} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Circle cx={cx} cy={cy} r={r} fill={`url(#${gradientId})`} />
        <Circle cx={cx} cy={cy} r={r - 2} stroke="white" strokeWidth={4} fill="none" />
        <Ellipse cx={cx} cy={originY + boxSize * 0.21} rx={boxSize * 0.25} ry={boxSize * 0.09} fill="white" fillOpacity={0.45} />
        {children}
      </Svg>
    </Pressable>
  );
}

const BLUE_GRADIENT: [string, string] = ['#5BC0FF', '#1E78E8'];
const PURPLE_GRADIENT: [string, string] = ['#B48CFF', '#7B4DFF'];
const ORANGE_GRADIENT: [string, string] = ['#FFA24C', '#FF5A1F'];

interface SmallOceanButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/** 좌상단 뒤로가기 버튼 (46x46, 파란 그라디언트, 화살표 쉐브론). */
export function OceanBackButton({ onPress, disabled, accessibilityLabel = '뒤로가기' }: SmallOceanButtonProps) {
  return (
    <OceanCircleButton originX={14} originY={53} boxSize={46} colors={BLUE_GRADIENT} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      <Path
        d="M39.625 69.875L33.5 76L39.625 82.125"
        stroke="white"
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </OceanCircleButton>
  );
}

/** 우상단 단어장 버튼 (46x46, 보라 그라디언트, 책 모양 아이콘). displaySize로 더 크게도 쓸 수 있다. */
export function OceanBookButton({
  onPress,
  disabled,
  accessibilityLabel = '단어장',
  displaySize,
}: SmallOceanButtonProps & { displaySize?: number }) {
  return (
    <OceanCircleButton
      originX={330}
      originY={53}
      boxSize={46}
      displaySize={displaySize}
      colors={PURPLE_GRADIENT}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    >
      <Path
        d="M346 69.875C346 69.4109 346.184 68.9658 346.513 68.6376C346.841 68.3094 347.286 68.125 347.75 68.125H359.125V82.125H347.75C347.286 82.125 346.841 82.3094 346.513 82.6376C346.184 82.9658 346 83.4109 346 83.875V69.875Z"
        stroke="white"
        strokeWidth={2.6}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M346 82.125C346 81.6609 346.184 81.2158 346.513 80.8876C346.841 80.5594 347.286 80.375 347.75 80.375H359.125" stroke="white" strokeWidth={2.6} fill="none" />
    </OceanCircleButton>
  );
}

/** 하단 중앙 큰 버튼(72~78) 공통 — 다음 진행용 화살표, 주황 그라디언트. */
export function OceanNextButton({ onPress, disabled, accessibilityLabel = '다음' }: SmallOceanButtonProps) {
  return (
    <OceanCircleButton originX={156} originY={740} boxSize={78} colors={ORANGE_GRADIENT} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      <Path
        d="M184.5 779H204M196.5 770L205.5 779L196.5 788"
        stroke="white"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </OceanCircleButton>
  );
}

/** 하단 중앙 큰 버튼 — 다시 시도(재시도), 디자인에 없어서 화살표를 반대로 돌려 근사한다. */
export function OceanRetryButton({ onPress, disabled, accessibilityLabel = '다시 시도' }: SmallOceanButtonProps) {
  return (
    <OceanCircleButton originX={156} originY={740} boxSize={78} colors={ORANGE_GRADIENT} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      <Path
        d="M174 762C178.5 754 187 749 196.5 749C210 749 221 760 221 773.5C221 787 210 798 196.5 798C186 798 177 791.5 173.5 782"
        stroke="white"
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M174 762V750M174 762H186" stroke="white" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </OceanCircleButton>
  );
}

/** 카드 안에 들어가는 작은 소리 재생 버튼 (50x50, 파란 그라디언트, 스피커 아이콘). */
export function OceanSoundButton({ onPress, disabled, accessibilityLabel = '소리 듣기' }: SmallOceanButtonProps) {
  return (
    <OceanCircleButton originX={256.5} originY={563} boxSize={50} colors={BLUE_GRADIENT} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      <Path d="M273.833 585.124V590.874H277.666L282.458 594.708V581.291L277.666 585.124H273.833Z" fill="white" />
      <Path
        d="M285.812 584.646C286.69 585.542 287.182 586.746 287.182 588C287.182 589.254 286.69 590.458 285.812 591.354M288.208 582.25C289.73 583.777 290.584 585.844 290.584 588C290.584 590.156 289.73 592.223 288.208 593.75"
        stroke="white"
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
    </OceanCircleButton>
  );
}
