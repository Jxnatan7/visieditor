import React from 'react';
import { View } from 'react-native';
import { Button } from '@ui/Button';
import { useApiKeyCardContext } from './context';

export function ApiKeyCardTestButton() {
  const { onTest, onSave, testStatus, apiKey } = useApiKeyCardContext();

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Button
        label={testStatus === 'testing' ? 'Testing...' : 'Test Key'}
        onPress={onTest}
        variant="secondary"
        loading={testStatus === 'testing'}
        disabled={!apiKey || testStatus === 'testing'}
      />
      <Button
        label="Save"
        onPress={onSave}
        disabled={!apiKey}
      />
    </View>
  );
}
