import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '../Text';
import type { TextTone } from '../Text';

interface BadgeProps {
  label: string;
  tone?: TextTone;
}

export function Badge({ label, tone = 'primary' }: BadgeProps) {
  const { colors, radii, spacing } = useTheme();

  const bgMap: Record<TextTone, string> = {
    primary: colors.accent.primary + '33',
    secondary: colors.bg.elevated,
    muted: colors.bg.elevated,
    success: colors.accent.success + '33',
    warning: colors.accent.warning + '33',
    danger: colors.accent.danger + '33',
    info: colors.accent.info + '33',
  };

  return (
    <View
      style={{
        backgroundColor: bgMap[tone],
        borderRadius: radii.pill,
        paddingHorizontal: spacing[2],
        paddingVertical: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="micro" tone={tone}>{label}</Text>
    </View>
  );
}
