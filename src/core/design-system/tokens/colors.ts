export const palette = {
  bgBase: '#282A36',
  bgElevated: '#343746',
  bgOverlay: '#1E1F29',
  bgInput: '#21222C',
  borderSubtle: '#44475A',
  borderFocus: '#BD93F9',
  textPrimary: '#F8F8F2',
  textSecondary: '#BFBFBF',
  textMuted: '#6272A4',
  accentPrimary: '#BD93F9',
  accentSuccess: '#50FA7B',
  accentWarning: '#FFB86C',
  accentDanger: '#FF5555',
  accentInfo: '#8BE9FD',
  syntaxKeyword: '#FF79C6',
  syntaxString: '#F1FA8C',
  syntaxComment: '#6272A4',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = keyof typeof palette;
