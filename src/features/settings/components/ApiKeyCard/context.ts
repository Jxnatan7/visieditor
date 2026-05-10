import { createContext, useContext } from 'react';
import type { LLMProviderId } from '@core/types/llm';

interface ApiKeyCardContextValue {
  providerId: LLMProviderId;
  apiKey: string;
  setApiKey: (key: string) => void;
  testStatus: 'idle' | 'testing' | 'ok' | 'error';
  testError: string | null;
  onTest: () => void;
  onSave: () => void;
}

export const ApiKeyCardContext = createContext<ApiKeyCardContextValue | null>(null);

export const useApiKeyCardContext = () => {
  const ctx = useContext(ApiKeyCardContext);
  if (!ctx) throw new Error('ApiKeyCard.* must be used inside <ApiKeyCard>');
  return ctx;
};
