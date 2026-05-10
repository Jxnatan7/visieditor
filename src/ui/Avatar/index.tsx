import React from 'react';
import { Image, View, Text } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';

interface AvatarProps {
  uri?: string | null | undefined;
  name?: string | null | undefined;
  size?: number;
}

export function Avatar({ uri, name, size = 36 }: AvatarProps) {
  const { colors, radii } = useTheme();
  const initials = name ? name.slice(0, 2).toUpperCase() : '?';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.bg.elevated,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text style={{ color: colors.text.primary, fontSize: size * 0.35, fontFamily: 'Inter-SemiBold' }}>
          {initials}
        </Text>
      )}
    </View>
  );
}
