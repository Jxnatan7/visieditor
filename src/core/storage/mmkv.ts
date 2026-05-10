import { createMMKV } from 'react-native-mmkv';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

export const mmkv = createMMKV({ id: 'visieditor-store' });

export function createMmkvStorage<T>(): PersistStorage<T> {
  return {
    getItem: (key): StorageValue<T> | null => {
      const value = mmkv.getString(key);
      if (!value) return null;
      return JSON.parse(value) as StorageValue<T>;
    },
    setItem: (key, value) => {
      mmkv.set(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      mmkv.remove(key);
    },
  };
}

export const mmkvStorage = createMmkvStorage<unknown>();
