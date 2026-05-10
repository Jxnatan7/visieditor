import { AISheet as Root } from './AISheet';
import { AISheetHeader } from './AISheet.Header';
import { AISheetConversation } from './AISheet.Conversation';
import { AISheetQuickActions } from './AISheet.QuickActions';

export const AISheet = Object.assign(Root, {
  Header: AISheetHeader,
  Conversation: AISheetConversation,
  QuickActions: AISheetQuickActions,
});
