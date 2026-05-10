import React, { useCallback } from 'react';
import { View, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useTheme } from '@core/design-system/theme-provider';
import { Skeleton } from '@ui/Skeleton';
import { EmptyState } from '@ui/EmptyState';
import { Text } from '@ui/Text';
import { RepoCard } from './RepoCard';
import { useRepos, useInvalidateRepos } from '../api/use-repos';
import type { RepoFilter } from '@core/types/github';
import type { Repo } from '@core/types/github';

interface RepoListProps {
  filter: RepoFilter;
  searchQuery?: string;
}

export function RepoList({ filter, searchQuery }: RepoListProps) {
  const { data, isLoading, isError, error } = useRepos(filter);
  const invalidate = useInvalidateRepos();
  const { colors, spacing } = useTheme();

  const filtered = searchQuery
    ? (data ?? []).filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : (data ?? []);

  const renderItem = useCallback(({ item }: { item: Repo }) => (
    <RepoCard
      repo={item}
      onPress={() => router.push(`/(app)/workspace/${item.owner}/${item.name}`)}
    >
      <RepoCard.Header />
      {item.localChanges && item.localChanges > 0 ? <RepoCard.LocalChangesBadge /> : null}
      {item.description ? (
        <Text variant="caption" tone="secondary" numberOfLines={2} style={{ marginVertical: spacing[1] }}>
          {item.description}
        </Text>
      ) : null}
      <RepoCard.Meta />
    </RepoCard>
  ), [spacing]);

  if (isLoading) {
    return (
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ backgroundColor: colors.bg.elevated, borderRadius: 12, padding: spacing[4], gap: spacing[2] }}>
            <Skeleton height={14} width="60%" />
            <Skeleton height={12} width="40%" />
            <Skeleton height={12} width="80%" />
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load repositories"
        description={(error as Error)?.message}
        action={{ label: 'Retry', onPress: invalidate }}
      />
    );
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        title={searchQuery ? 'No results' : 'No repositories'}
        description={searchQuery ? 'Try a different search term.' : 'Create or fork a repo on GitHub to get started.'}
      />
    );
  }

  return (
    <FlashList
      data={filtered}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={invalidate}
          tintColor={colors.accent.primary}
        />
      }
      contentContainerStyle={{ paddingTop: spacing[2], paddingBottom: spacing[12] }}
    />
  );
}
