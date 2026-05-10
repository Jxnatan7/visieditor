import React from 'react';
import { View } from 'react-native';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';
import { useRepoCardContext } from './context';
import { formatDistanceToNow } from 'date-fns';

export function RepoCardMeta() {
  const { repo } = useRepoCardContext();
  const { spacing } = useTheme();

  const pushedAgo = repo.pushedAt
    ? formatDistanceToNow(new Date(repo.pushedAt), { addSuffix: true })
    : null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
      {repo.language ? (
        <Text variant="caption" tone="muted">{repo.language}</Text>
      ) : null}
      {pushedAgo ? (
        <Text variant="caption" tone="muted">Pushed {pushedAgo}</Text>
      ) : null}
      <Text variant="caption" tone="muted">★ {repo.stargazersCount}</Text>
    </View>
  );
}
