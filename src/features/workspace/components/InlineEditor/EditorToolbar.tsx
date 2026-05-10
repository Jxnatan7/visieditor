import React from 'react';
import { ScrollView, View } from 'react-native';
import { Pressable } from '@ui/Pressable';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';

interface ToolbarAction {
  label: string;
  onPress: () => void;
}

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onAI?: (() => void) | null;
  isDirty?: boolean;
}

export function EditorToolbar({ onUndo, onRedo, onSave, onAI, isDirty }: EditorToolbarProps) {
  const { colors, spacing, radii } = useTheme();

  const actions: ToolbarAction[] = [
    { label: '↩ Undo', onPress: onUndo },
    { label: '↪ Redo', onPress: onRedo },
    { label: isDirty ? '● Save' : '✓ Saved', onPress: onSave },
    ...(onAI != null ? [{ label: '✦ AI', onPress: onAI }] : []),
  ];

  return (
    <View style={{
      backgroundColor: colors.bg.elevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
      paddingHorizontal: spacing[2],
    }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[1], paddingVertical: spacing[2] }}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            style={{
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1],
              borderRadius: radii.sm,
              backgroundColor: colors.bg.input,
            }}
          >
            <Text variant="caption" style={{ fontFamily: 'Inter-Medium' }}>{action.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
