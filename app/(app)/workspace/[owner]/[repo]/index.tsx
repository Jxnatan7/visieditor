import React, { useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { Pressable } from '@ui/Pressable';
import { Button } from '@ui/Button';
import { FileTree } from '@features/workspace/components/FileTree';
import { InlineEditor } from '@features/workspace/components/InlineEditor';
import { useTree } from '@features/workspace/api/use-tree';
import { useFileContent, useSaveFile } from '@features/workspace/api/use-file-content';
import { useBranches } from '@features/workspace/api/use-branches';
import { useWorkspaceStore } from '@features/workspace/stores/workspace-store';
import { CommitForm } from '@features/git-operations/components/CommitForm';
import { AISheet } from '@features/ai-assistant/components/AISheet';
import { secureStore } from '@core/storage/secure-store';
import { createAnthropicProvider } from '@core/api/llm/anthropic';
import type { TreeNode } from '@core/types/github';
import type { LLMProvider } from '@core/types/llm';

export default function WorkspaceScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();
  const { colors, spacing } = useTheme();

  const currentBranch = useWorkspaceStore((s) => s.currentBranch) ?? 'main';
  const expandedPath = useWorkspaceStore((s) => s.expandedPath);
  const expand = useWorkspaceStore((s) => s.expand);
  const setDraft = useWorkspaceStore((s) => s.setDraft);
  const unsavedDrafts = useWorkspaceStore((s) => s.unsavedDrafts);

  const { data: tree, isLoading: treeLoading } = useTree(owner ?? '', repo ?? '', currentBranch);
  const { data: fileData } = useFileContent(owner ?? '', repo ?? '', currentBranch, expandedPath ?? '', {
    enabled: !!expandedPath,
  });
  const saveFile = useSaveFile(owner ?? '', repo ?? '', currentBranch, expandedPath ?? '');

  const [showCommit, setShowCommit] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiProvider, setAiProvider] = useState<LLMProvider | null>(null);

  const openAI = useCallback(async () => {
    const key = await secureStore.get('anthropic_key');
    if (key) setAiProvider(createAnthropicProvider(key));
    setShowAI(true);
  }, []);

  const handleFilePress = useCallback((_node: TreeNode) => {
    // file is expanded via store, content loaded via query
  }, []);

  const hasDrafts = Object.keys(unsavedDrafts).length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border.subtle }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: spacing[3] }}>
          <Text variant="body">← Back</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">{owner}</Text>
          <Text variant="body" style={{ fontFamily: 'Inter-SemiBold' }}>{repo}</Text>
        </View>
        <Text variant="micro" tone="primary" style={{ fontFamily: 'Inter-Medium' }}>{currentBranch}</Text>
      </View>

      {/* File tree */}
      <View style={{ flex: 1 }}>
        <FileTree
          nodes={tree ?? []}
          isLoading={treeLoading}
          onFilePress={handleFilePress}
        />
      </View>

      {/* Inline editor */}
      {expandedPath && fileData ? (
        <InlineEditor
          path={expandedPath}
          initialContent={unsavedDrafts[expandedPath] ?? fileData.content}
          onContentChange={(content) => setDraft(expandedPath, content)}
          onSave={(content) => saveFile.mutate(content)}
          onAI={openAI}
          isVisible={!!expandedPath}
        />
      ) : null}

      {/* Bottom action bar */}
      <View style={{ flexDirection: 'row', padding: spacing[3], gap: spacing[2], borderTopWidth: 1, borderTopColor: colors.border.subtle, backgroundColor: colors.bg.elevated }}>
        <Button label="✦ AI" onPress={openAI} variant="secondary" />
        <View style={{ flex: 1 }} />
        <Button
          label={hasDrafts ? `Commit (${Object.keys(unsavedDrafts).length})` : 'Commit'}
          onPress={() => setShowCommit(true)}
          disabled={!hasDrafts}
          variant={hasDrafts ? 'primary' : 'secondary'}
        />
      </View>

      {/* Commit modal */}
      <Modal visible={showCommit} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCommit(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
          <View style={{ flexDirection: 'row', padding: spacing[4] }}>
            <Pressable onPress={() => setShowCommit(false)}>
              <Text variant="body" tone="primary">Cancel</Text>
            </Pressable>
          </View>
          <CommitForm
            owner={owner ?? ''}
            repo={repo ?? ''}
            branch={currentBranch}
            onSuccess={() => setShowCommit(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* AI sheet */}
      {showAI ? (
        <AISheet
          provider={aiProvider}
          {...(expandedPath ? { filePath: expandedPath } : {})}
          {...(expandedPath ? { fileContent: unsavedDrafts[expandedPath] ?? fileData?.content } : {})}
          onClose={() => setShowAI(false)}
        >
          <AISheet.Header />
          <AISheet.Conversation />
        </AISheet>
      ) : null}
    </SafeAreaView>
  );
}
