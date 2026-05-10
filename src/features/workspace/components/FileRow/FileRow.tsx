import React, { useMemo, type PropsWithChildren } from 'react';
import { Pressable } from '@ui/Pressable';
import { FileRowContext } from './context';
import type { TreeNode, GitStatus } from '@core/types/github';

interface FileRowProps extends PropsWithChildren {
  file: TreeNode;
  status?: GitStatus | null;
  isExpanded: boolean;
  isSelected?: boolean;
  onToggleExpand: () => void;
  onLongPress?: () => void;
}

export function FileRow({
  children,
  file,
  status = null,
  isExpanded,
  isSelected = false,
  onToggleExpand,
  onLongPress = () => undefined,
}: FileRowProps) {
  const value = useMemo(
    () => ({ file, status, isExpanded, isSelected, onToggleExpand, onLongPress }),
    [file, status, isExpanded, isSelected, onToggleExpand, onLongPress],
  );

  return (
    <FileRowContext.Provider value={value}>
      <Pressable
        onPress={onToggleExpand}
        onLongPress={onLongPress}
        accessibilityLabel={file.path}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    </FileRowContext.Provider>
  );
}
