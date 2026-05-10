import React from 'react';
import { View } from 'react-native';
import { Button } from '@ui/Button';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';
import { useAuthFlow } from '../hooks/use-auth-flow';

export function GithubSignInButton() {
  const { signIn, loading, error } = useAuthFlow();
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing[2] }}>
      <Button
        label={loading ? 'Signing in...' : 'Sign in with GitHub'}
        onPress={signIn}
        loading={loading}
        variant="primary"
        fullWidth
      />
      {error ? (
        <Text variant="caption" tone="danger" style={{ textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
