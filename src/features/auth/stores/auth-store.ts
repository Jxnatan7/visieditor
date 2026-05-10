import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMmkvStorage } from '@core/storage/mmkv';
import { secureStore } from '@core/storage/secure-store';
import { invalidateClient } from '@core/api/github/client';
import type { GithubUser } from '@core/types/github';

interface AuthState {
  token: string | null;
  user: GithubUser | null;
  hydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: GithubUser) => void;
  logout: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        user: null,
        hydrated: false,

        setToken: (token) => {
          secureStore.set('github_token', token);
          set({ token });
        },

        setUser: (user) => set({ user }),

        logout: async () => {
          await secureStore.del('github_token');
          invalidateClient();
          set({ token: null, user: null });
        },

        setHydrated: () => set({ hydrated: true }),
      }),
      {
        name: 'auth',
        storage: createMmkvStorage<AuthState>(),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated();
        },
      },
    ),
    { name: 'auth-store' },
  ),
);
