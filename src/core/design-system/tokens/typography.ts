export const typography = {
  display:    { fontFamily: 'Inter-Bold',         fontSize: 28, lineHeight: 34 },
  title:      { fontFamily: 'Inter-SemiBold',     fontSize: 20, lineHeight: 26 },
  body:       { fontFamily: 'Inter-Regular',      fontSize: 15, lineHeight: 22 },
  caption:    { fontFamily: 'Inter-Medium',       fontSize: 13, lineHeight: 18 },
  micro:      { fontFamily: 'Inter-SemiBold',     fontSize: 11, lineHeight: 14 },
  code:       { fontFamily: 'JetBrainsMono-Regular', fontSize: 14, lineHeight: 22 },
  codeInline: { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, lineHeight: 20 },
} as const;

export type TypographyVariant = keyof typeof typography;
