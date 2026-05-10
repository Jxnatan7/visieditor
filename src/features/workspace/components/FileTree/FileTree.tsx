import React, { useCallback } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { Skeleton } from '@ui/Skeleton';
import { FileRow } from '../FileRow';
import { useWorkspaceStore } from '../../stores/workspace-store';
import type { TreeNode } from '@core/types/github';

interface FileTreeProps {
  nodes: TreeNode[];
  isLoading: boolean;
  onFilePress?: (node: TreeNode) => void;
}

const ITEM_HEIGHT = 64;

export function FileTree({ nodes, isLoading, onFilePress }: FileTreeProps) {
  const { colors, spacing } = useTheme();
  const expandedPath = useWorkspaceStore((s) => s.expandedPath);
  const expand = useWorkspaceStore((s) => s.expand);
  const toggleSelect = useWorkspaceStore((s) => s.toggleSelect);
  const selectedPaths = useWorkspaceStore((s) => s.selectedPaths);

  const handleToggle = useCallback((node: TreeNode) => {
    if (node.type === 'blob') {
      const newPath = expandedPath === node.path ? null : node.path;
      expand(newPath);
      if (newPath) onFilePress?.(node);
    }
  }, [expandedPath, expand, onFilePress]);

  const renderItem = useCallback(({ item }: { item: TreeNode }) => {
    const depth = item.path.split('/').length - 1;
    const isExpanded = expandedPath === item.path;
    const isSelected = selectedPaths.has(item.path);

    return (
      <View style={{ paddingLeft: depth * 16, backgroundColor: isSelected ? colors.accent.primary + '22' : 'transparent' }}>
        <FileRow
          file={item}
          isExpanded={isExpanded}
          isSelected={isSelected}
          onToggleExpand={() => handleToggle(item)}
          onLongPress={() => toggleSelect(item.path)}
          status={null}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', height: ITEM_HEIGHT, paddingHorizontal: spacing[4] }}>
            <FileRow.Icon />
            <FileRow.Name />
            <FileRow.Status />
            {item.type === 'blob' ? <FileRow.Meta /> : null}
          </View>
        </FileRow>
      </View>
    );
  }, [expandedPath, selectedPaths, colors, spacing, handleToggle, toggleSelect]);

  if (isLoading) {
    return (
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Skeleton width={24} height={24} borderRadius={4} />
            <Skeleton height={14} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlashList
      data={nodes}
      renderItem={renderItem}
      estimatedItemSize={ITEM_HEIGHT}
      keyExtractor={(item) => item.path}
      contentContainerStyle={{ paddingBottom: spacing[16] }}
    />
  );
}
