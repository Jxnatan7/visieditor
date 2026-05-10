import React from 'react';
import {
  Pressable as RNPressable,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';

interface Props extends PressableProps {
  style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle);
  hitSlop?: number;
}

export function Pressable({ children, style, hitSlop = 8, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <RNPressable
      hitSlop={hitSlop}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      accessibilityRole="button"
      {...rest}
    >
      {children}
    </RNPressable>
  );
}
