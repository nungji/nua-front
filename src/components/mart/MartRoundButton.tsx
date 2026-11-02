import { Pressable } from 'react-native';
import { MartIcon, type MartIconName } from './MartIcon';

type MartRoundButtonVariant = 'primary' | 'secondary' | 'small';

interface MartRoundButtonProps {
  variant: MartRoundButtonVariant;
  icon: MartIconName;
  onPress: () => void;
  disabled?: boolean;
}

const SIZE_BY_VARIANT: Record<MartRoundButtonVariant, number> = {
  primary: 72,
  secondary: 72,
  small: 44,
};

const BG_BY_VARIANT: Record<MartRoundButtonVariant, string> = {
  primary: 'bg-orange-400',
  secondary: 'bg-sky-300',
  small: 'bg-gray-200',
};

export function MartRoundButton({ variant, icon, onPress, disabled }: MartRoundButtonProps) {
  const size = SIZE_BY_VARIANT[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-full ${BG_BY_VARIANT[variant]} ${disabled ? 'opacity-40' : ''}`}
      style={{ width: size, height: size }}
    >
      <MartIcon name={icon} size={variant === 'small' ? 18 : 28} />
    </Pressable>
  );
}
