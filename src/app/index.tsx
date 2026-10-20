import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Text className="text-3xl font-bold text-gray-900">nua</Text>
        <Text className="mb-6 text-sm text-gray-500">미니게임을 골라 보자</Text>
        <Pressable
          onPress={() => router.push('/repairman')}
          className="w-full items-center rounded-2xl bg-orange-500 py-4"
        >
          <Text className="text-lg font-bold text-white">수리공</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
