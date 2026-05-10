import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Pressable } from '../Pressable';
import { Text } from '../Text';
import { useTheme } from '@core/design-system/theme-provider';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, radii, spacing } = useTheme();

  const bgColors: Record<ButtonVariant, string> = {
    primary: colors.accent.primary,
    secondary: colors.bg.elevated,
    ghost: 'transparent',
    danger: colors.accent.danger,
  };

  const heights: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      style={{
        backgroundColor: bgColors[variant],
        borderRadius: radii.md,
        height: heights[size],
        paddingHorizontal: spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        opacity: disabled ? 0.5 : 1,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: colors.border.subtle,
      }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.text.primary} size="small" />
      ) : (
        <Text
          variant="caption"
          style={{ color: variant === 'primary' || variant === 'danger' ? '#fff' : colors.text.primary, fontFamily: 'Inter-SemiBold' }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
