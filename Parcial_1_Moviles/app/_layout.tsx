import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="(public)/index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(protected)" />
    </Stack>

  );
}
