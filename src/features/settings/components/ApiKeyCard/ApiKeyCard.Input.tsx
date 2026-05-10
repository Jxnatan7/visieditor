import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@ui/Input';
import { Pressable } from '@ui/Pressable';
import { Text } from '@ui/Text';
import { useApiKeyCardContext } from './context';

export function ApiKeyCardInput() {
  const { apiKey, setApiKey, providerId } = useApiKeyCardContext();
  const [visible, setVisible] = useState(false);

  const placeholder: Record<string, string> = {
    anthropic: 'sk-ant-...',
    google: 'AIzaSy...',
    openrouter: 'sk-or-...',
  };

  return (
    <Input
      label={`${providerId.charAt(0).toUpperCase() + providerId.slice(1)} API Key`}
      value={apiKey}
      onChangeText={setApiKey}
      placeholder={placeholder[providerId] ?? 'Enter API key...'}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      rightElement={
        <Pressable onPress={() => setVisible((v) => !v)} style={{ padding: 4 }}>
          <Text variant="micro" tone="primary">{visible ? 'Hide' : 'Show'}</Text>
        </Pressable>
      }
    />
  );
}
