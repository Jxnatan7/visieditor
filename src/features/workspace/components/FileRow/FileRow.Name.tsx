import React from 'react';
import { Text } from '@ui/Text';
import { useFileRowContext } from './context';
import { getBasename } from '../../lib/path-utils';

export function FileRowName() {
  const { file, isExpanded } = useFileRowContext();
  const name = getBasename(file.path);

  return (
    <Text
      variant="body"
      numberOfLines={1}
      style={{ flex: 1, fontFamily: isExpanded ? 'Inter-SemiBold' : 'Inter-Regular' }}
    >
      {name}
    </Text>
  );
}
