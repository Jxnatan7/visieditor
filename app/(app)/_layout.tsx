import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@features/auth/stores/auth-store';
import { secureStore } from '@core/storage/secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    secureStore.get('github_token').then((token) => {
      setHasToken(!!token);
      setTokenChecked(true);
    });
  }, []);

  if (!tokenChecked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#282A36' }}>
        <ActivityIndicator color="#BD93F9" />
      </View>
    );
  }

  if (!hasToken && !user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="workspace/[owner]/[repo]/index" />
      <Stack.Screen name="settings/index" />
    </Stack>
  );
}
