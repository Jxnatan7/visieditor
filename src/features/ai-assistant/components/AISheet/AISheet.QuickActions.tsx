import React from 'react';
import { ScrollView } from 'react-native';
import { Pressable } from '@ui/Pressable';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';
import { useAISheetContext } from './context';

const QUICK_ACTIONS = [
  { label: 'Explain code', prompt: 'Explain what this code does in simple terms.' },
  { label: 'Add types', prompt: 'Add TypeScript types to this code.' },
  { label: 'Refactor', prompt: 'Refactor this code for better readability and maintainability.' },
  { label: 'Write tests', prompt: 'Write unit tests for this code.' },
  { label: 'Fix bugs', prompt: 'Identify and fix any bugs in this code.' },
  { label: 'Add docs', prompt: 'Add JSDoc documentation comments to this code.' },
];

interface AISheetQuickActionsProps {
  onSelect: (prompt: string) => void;
}

export function AISheetQuickActions({ onSelect }: AISheetQuickActionsProps) {
  const { colors, spacing, radii } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: spacing[3], gap: spacing[2] }}>
      {QUICK_ACTIONS.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => onSelect(action.prompt)}
          style={{
            backgroundColor: colors.bg.input,
            borderRadius: radii.pill,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            borderWidth: 1,
            borderColor: colors.border.subtle,
          }}
        >
          <Text variant="caption">{action.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
