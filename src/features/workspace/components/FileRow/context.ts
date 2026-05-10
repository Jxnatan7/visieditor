import { createContext, useContext } from 'react';
import type { TreeNode, GitStatus } from '@core/types/github';

interface FileRowContextValue {
  file: TreeNode;
  status: GitStatus | null;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onLongPress: () => void;
}

export const FileRowContext = createContext<FileRowContextValue | null>(null);

export const useFileRowContext = () => {
  const ctx = useContext(FileRowContext);
  if (!ctx) throw new Error('FileRow.* must be used inside <FileRow>');
  return ctx;
};
