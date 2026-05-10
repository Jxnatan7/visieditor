import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from '@core/storage/mmkv';
import type { LLMProviderId } from '@core/types/llm';

interface AIDefaultsState {
  defaultProvider: LLMProviderId;
  defaultModels: Record<LLMProviderId, string>;
  setDefaultProvider: (id: LLMProviderId) => void;
  setDefaultModel: (providerId: LLMProviderId, modelId: string) => void;
}

export const useAIDefaultsStore = create<AIDefaultsState>()(
  persist(
    (set) => ({
      defaultProvider: 'anthropic',
      defaultModels: {
        anthropic: 'claude-sonnet-4-6',
        google: 'gemini-1.5-pro',
        openrouter: 'openai/gpt-4o',
      },
      setDefaultProvider: (defaultProvider) => set({ defaultProvider }),
      setDefaultModel: (providerId, modelId) =>
        set((s) => ({ defaultModels: { ...s.defaultModels, [providerId]: modelId } })),
    }),
    { name: 'ai-defaults', storage: mmkvStorage },
  ),
);
