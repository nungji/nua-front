import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/** 제목 pill 옆의 작은 반짝이 별 (타이틀 pill, 진행도 pill 공통 장식). */
export function OceanSparkleStar({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="88 65 22 21">
      <Path
        d="M98.9997 65.9199L101.64 72.8799L109.32 73.3599L103.32 77.9199L105.48 85.5999L98.9997 81.2799L92.5197 85.5999L94.6797 77.9199L88.6797 73.3599L96.3597 72.8799L98.9997 65.9199Z"
        fill="#FF8A3D"
        stroke="#FF8A3D"
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <Circle cx={99} cy={71.68} r={0.96} fill="#FFC7A0" />
      <Circle cx={99} cy={76} r={1.2} fill="#FFC7A0" />
      <Circle cx={95.64} cy={75.52} r={0.84} fill="#FFC7A0" />
      <Circle cx={102.36} cy={75.52} r={0.84} fill="#FFC7A0" />
    </Svg>
  );
}

/** 코너 카드 진행도 바 옆, 성과 화면(정답/코너 클리어)의 큰 별 — 같은 모양을 크기만 바꿔 재사용한다. */
export function OceanBigStar({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="98 161 46 45">
      <Path
        d="M121 161.6L126.6 177.28L143.4 178.4L129.96 188.48L135 205.28L121 195.2L107 205.28L112.04 188.48L98.5996 178.4L115.4 177.28L121 161.6Z"
        fill="#FF8A3D"
        stroke="#FF8A3D"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={121} cy={172.8} r={1.96} fill="#FFC7A0" />
      <Circle cx={121} cy={180.64} r={1.96} fill="#FFC7A0" />
      <Circle cx={112.04} cy={182.88} r={1.68} fill="#FFC7A0" />
      <Circle cx={129.96} cy={182.88} r={1.68} fill="#FFC7A0" />
      <Circle cx={115.4} cy={192.96} r={1.68} fill="#FFC7A0" />
      <Circle cx={126.6} cy={192.96} r={1.68} fill="#FFC7A0" />
      <Circle cx={121} cy={187.36} r={2.24} fill="#FFC7A0" />
    </Svg>
  );
}

interface OceanTitlePillProps {
  title: string;
}

/** 지도·코너 화면 상단 중앙의 흰 pill 타이틀 (별 아이콘 + 글자). */
export function OceanTitlePill({ title }: OceanTitlePillProps) {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 12,
        height: 43,
        borderRadius: 21.5,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 3,
        borderColor: '#BFE3FF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 8,
      }}
    >
      <OceanSparkleStar size={20} />
      <Text numberOfLines={1} style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#1B3A6B' }}>
        {title}
      </Text>
    </View>
  );
}

/** 스테이지 화면들(단어 만나기 ~ 정답) 상단의 6칸 진행도 pill. stepIndex는 0부터 시작, 0~5. */
export function OceanProgressPill({ stepIndex, stepCount = 6 }: { stepIndex: number; stepCount?: number }) {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 12,
        height: 43,
        borderRadius: 21.5,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 3,
        borderColor: '#BFE3FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        gap: 8,
      }}
    >
      {Array.from({ length: stepCount }, (_, i) => (
        <View
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: 'white',
            backgroundColor: i <= stepIndex ? '#2D8CF0' : '#D6E9FB',
          }}
        />
      ))}
      <View style={{ width: 2, height: 22, backgroundColor: '#BFE3FF' }} />
      <OceanSparkleStar size={20} />
    </View>
  );
}

/** 잠긴 코너 카드 위에 뜨는 자물쇠 배지. */
export function OceanLockBadge({ size = 75 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderWidth: 3,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size * 0.53} height={size * 0.53} viewBox="185 455 20 25">
        <Path
          d="M201.375 465.584H188.625C186.669 465.584 185.083 467.17 185.083 469.126V476.209C185.083 478.165 186.669 479.751 188.625 479.751H201.375C203.331 479.751 204.916 478.165 204.916 476.209V469.126C204.916 467.17 203.331 465.584 201.375 465.584Z"
          fill="white"
        />
        <Path
          d="M189.333 465.583V461.333C189.333 459.83 189.93 458.388 190.993 457.326C192.055 456.263 193.497 455.666 195 455.666C196.503 455.666 197.944 456.263 199.007 457.326C200.069 458.388 200.666 459.83 200.666 461.333V465.583"
          stroke="white"
          strokeWidth={2.6}
          fill="none"
        />
        <Circle cx={195} cy={472.67} r={2.27} fill="#7A6FA8" />
      </Svg>
    </View>
  );
}
