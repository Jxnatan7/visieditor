import { typography } from '../tokens/typography';
import { spacing, radii, motion, shadows } from '../tokens/spacing';
import type { Theme } from './dracula';

export const draculaLightTheme: Theme = {
  id: 'dracula-light' as const,
  colors: {
    bg: {
      base: '#F8F8F2',
      elevated: '#FFFFFF',
      overlay: '#EFEFEF',
      input: '#F0F0F0',
    },
    border: {
      subtle: '#DDDDDD',
      focus: '#7C51DB',
    },
    text: {
      primary: '#282A36',
      secondary: '#44475A',
      muted: '#6272A4',
    },
    accent: {
      primary: '#7C51DB',
      success: '#2DA44E',
      warning: '#E36209',
      danger: '#CF222E',
      info: '#0969DA',
    },
    syntax: {
      keyword: '#CF222E',
      string: '#0550AE',
      comment: '#6E7781',
    },
  },
  typography,
  spacing,
  radii,
  motion,
  shadows,
};
