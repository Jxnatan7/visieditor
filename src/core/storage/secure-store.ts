import * as SecureStore from 'expo-secure-store';

type Key = 'github_token' | 'anthropic_key' | 'google_key' | 'openrouter_key';

export const secureStore = {
  get: (key: Key): Promise<string | null> =>
    SecureStore.getItemAsync(key),

  set: (key: Key, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),

  del: (key: Key): Promise<void> =>
    SecureStore.deleteItemAsync(key),
};
