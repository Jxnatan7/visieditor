import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMmkvStorage } from '@core/storage/mmkv';
import type { LLMProviderId } from '@core/types/llm';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensIn?: number;
  tokensOut?: number;
  createdAt: number;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  model: string;
  providerId: LLMProviderId;
  filePath?: string;
  createdAt: number;
  totalCostUsd: number;
}

interface AIConversationsState {
  conversations: Record<string, AIConversation>;
  activeConversationId: string | null;
  createConversation: (args: { model: string; providerId: LLMProviderId; filePath?: string }) => string;
  addMessage: (conversationId: string, message: Omit<AIMessage, 'id' | 'createdAt'>) => void;
  clearConversation: (conversationId: string) => void;
  setActive: (id: string | null) => void;
}

export const useAIConversationsStore = create<AIConversationsState>()(
  persist(
    (set) => ({
      conversations: {},
      activeConversationId: null,

      createConversation: ({ model, providerId, filePath }) => {
        const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const newConv: AIConversation = {
          id,
          messages: [],
          model,
          providerId,
          createdAt: Date.now(),
          totalCostUsd: 0,
          ...(filePath !== undefined ? { filePath } : {}),
        };
        set((s) => ({
          conversations: { ...s.conversations, [id]: newConv },
          activeConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId, message) => {
        const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        set((s) => {
          const conv = s.conversations[conversationId];
          if (!conv) return s;
          const newMsg: AIMessage = { ...message, id, createdAt: Date.now() };
          return {
            conversations: {
              ...s.conversations,
              [conversationId]: { ...conv, messages: [...conv.messages, newMsg] },
            },
          };
        });
      },

      clearConversation: (conversationId) => {
        set((s) => {
          const conv = s.conversations[conversationId];
          if (!conv) return s;
          return {
            conversations: {
              ...s.conversations,
              [conversationId]: { ...conv, messages: [], totalCostUsd: 0 },
            },
          };
        });
      },

      setActive: (id) => set({ activeConversationId: id }),
    }),
    { name: 'ai-conversations', storage: createMmkvStorage<AIConversationsState>() },
  ),
);
