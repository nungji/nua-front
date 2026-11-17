import { View } from 'react-native';
import { useStageRouter } from '@/hooks/useStageRouter';
import { OceanBackButton, OceanBookButton } from './OceanCircleButton';
import { OceanTitlePill } from './OceanDecor';

interface OceanTopBarProps {
  title?: string;
  onBack?: () => void;
  /** 단어장 바로가기 버튼을 보여줄지. map.tsx/[corner].tsx/corner-clear.tsx 모두 단어장으로 보낸다. */
  onPressWordbook?: () => void;
}

/** 바다 테마로 재단장한 마트 화면 전체가 공통으로 쓰는 상단바. */
export function OceanTopBar({ title, onBack, onPressWordbook }: OceanTopBarProps) {
  const { back } = useStageRouter();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 10, height: 66 }}>
      <OceanBackButton onPress={onBack ?? back} />
      {title ? <OceanTitlePill title={title} /> : <View style={{ flex: 1 }} />}
      {onPressWordbook ? (
        <OceanBookButton onPress={onPressWordbook} />
      ) : (
        <View style={{ width: 46, height: 46 }} />
      )}
    </View>
  );
}
