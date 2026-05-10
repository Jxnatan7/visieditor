import React, { useMemo, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { Pressable } from '@ui/Pressable';
import { useTheme } from '@core/design-system/theme-provider';
import { RepoCardContext } from './context';
import type { Repo } from '@core/types/github';

interface RepoCardProps extends PropsWithChildren {
  repo: Repo;
  onPress: () => void;
}

export function RepoCard({ repo, onPress, children }: RepoCardProps) {
  const { colors, spacing, radii, shadows } = useTheme();
  const value = useMemo(() => ({ repo, onPress }), [repo, onPress]);

  return (
    <RepoCardContext.Provider value={value}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Repository ${repo.name}`}
      >
        <View
          style={{
            backgroundColor: colors.bg.elevated,
            borderRadius: radii.md,
            padding: spacing[4],
            marginHorizontal: spacing[4],
            marginBottom: spacing[3],
            borderWidth: 1,
            borderColor: colors.border.subtle,
          }}
        >
          {children}
        </View>
      </Pressable>
    </RepoCardContext.Provider>
  );
}
