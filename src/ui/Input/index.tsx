import React, { forwardRef } from 'react';
import { TextInput, type TextInputProps, View, StyleSheet } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '../Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, style, rightElement, ...rest },
  ref,
) {
  const { colors, typography, spacing, radii } = useTheme();

  return (
    <View>
      {label ? (
        <Text variant="caption" tone="secondary" style={{ marginBottom: spacing[1] }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.bg.input,
          borderRadius: radii.sm,
          borderWidth: 1,
          borderColor: error ? colors.accent.danger : colors.border.subtle,
          paddingHorizontal: spacing[3],
          height: 44,
        }}
      >
        <TextInput
          ref={ref}
          style={[
            {
              flex: 1,
              color: colors.text.primary,
              ...typography.body,
            },
            style,
          ]}
          placeholderTextColor={colors.text.muted}
          {...rest}
        />
        {rightElement}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" style={{ marginTop: spacing[1] }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});
