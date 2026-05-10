import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import type { TypographyVariant } from '@core/design-system/tokens/typography';

export type TextTone = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'info';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
}

function toneToColor(colors: ReturnType<typeof useTheme>['colors'], tone: TextTone): string {
  switch (tone) {
    case 'primary':   return colors.text.primary;
    case 'secondary': return colors.text.secondary;
    case 'muted':     return colors.text.muted;
    case 'success':   return colors.accent.success;
    case 'warning':   return colors.accent.warning;
    case 'danger':    return colors.accent.danger;
    case 'info':      return colors.accent.info;
  }
}

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  return (
    <RNText
      style={[
        { color: toneToColor(colors, tone), ...typography[variant] },
        style,
      ]}
      {...rest}
    />
  );
}
