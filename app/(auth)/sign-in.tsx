import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { GithubSignInButton } from '@features/auth/components/GithubSignInButton';

export default function SignInScreen() {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <View style={{ flex: 1, padding: spacing[8], justifyContent: 'center' }}>
        <Text variant="display" style={{ marginBottom: spacing[2] }}>VisiEditor</Text>
        <Text variant="body" tone="secondary" style={{ marginBottom: spacing[12] }}>
          Sign in with GitHub to access your repositories.
        </Text>
        <GithubSignInButton />
        <Text variant="caption" tone="muted" style={{ textAlign: 'center', marginTop: spacing[6] }}>
          Only repo + read:user permissions are requested.
        </Text>
      </View>
    </SafeAreaView>
  );
}
