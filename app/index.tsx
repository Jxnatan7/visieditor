import { Redirect } from 'expo-router';
import { useAuthStore } from '@features/auth/stores/auth-store';
import { secureStore } from '@core/storage/secure-store';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    secureStore.get('github_token').then((token) => {
      if (token) setToken(token);
      setLoading(false);
    });
  }, []);

  if (!hydrated || loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#282A36' }}>
        <ActivityIndicator color="#BD93F9" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
