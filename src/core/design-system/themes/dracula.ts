import { palette } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, radii, motion, shadows } from '../tokens/spacing';

export const draculaTheme = {
  id: 'dracula' as string,
  colors: {
    bg: {
      base: palette.bgBase,
      elevated: palette.bgElevated,
      overlay: palette.bgOverlay,
      input: palette.bgInput,
    },
    border: {
      subtle: palette.borderSubtle,
      focus: palette.borderFocus,
    },
    text: {
      primary: palette.textPrimary,
      secondary: palette.textSecondary,
      muted: palette.textMuted,
    },
    accent: {
      primary: palette.accentPrimary,
      success: palette.accentSuccess,
      warning: palette.accentWarning,
      danger: palette.accentDanger,
      info: palette.accentInfo,
    },
    syntax: {
      keyword: palette.syntaxKeyword,
      string: palette.syntaxString,
      comment: palette.syntaxComment,
    },
  },
  typography,
  spacing,
  radii,
  motion,
  shadows,
};

export interface Theme {
  id: string;
  colors: {
    bg: { base: string; elevated: string; overlay: string; input: string };
    border: { subtle: string; focus: string };
    text: { primary: string; secondary: string; muted: string };
    accent: { primary: string; success: string; warning: string; danger: string; info: string };
    syntax: { keyword: string; string: string; comment: string };
  };
  typography: typeof import('../tokens/typography').typography;
  spacing: typeof import('../tokens/spacing').spacing;
  radii: typeof import('../tokens/spacing').radii;
  motion: typeof import('../tokens/spacing').motion;
  shadows: typeof import('../tokens/spacing').shadows;
}
