import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '../Text';
import { Button } from '../Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[8] }}>
      <Text variant="title" style={{ textAlign: 'center', marginBottom: spacing[2] }}>{title}</Text>
      {description ? (
        <Text variant="body" tone="muted" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
          {description}
        </Text>
      ) : null}
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}
