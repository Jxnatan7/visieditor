import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { Input } from '@ui/Input';
import { Avatar } from '@ui/Avatar';
import { Pressable } from '@ui/Pressable';
import { RepoList } from '@features/dashboard/components/RepoList';
import { useAuthStore } from '@features/auth/stores/auth-store';
import type { RepoFilter } from '@core/types/github';

const TABS: Array<{ id: RepoFilter; label: string }> = [
  { id: 'recent', label: 'Recent' },
  { id: 'starred', label: 'Starred' },
  { id: 'all', label: 'All' },
];

export default function DashboardScreen() {
  const { colors, spacing } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [filter, setFilter] = useState<RepoFilter>('recent');
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
        <Text variant="title" style={{ flex: 1 }}>VisiEditor</Text>
        <Pressable onPress={() => router.push('/(app)/settings')}>
          <Avatar uri={user?.avatarUrl ?? null} name={user?.name ?? user?.login ?? null} size={36} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[3] }}>
        <Input
          placeholder="Search repositories..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: spacing[4], gap: spacing[2], marginBottom: spacing[2] }}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setFilter(tab.id)}
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
              borderRadius: 99,
              backgroundColor: filter === tab.id ? colors.accent.primary : colors.bg.elevated,
            }}
          >
            <Text variant="caption" style={{ color: filter === tab.id ? '#fff' : colors.text.secondary }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <RepoList filter={filter} searchQuery={search} />
    </SafeAreaView>
  );
}
