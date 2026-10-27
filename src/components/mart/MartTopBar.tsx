import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MartIcon, type MartIconName } from './MartIcon';

interface MartTopBarProps {
  title: string;
  onBack?: () => void;
  rightIcon?: MartIconName;
  onPressRight?: () => void;
}

export function MartTopBar({ title, onBack, rightIcon, onPressRight }: MartTopBarProps) {
  const router = useRouter();

  return (
    <View className="h-[60px] flex-row items-center justify-between px-4 bg-amber-100">
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={8} accessibilityLabel="뒤로가기">
        <MartIcon name="back" />
      </Pressable>
      <Text className="text-base font-bold">{title}</Text>
      {rightIcon ? (
        <Pressable onPress={onPressRight} hitSlop={8} accessibilityLabel={rightIcon}>
          <MartIcon name={rightIcon} />
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}
