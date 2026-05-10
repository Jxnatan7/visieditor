import React from 'react';
import { View } from 'react-native';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';
import { useAISheetContext } from './context';
import { getBasename } from '../../../workspace/lib/path-utils';

export function AISheetHeader() {
  const { filePath, provider } = useAISheetContext();
  const { colors, spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.border.subtle }}>
      <View style={{ flex: 1 }}>
        <Text variant="title">✦ AI Assistant</Text>
        {filePath ? (
          <Text variant="caption" tone="muted">{getBasename(filePath)}</Text>
        ) : null}
      </View>
      {provider ? (
        <Text variant="micro" tone="primary" style={{ fontFamily: 'Inter-SemiBold' }}>
          {provider.id.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}
