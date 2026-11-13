import { Pressable, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import type { MartCornerId } from '@/enums';
import { OceanBigStar, OceanLockBadge } from './OceanDecor';

const CARD_GRADIENTS: Record<MartCornerId, [string, string]> = {
  grocery: ['#FFC24B', '#FF8A1F'],
  household: ['#FFA8D2', '#FF5FA2'],
  electronics: ['#C3A4FF', '#7B4DFF'],
};

interface IconPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
}

interface CornerIcon {
  origin: [number, number];
  paths: IconPath[];
}

// 피그마 원본(M1 바다 마트)에서 그대로 옮긴, 코너별 대표 상품 아이콘 3개.
const CORNER_ICONS: Record<MartCornerId, CornerIcon[]> = {
  grocery: [
    {
      origin: [61, 224],
      paths: [
        { d: 'M101 252.399C94.0401 246.599 80.1201 248.919 80.1201 265.159C80.1201 277.919 89.4001 288.359 96.3601 288.359C98.6801 288.359 99.8401 287.199 101 287.199C102.16 287.199 103.32 288.359 105.64 288.359C112.6 288.359 121.88 277.919 121.88 265.159C121.88 248.919 107.96 246.599 101 252.399Z', fill: '#FF2D2D', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M101 252.401C101 247.761 102.16 244.281 104.48 240.801', stroke: '#8B4A1C', strokeWidth: 5, strokeLinecap: 'round' },
        { d: 'M104.48 245.44C109.12 240.8 114.92 241.96 116.08 243.12C113.76 247.76 107.96 248.92 104.48 245.44Z', fill: '#1E9E45' },
      ],
    },
    {
      origin: [155, 224],
      paths: [
        { d: 'M207.18 254.721H182.82C181.859 254.721 181.08 255.5 181.08 256.461V287.781C181.08 288.742 181.859 289.521 182.82 289.521H207.18C208.141 289.521 208.92 288.742 208.92 287.781V256.461C208.92 255.5 208.141 254.721 207.18 254.721Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M181.08 254.719L195 243.119L208.92 254.719H181.08Z', fill: '#2D9CFF', stroke: '#1B3A6B', strokeWidth: 4, strokeLinejoin: 'round' },
        { d: 'M195 278.5C199.164 278.5 202.54 275.124 202.54 270.96C202.54 266.796 199.164 263.42 195 263.42C190.836 263.42 187.46 266.796 187.46 270.96C187.46 275.124 190.836 278.5 195 278.5Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 3 },
        { d: 'M189.78 266.9C191.327 264.58 192.874 264.58 194.42 266.9C192.874 268.06 191.327 268.06 189.78 266.9Z', fill: '#1B3A6B' },
        { d: 'M195 277.919C197.563 277.919 199.64 276.621 199.64 275.019C199.64 273.418 197.563 272.119 195 272.119C192.438 272.119 190.36 273.418 190.36 275.019C190.36 276.621 192.438 277.919 195 277.919Z', fill: '#FFB3C1', stroke: '#1B3A6B', strokeWidth: 2 },
      ],
    },
    {
      origin: [249, 224],
      paths: [
        { d: 'M268.12 267.48C268.12 255.88 277.4 248.92 289 248.92C300.6 248.92 309.88 255.88 309.88 267.48V282.56H268.12V267.48Z', fill: '#E8A04E', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M279.72 258.201L283.2 264.001M289 255.881L290.16 262.841M298.28 258.201L295.96 264.001', stroke: '#8B4A1C', strokeWidth: 4, strokeLinecap: 'round' },
      ],
    },
  ],
  household: [
    {
      origin: [61, 408],
      paths: [
        { d: 'M112.6 442.199H89.4003C84.9157 442.199 81.2803 445.835 81.2803 450.319V457.279C81.2803 461.764 84.9157 465.399 89.4003 465.399H112.6C117.085 465.399 120.72 461.764 120.72 457.279V450.319C120.72 445.835 117.085 442.199 112.6 442.199Z', fill: '#FF9CC5', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M92.8802 440.46C95.7631 440.46 98.1002 438.122 98.1002 435.24C98.1002 432.357 95.7631 430.02 92.8802 430.02C89.9972 430.02 87.6602 432.357 87.6602 435.24C87.6602 438.122 89.9972 440.46 92.8802 440.46Z', fill: 'white', stroke: '#2D9CFF', strokeWidth: 3 },
        { d: 'M105.64 435.239C107.562 435.239 109.12 433.681 109.12 431.759C109.12 429.837 107.562 428.279 105.64 428.279C103.718 428.279 102.16 429.837 102.16 431.759C102.16 433.681 103.718 435.239 105.64 435.239Z', fill: 'white', stroke: '#2D9CFF', strokeWidth: 3 },
        { d: 'M113.76 439.88C115.042 439.88 116.08 438.842 116.08 437.56C116.08 436.279 115.042 435.24 113.76 435.24C112.479 435.24 111.44 436.279 111.44 437.56C111.44 438.842 112.479 439.88 113.76 439.88Z', fill: 'white', stroke: '#2D9CFF', strokeWidth: 3 },
      ],
    },
    {
      origin: [155, 408],
      paths: [
        { d: 'M212.4 444.52H177.6C175.678 444.52 174.12 446.078 174.12 448V466.56C174.12 468.481 175.678 470.04 177.6 470.04H212.4C214.322 470.04 215.88 468.481 215.88 466.56V448C215.88 446.078 214.322 444.52 212.4 444.52Z', fill: '#2D9CFF', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M188.04 444.519C188.04 435.239 191.52 429.439 195 427.119C198.48 429.439 201.96 435.239 201.96 444.519H188.04Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 3.5, strokeLinejoin: 'round' },
      ],
    },
    {
      origin: [249, 408],
      paths: [
        { d: 'M293.871 439.37L271.656 458.011C270.184 459.247 269.992 461.442 271.227 462.914C272.463 464.386 274.658 464.578 276.13 463.343L298.345 444.702C299.817 443.467 300.009 441.272 298.774 439.799C297.539 438.327 295.344 438.135 293.871 439.37Z', fill: '#4CD964', stroke: '#1B3A6B', strokeWidth: 3.5 },
        { d: 'M302.599 429.018L295.49 434.983C294.754 435.601 294.658 436.698 295.276 437.434L299.004 441.878C299.622 442.614 300.719 442.71 301.455 442.092L308.564 436.127C309.3 435.509 309.396 434.412 308.779 433.676L305.05 429.233C304.433 428.496 303.335 428.4 302.599 429.018Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 3.5 },
        { d: 'M295.935 434.611L292.952 431.057M298.601 432.374L295.618 428.82M301.266 430.137L298.284 426.583', stroke: '#2D9CFF', strokeWidth: 4, strokeLinecap: 'round' },
      ],
    },
  ],
  electronics: [
    {
      origin: [61, 592],
      paths: [
        { d: 'M101 654.039C112.532 654.039 121.88 644.691 121.88 633.159C121.88 621.628 112.532 612.279 101 612.279C89.4684 612.279 80.1201 621.628 80.1201 633.159C80.1201 644.691 89.4684 654.039 101 654.039Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 5 },
        { d: 'M101 620.4V633.16L109.12 638.96', stroke: '#1B3A6B', strokeWidth: 5, strokeLinecap: 'round' },
        { d: 'M87.0803 611.119L81.2803 616.919M114.92 611.119L120.72 616.919', stroke: '#1B3A6B', strokeWidth: 6, strokeLinecap: 'round' },
      ],
    },
    {
      origin: [155, 592],
      paths: [
        { d: 'M183.4 620.401L206.6 609.961', stroke: '#1B3A6B', strokeWidth: 4, strokeLinecap: 'round' },
        { d: 'M212.4 620.4H177.6C174.397 620.4 171.8 622.997 171.8 626.2V645.92C171.8 649.124 174.397 651.72 177.6 651.72H212.4C215.603 651.72 218.2 649.124 218.2 645.92V626.2C218.2 622.997 215.603 620.4 212.4 620.4Z', fill: '#8C5CFF', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M185.72 644.179C190.204 644.179 193.84 640.544 193.84 636.059C193.84 631.575 190.204 627.939 185.72 627.939C181.235 627.939 177.6 631.575 177.6 636.059C177.6 640.544 181.235 644.179 185.72 644.179Z', fill: 'white', stroke: '#1B3A6B', strokeWidth: 3 },
        { d: 'M185.72 638.96C187.322 638.96 188.62 637.662 188.62 636.06C188.62 634.459 187.322 633.16 185.72 633.16C184.119 633.16 182.82 634.459 182.82 636.06C182.82 637.662 184.119 638.96 185.72 638.96Z', fill: '#1B3A6B' },
        { d: 'M211.24 628.52H199.64C199 628.52 198.48 629.039 198.48 629.68V633.16C198.48 633.8 199 634.32 199.64 634.32H211.24C211.881 634.32 212.4 633.8 212.4 633.16V629.68C212.4 629.039 211.881 628.52 211.24 628.52Z', fill: '#FFD600', stroke: '#1B3A6B', strokeWidth: 2.5 },
      ],
    },
    {
      origin: [249, 592],
      paths: [
        { d: 'M306.4 621.561H271.6C268.397 621.561 265.8 624.157 265.8 627.361V647.081C265.8 650.284 268.397 652.881 271.6 652.881H306.4C309.603 652.881 312.2 650.284 312.2 647.081V627.361C312.2 624.157 309.603 621.561 306.4 621.561Z', fill: '#4A4A68', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M293.06 615.76H281.46C280.499 615.76 279.72 616.539 279.72 617.5V620.98C279.72 621.941 280.499 622.72 281.46 622.72H293.06C294.021 622.72 294.8 621.941 294.8 620.98V617.5C294.8 616.539 294.021 615.76 293.06 615.76Z', fill: '#4A4A68', stroke: '#1B3A6B', strokeWidth: 4 },
        { d: 'M289 647.659C294.765 647.659 299.44 642.985 299.44 637.219C299.44 631.453 294.765 626.779 289 626.779C283.234 626.779 278.56 631.453 278.56 637.219C278.56 642.985 283.234 647.659 289 647.659Z', fill: '#9ED8FF', stroke: 'white', strokeWidth: 5 },
        { d: 'M302.92 629.679C304.201 629.679 305.24 628.64 305.24 627.359C305.24 626.078 304.201 625.039 302.92 625.039C301.638 625.039 300.6 626.078 300.6 627.359C300.6 628.64 301.638 629.679 302.92 629.679Z', fill: '#FF2D2D' },
      ],
    },
  ],
};

function CornerIconBadge({ icon, size = 80 }: { icon: CornerIcon; size?: number }) {
  const [ox, oy] = icon.origin;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'white',
        shadowColor: '#D94712',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Svg width={size} height={size} viewBox={`${ox} ${oy} 80 80`}>
        {icon.paths.map((p, i) => (
          <Path
            key={i}
            d={p.d}
            fill={p.fill ?? 'none'}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap={p.strokeLinecap}
            strokeLinejoin={p.strokeLinejoin}
          />
        ))}
      </Svg>
    </View>
  );
}

interface OceanCornerCardProps {
  cornerId: MartCornerId;
  title: string;
  /** 'full'은 지도 화면의 진행도 바 + 자물쇠까지 포함하는 큰 카드, 'compact'는 코너 클리어 화면의 작은 복기용 카드. */
  variant: 'full' | 'compact';
  status?: 'locked' | 'unlocked' | 'completed';
  /** 0~1. variant='full'일 때만 쓴다. */
  progress?: number;
  onPress?: () => void;
  iconSize?: number;
}

export function OceanCornerCard({ cornerId, title, variant, status = 'unlocked', progress = 0, onPress, iconSize }: OceanCornerCardProps) {
  const [from, to] = CARD_GRADIENTS[cornerId];
  const icons = CORNER_ICONS[cornerId];
  const locked = status === 'locked';
  const gradientId = `ocean-corner-${cornerId}-${variant}`;
  const height = variant === 'full' ? 168 : 98;
  const badgeSize = iconSize ?? (variant === 'full' ? 80 : 56);

  return (
    <Pressable onPress={onPress} disabled={locked || !onPress} style={{ width: '100%' }}>
      <View
        style={{
          borderRadius: 30,
          overflow: 'hidden',
          height,
          shadowColor: '#352EB4',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={from} />
              <Stop offset="1" stopColor={to} />
            </LinearGradient>
          </Defs>
          <Path d="M0 0H100V100H0V0Z" fill={`url(#${gradientId})`} />
        </Svg>
        <View style={{ borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 30, flex: 1, padding: variant === 'full' ? 16 : 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            {icons.map((icon, i) => (
              <CornerIconBadge key={i} icon={icon} size={badgeSize} />
            ))}
          </View>
          {variant === 'full' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 8 }}>
              <View
                style={{
                  flex: 1,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderWidth: 1,
                  borderColor: 'white',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                    height: '100%',
                    borderRadius: 9,
                    backgroundColor: '#5CCB4E',
                  }}
                />
              </View>
              <OceanBigStar size={28} />
            </View>
          ) : null}
          <Text
            style={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'white',
              fontWeight: '800',
              fontSize: variant === 'full' ? 15 : 13,
              textShadowColor: 'rgba(0,0,0,0.25)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {locked ? '???' : title}
          </Text>
        </View>
        {locked ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(30,91,184,0.35)',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OceanLockBadge size={variant === 'full' ? 75 : 46} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
