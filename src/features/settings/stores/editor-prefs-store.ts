import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from '@core/storage/mmkv';

interface EditorPrefs {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
  setMinimap: (enabled: boolean) => void;
}

export const useEditorPrefsStore = create<EditorPrefs>()(
  persist(
    (set) => ({
      fontSize: 14,
      tabSize: 2,
      wordWrap: false,
      lineNumbers: true,
      minimap: false,
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setMinimap: (minimap) => set({ minimap }),
    }),
    { name: 'editor-prefs', storage: mmkvStorage },
  ),
);
