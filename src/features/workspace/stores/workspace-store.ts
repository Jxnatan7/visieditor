import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { createMmkvStorage } from '@core/storage/mmkv';

interface WorkspaceState {
  expandedPath: string | null;
  selectedPaths: Set<string>;
  unsavedDrafts: Record<string, string>;
  currentBranch: string | null;
  expand: (path: string | null) => void;
  toggleSelect: (path: string) => void;
  setDraft: (path: string, content: string) => void;
  clearDraft: (path: string) => void;
  setBranch: (branch: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set) => ({
          expandedPath: null,
          selectedPaths: new Set<string>(),
          unsavedDrafts: {},
          currentBranch: null,

          expand: (path) => set({ expandedPath: path }),

          toggleSelect: (path) =>
            set((s) => {
              const next = new Set(s.selectedPaths);
              next.has(path) ? next.delete(path) : next.add(path);
              return { selectedPaths: next };
            }),

          setDraft: (path, content) =>
            set((s) => ({
              unsavedDrafts: { ...s.unsavedDrafts, [path]: content },
            })),

          clearDraft: (path) =>
            set((s) => {
              const next = { ...s.unsavedDrafts };
              delete next[path];
              return { unsavedDrafts: next };
            }),

          setBranch: (branch) => set({ currentBranch: branch }),
        }),
        { name: 'workspace', storage: createMmkvStorage<WorkspaceState>() },
      ),
    ),
    { name: 'workspace-store' },
  ),
);
