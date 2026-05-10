import React from 'react';
import { View } from 'react-native';
import { Text } from '@ui/Text';
import { Badge } from '@ui/Badge';
import { useTheme } from '@core/design-system/theme-provider';
import { useRepoCardContext } from './context';

export function RepoCardHeader() {
  const { repo } = useRepoCardContext();
  const { spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] }}>
      <View style={{ flex: 1 }}>
        <Text variant="caption" tone="muted">{repo.owner}</Text>
        <Text variant="body" style={{ fontFamily: 'Inter-SemiBold' }}>{repo.name}</Text>
      </View>
      {repo.private ? <Badge label="Private" tone="warning" /> : null}
    </View>
  );
}
