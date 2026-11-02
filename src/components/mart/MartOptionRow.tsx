import { Pressable, Text } from 'react-native';

interface MartOptionRowProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function MartOptionRow({ label, selected, onPress }: MartOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[56px] rounded-2xl px-4 flex-row items-center justify-center border-2 ${
        selected ? 'bg-orange-100 border-orange-400' : 'bg-white border-gray-200'
      }`}
    >
      <Text className="text-base font-semibold">{label}</Text>
    </Pressable>
  );
}
