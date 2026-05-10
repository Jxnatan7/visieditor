export { draculaTheme } from './dracula';
export type { Theme } from './dracula';
export { draculaLightTheme } from './dracula-light';

export const themes = {
  dracula: 'dracula',
  'dracula-light': 'dracula-light',
} as const;

export type ThemeId = keyof typeof themes;
