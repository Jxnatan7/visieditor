import Anthropic from '@anthropic-ai/sdk';
import type { LLMProvider, CompletionRequest, CompletionChunk, Model } from '@core/types/llm';

const MODELS: readonly Model[] = [
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', contextWindow: 200000, inputCostPer1kTokens: 0.003, outputCostPer1kTokens: 0.015 },
  { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', contextWindow: 200000, inputCostPer1kTokens: 0.00025, outputCostPer1kTokens: 0.00125 },
] as const;

export function createAnthropicProvider(apiKey: string): LLMProvider {
  const client = new Anthropic({ apiKey });

  return {
    id: 'anthropic',

    models: () => MODELS,

    estimateTokens: (text) => Math.ceil(text.length / 4),

    async testKey(key: string) {
      try {
        const testClient = new Anthropic({ apiKey: key });
        await testClient.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: (err as Error).message };
      }
    },

    async *stream(req: CompletionRequest, signal: AbortSignal): AsyncIterable<CompletionChunk> {
      const apiMessages = req.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const params: Anthropic.MessageStreamParams = {
        model: req.model,
        max_tokens: req.maxTokens ?? 4096,
        messages: apiMessages,
      };

      if (req.systemPrompt) {
        (params as unknown as Record<string, unknown>)['system'] = req.systemPrompt;
      }

      const stream = await client.messages.stream(params, { signal });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield { type: 'text', text: event.delta.text };
        }
      }
    },
  };
}
