import React, { useMemo, useRef, type PropsWithChildren } from 'react';
import BottomSheetLib, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useTheme } from '@core/design-system/theme-provider';
import { AISheetContext } from './context';
import type { LLMProvider } from '@core/types/llm';
import { useAIConversationsStore } from '../../stores/ai-conversations-store';

interface AISheetProps extends PropsWithChildren {
  provider: LLMProvider | null;
  filePath?: string;
  fileContent?: string;
  onInsertAtCursor?: (text: string) => void;
  onReplaceFile?: (text: string) => void;
  onClose?: () => void;
}

export function AISheet({
  children,
  provider,
  filePath,
  fileContent,
  onInsertAtCursor,
  onReplaceFile,
  onClose,
}: AISheetProps) {
  const { colors } = useTheme();
  const sheetRef = useRef<BottomSheetLib>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const createConversation = useAIConversationsStore((s) => s.createConversation);
  const activeId = useAIConversationsStore((s) => s.activeConversationId);

  const conversationId = useMemo(() => {
    if (activeId) return activeId;
    const newId = createConversation({
      model: provider?.models()[0]?.id ?? 'unknown',
      providerId: provider?.id ?? 'anthropic',
      ...(filePath ? { filePath } : {}),
    });
    return newId;
  }, []);

  const value = useMemo(() => ({
    conversationId,
    provider,
    filePath: filePath ?? null,
    fileContent: fileContent ?? null,
    onInsertAtCursor: onInsertAtCursor ?? null,
    onReplaceFile: onReplaceFile ?? null,
  }), [conversationId, provider, filePath, fileContent, onInsertAtCursor, onReplaceFile]);

  return (
    <AISheetContext.Provider value={value}>
      <BottomSheetLib
        ref={sheetRef}
        snapPoints={snapPoints}
        {...(onClose != null ? { onClose } : {})}
        backgroundStyle={{ backgroundColor: colors.bg.elevated }}
        handleIndicatorStyle={{ backgroundColor: colors.border.subtle }}
        enablePanDownToClose
      >
        <BottomSheetScrollView>
          {children}
        </BottomSheetScrollView>
      </BottomSheetLib>
    </AISheetContext.Provider>
  );
}
