import React from 'react';
import { Text } from '@ui/Text';
import { useApiKeyCardContext } from './context';
import type { TextTone } from '@ui/Text';

export function ApiKeyCardStatus() {
  const { testStatus, testError } = useApiKeyCardContext();

  if (testStatus === 'idle') return null;

  const map: Record<string, { text: string; tone: TextTone }> = {
    testing: { text: 'Testing connection...', tone: 'muted' },
    ok: { text: '✓ API key is valid', tone: 'success' },
    error: { text: `✗ ${testError ?? 'Invalid key'}`, tone: 'danger' },
  };

  const status = map[testStatus];
  if (!status) return null;

  return <Text variant="caption" tone={status.tone}>{status.text}</Text>;
}
