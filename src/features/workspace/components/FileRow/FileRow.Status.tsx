import React from 'react';
import { Text } from '@ui/Text';
import type { TextTone } from '@ui/Text';
import { useFileRowContext } from './context';
import type { GitStatus } from '@core/types/github';

const STATUS_LABELS: Record<GitStatus, string> = {
  modified: 'M',
  added: 'A',
  deleted: 'D',
  renamed: 'R',
  conflict: '!',
  untracked: '?',
};

const STATUS_TONES: Record<GitStatus, TextTone> = {
  modified: 'warning',
  added: 'success',
  deleted: 'danger',
  renamed: 'info',
  conflict: 'danger',
  untracked: 'muted',
};

export function FileRowStatus() {
  const { status } = useFileRowContext();
  if (!status) return null;

  return (
    <Text variant="micro" tone={STATUS_TONES[status]} style={{ marginLeft: 4, fontFamily: 'Inter-SemiBold' }}>
      {STATUS_LABELS[status]}
    </Text>
  );
}
