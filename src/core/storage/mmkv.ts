import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

// Uses AsyncStorage instead of react-native-mmkv so the app works in Expo Go.
// react-native-mmkv@4 requires react-native-nitro-modules (native build only).
// Swap back to MMKV once you set up a development build via EAS.
export function createMmkvStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (key): Promise<StorageValue<T> | null> => {
      const value = await AsyncStorage.getItem(key);
      if (value == null) return null;
      return JSON.parse(value) as StorageValue<T>;
    },
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
  };
}

export const mmkvStorage = createMmkvStorage<unknown>();
