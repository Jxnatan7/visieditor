import React from 'react';
import { Text } from 'react-native';
import { useFileRowContext } from './context';
import { fileIconFor } from '../../lib/file-icons';

export function FileRowIcon() {
  const { file } = useFileRowContext();
  const icon = fileIconFor(file);
  return <Text style={{ fontSize: 16, marginRight: 8 }}>{icon}</Text>;
}
