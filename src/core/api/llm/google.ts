import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider, CompletionRequest, CompletionChunk, Model } from '@core/types/llm';

const MODELS: readonly Model[] = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 1000000, inputCostPer1kTokens: 0.00125, outputCostPer1kTokens: 0.005 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 1000000, inputCostPer1kTokens: 0.000075, outputCostPer1kTokens: 0.0003 },
] as const;

export function createGoogleProvider(apiKey: string): LLMProvider {
  const genAI = new GoogleGenerativeAI(apiKey);

  return {
    id: 'google',

    models: () => MODELS,

    estimateTokens: (text) => Math.ceil(text.length / 4),

    async testKey(key: string) {
      try {
        const testClient = new GoogleGenerativeAI(key);
        const model = testClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        await model.generateContent('Hi');
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },

    async *stream(req: CompletionRequest, signal: AbortSignal): AsyncIterable<CompletionChunk> {
      const model = genAI.getGenerativeModel({ model: req.model });
      const contents = req.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const result = await model.generateContentStream({ contents });

      for await (const chunk of result.stream) {
        if (signal.aborted) break;
        const text = chunk.text();
        if (text) yield { type: 'text', text };
      }
    },
  };
}
