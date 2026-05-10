import { createContext, useContext } from 'react';
import type { LLMProvider } from '@core/types/llm';

interface AISheetContextValue {
  conversationId: string;
  provider: LLMProvider | null;
  filePath: string | null;
  fileContent: string | null;
  onInsertAtCursor: ((text: string) => void) | null;
  onReplaceFile: ((text: string) => void) | null;
}

export const AISheetContext = createContext<AISheetContextValue | null>(null);

export const useAISheetContext = () => {
  const ctx = useContext(AISheetContext);
  if (!ctx) throw new Error('AISheet.* must be used inside <AISheet>');
  return ctx;
};
