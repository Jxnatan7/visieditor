import { z } from 'zod';

const initSchema = z.object({
  content: z.string(),
  language: z.string(),
  theme: z.string(),
  fontSize: z.number().default(14),
  readOnly: z.boolean().default(false),
});

const contentSchema = z.object({ content: z.string() });
const themeSchema = z.object({ theme: z.string() });
const findSchema = z.object({ query: z.string(), replace: z.string().optional() });
const diffSchema = z.object({ original: z.string(), modified: z.string() });
const rangeReplaceSchema = z.object({
  text: z.string(),
  startLine: z.number(),
  startCol: z.number(),
  endLine: z.number(),
  endCol: z.number(),
});
const cursorSchema = z.object({ line: z.number(), column: z.number() });
const selectionSchema = z.object({
  startLine: z.number(),
  startCol: z.number(),
  endLine: z.number(),
  endCol: z.number(),
  text: z.string(),
});

export const inboundMessage = z.discriminatedUnion('type', [
  z.object({ type: z.literal('INIT'), payload: initSchema }),
  z.object({ type: z.literal('SET_CONTENT'), payload: contentSchema }),
  z.object({ type: z.literal('SET_THEME'), payload: themeSchema }),
  z.object({ type: z.literal('SET_FONT_SIZE'), payload: z.object({ size: z.number() }) }),
  z.object({ type: z.literal('INSERT_AT_CURSOR'), payload: z.object({ text: z.string() }) }),
  z.object({ type: z.literal('REPLACE_SELECTION'), payload: z.object({ text: z.string() }) }),
  z.object({ type: z.literal('REPLACE_RANGE'), payload: rangeReplaceSchema }),
  z.object({ type: z.literal('GO_TO_LINE'), payload: z.object({ line: z.number() }) }),
  z.object({ type: z.literal('FIND'), payload: findSchema }),
  z.object({ type: z.literal('SHOW_DIFF'), payload: diffSchema }),
  z.object({ type: z.literal('UNDO') }),
  z.object({ type: z.literal('REDO') }),
]);

export const outboundMessage = z.discriminatedUnion('type', [
  z.object({ type: z.literal('READY') }),
  z.object({
    type: z.literal('CONTENT_CHANGED'),
    payload: z.object({ content: z.string(), version: z.number() }),
  }),
  z.object({ type: z.literal('CURSOR_CHANGED'), payload: cursorSchema }),
  z.object({ type: z.literal('SELECTION_CHANGED'), payload: selectionSchema }),
  z.object({ type: z.literal('ERROR'), payload: z.object({ message: z.string() }) }),
]);

export type InboundMessage = z.infer<typeof inboundMessage>;
export type OutboundMessage = z.infer<typeof outboundMessage>;
