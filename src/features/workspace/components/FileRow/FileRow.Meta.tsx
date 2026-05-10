import React from 'react';
import { Text } from '@ui/Text';
import { useFileRowContext } from './context';

export function FileRowMeta() {
  const { file } = useFileRowContext();
  if (!file.size) return null;

  const kb = (file.size / 1024).toFixed(1);
  return (
    <Text variant="micro" tone="muted" style={{ marginLeft: 4 }}>
      {kb}KB
    </Text>
  );
}
