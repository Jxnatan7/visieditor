import React, { useState } from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { Pressable } from '@ui/Pressable';
import { useTheme } from '@core/design-system/theme-provider';
import { useAISheetContext } from './context';
import { useAIConversationsStore } from '../../stores/ai-conversations-store';
import { useStreamingMessage } from '../../hooks/use-streaming-message';
import { buildSystemPrompt } from '../../prompts/system-prompt';

export function AISheetConversation() {
  const { colors, spacing, radii } = useTheme();
  const { conversationId, provider, filePath, fileContent, onInsertAtCursor } = useAISheetContext();
  const [input, setInput] = useState('');
  const { text, isStreaming, error, start, stop } = useStreamingMessage();
  const conversation = useAIConversationsStore((s) => s.conversations[conversationId]);
  const addMessage = useAIConversationsStore((s) => s.addMessage);

  if (!provider) {
    return (
      <View style={{ padding: spacing[6], alignItems: 'center' }}>
        <Text variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Configure an AI API key in Settings to use the AI assistant.
        </Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg = input.trim();
    setInput('');
    addMessage(conversationId, { role: 'user', content: userMsg });

    const messages = [
      ...(conversation?.messages ?? []).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userMsg },
    ];

    await start(provider, {
      model: provider.models()[0]?.id ?? '',
      messages,
      systemPrompt: buildSystemPrompt({ ...(filePath ? { filePath } : {}) }),
    });

    addMessage(conversationId, { role: 'assistant', content: text });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing[4], gap: spacing[3] }}>
        {(conversation?.messages ?? []).map((msg) => (
          <View
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: msg.role === 'user' ? colors.accent.primary + '33' : colors.bg.input,
              borderRadius: radii.md,
              padding: spacing[3],
            }}
          >
            <Text variant="body">{msg.content}</Text>
            {msg.role === 'assistant' && onInsertAtCursor !== null ? (
              <Pressable
                onPress={() => onInsertAtCursor!(msg.content)}
                style={{ marginTop: spacing[2] }}
              >
                <Text variant="micro" tone="primary">↑ Insert at cursor</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
        {isStreaming ? (
          <View style={{ alignSelf: 'flex-start', maxWidth: '85%', backgroundColor: colors.bg.input, borderRadius: radii.md, padding: spacing[3] }}>
            <Text variant="body">{text || '...'}</Text>
          </View>
        ) : null}
        {error ? <Text variant="caption" tone="danger">{error}</Text> : null}
      </ScrollView>

      <View style={{ flexDirection: 'row', padding: spacing[3], gap: spacing[2], borderTopWidth: 1, borderTopColor: colors.border.subtle }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI anything..."
          placeholderTextColor={colors.text.muted}
          style={{
            flex: 1,
            color: colors.text.primary,
            backgroundColor: colors.bg.input,
            borderRadius: radii.sm,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            maxHeight: 100,
          }}
          multiline
          onSubmitEditing={handleSend}
        />
        {isStreaming ? (
          <Button label="Stop" onPress={stop} variant="danger" />
        ) : (
          <Button label="Send" onPress={handleSend} disabled={!input.trim()} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
