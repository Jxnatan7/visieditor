import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { Pressable } from '@ui/Pressable';
import { Avatar } from '@ui/Avatar';
import { Button } from '@ui/Button';
import { ApiKeyCard } from '@features/settings/components/ApiKeyCard';
import { useAuthStore } from '@features/auth/stores/auth-store';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ marginBottom: spacing[6] }}>
      <Text variant="micro" tone="muted" style={{ paddingHorizontal: spacing[4], marginBottom: spacing[2], textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Text>
      <View style={{ gap: spacing[3], paddingHorizontal: spacing[4] }}>
        {children}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing[3] }}>
          <Text variant="body">← Back</Text>
        </Pressable>
        <Text variant="title">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing[12] }}>
        {user ? (
          <Section title="Account">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], backgroundColor: colors.bg.elevated, borderRadius: 12, padding: spacing[4], borderWidth: 1, borderColor: colors.border.subtle }}>
              <Avatar uri={user.avatarUrl} name={user.name ?? user.login} size={48} />
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ fontFamily: 'Inter-SemiBold' }}>{user.name ?? user.login}</Text>
                <Text variant="caption" tone="muted">@{user.login}</Text>
              </View>
              <Button label="Sign Out" onPress={handleLogout} variant="ghost" />
            </View>
          </Section>
        ) : null}

        <Section title="AI API Keys">
          <ApiKeyCard provider="anthropic">
            <Text variant="caption" style={{ fontFamily: 'Inter-SemiBold' }}>Anthropic (Claude)</Text>
            <ApiKeyCard.Input />
            <ApiKeyCard.TestButton />
            <ApiKeyCard.Status />
          </ApiKeyCard>

          <ApiKeyCard provider="google">
            <Text variant="caption" style={{ fontFamily: 'Inter-SemiBold' }}>Google (Gemini)</Text>
            <ApiKeyCard.Input />
            <ApiKeyCard.TestButton />
            <ApiKeyCard.Status />
          </ApiKeyCard>
        </Section>

        <Section title="Editor">
          <View style={{ backgroundColor: colors.bg.elevated, borderRadius: 12, padding: spacing[4], borderWidth: 1, borderColor: colors.border.subtle }}>
            <Text variant="caption" tone="muted">Editor preferences coming in next release.</Text>
          </View>
        </Section>

        <Section title="App">
          <View style={{ backgroundColor: colors.bg.elevated, borderRadius: 12, padding: spacing[4], borderWidth: 1, borderColor: colors.border.subtle }}>
            <Text variant="body">Version 1.0.0</Text>
            <Text variant="caption" tone="muted">VisiEditor — Code on the go</Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
