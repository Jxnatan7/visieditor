import React, { useMemo, useState, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useTheme } from '@core/design-system/theme-provider';
import { ApiKeyCardContext } from './context';
import { secureStore } from '@core/storage/secure-store';
import { createAnthropicProvider } from '@core/api/llm/anthropic';
import { createGoogleProvider } from '@core/api/llm/google';
import type { LLMProviderId } from '@core/types/llm';

type SecureStoreKey = 'anthropic_key' | 'google_key' | 'openrouter_key';

const PROVIDER_KEYS: Record<LLMProviderId, SecureStoreKey> = {
  anthropic: 'anthropic_key',
  google: 'google_key',
  openrouter: 'openrouter_key',
};

interface ApiKeyCardProps extends PropsWithChildren {
  provider: LLMProviderId;
  initialKey?: string;
}

export function ApiKeyCard({ provider, initialKey = '', children }: ApiKeyCardProps) {
  const { colors, spacing, radii } = useTheme();
  const [apiKey, setApiKeyState] = useState(initialKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  const onTest = async () => {
    if (!apiKey) return;
    setTestStatus('testing');
    setTestError(null);
    try {
      let result: { ok: boolean; error?: string };
      if (provider === 'anthropic') {
        result = await createAnthropicProvider(apiKey).testKey(apiKey);
      } else if (provider === 'google') {
        result = await createGoogleProvider(apiKey).testKey(apiKey);
      } else {
        result = { ok: false, error: 'OpenRouter not yet implemented' };
      }
      setTestStatus(result.ok ? 'ok' : 'error');
      setTestError(result.error ?? null);
    } catch (e) {
      setTestStatus('error');
      setTestError((e as Error).message);
    }
  };

  const onSave = async () => {
    await secureStore.set(PROVIDER_KEYS[provider], apiKey);
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    setTestStatus('idle');
    setTestError(null);
  };

  const value = useMemo(() => ({ providerId: provider, apiKey, setApiKey, testStatus, testError, onTest, onSave }),
    [provider, apiKey, testStatus, testError]);

  return (
    <ApiKeyCardContext.Provider value={value}>
      <View style={{
        backgroundColor: colors.bg.elevated,
        borderRadius: radii.md,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border.subtle,
        gap: spacing[3],
      }}>
        {children}
      </View>
    </ApiKeyCardContext.Provider>
  );
}
