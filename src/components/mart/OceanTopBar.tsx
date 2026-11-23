import Svg, { Path } from 'react-native-svg';
import { GameCharacter } from '@/components/GameCharacter';
import { TopBar, TopBarButton } from '@/components/TopBar';
import { useStageRouter } from '@/hooks/useStageRouter';
import { COLORS } from '@/theme';

interface OceanTopBarProps {
  title?: string;
  onBack?: () => void;
  /** 단어장 바로가기 버튼을 보여줄지. map.tsx/[corner].tsx/corner-clear.tsx 모두 단어장으로 보낸다. */
  onPressWordbook?: () => void;
}

/** 마트 화면 전체가 공통으로 쓰는 상단바. 다른 게임과 같은 공용 TopBar 디자인을 쓴다. */
export function OceanTopBar({ title, onBack, onPressWordbook }: OceanTopBarProps) {
  const { back } = useStageRouter();

  return (
    <TopBar
      title={title ?? '마트'}
      onBack={onBack ?? back}
      leading={<GameCharacter game="mart" width={52} height={56} />}
      right={
        onPressWordbook ? (
          <TopBarButton onPress={onPressWordbook} label="단어장">
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M5 4.5C5 3.7 5.7 3 6.5 3H19v15H6.5C5.7 18 5 18.7 5 19.5V4.5Z"
                stroke={COLORS.ocean}
                strokeWidth={2.6}
                strokeLinejoin="round"
                fill="none"
              />
              <Path d="M5 19.5C5 20.3 5.7 21 6.5 21H19V18" stroke={COLORS.ocean} strokeWidth={2.6} strokeLinejoin="round" fill="none" />
            </Svg>
          </TopBarButton>
        ) : null
      }
    />
  );
}
