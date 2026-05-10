export type LLMProviderId = 'anthropic' | 'google' | 'openrouter';

export interface Model {
  id: string;
  name: string;
  contextWindow: number;
  inputCostPer1kTokens: number;
  outputCostPer1kTokens: number;
}

export interface CompletionRequest {
  model: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface CompletionChunk {
  type: 'text';
  text: string;
}

export interface LLMProvider {
  id: LLMProviderId;
  models(): readonly Model[];
  stream(req: CompletionRequest, signal: AbortSignal): AsyncIterable<CompletionChunk>;
  testKey(key: string): Promise<{ ok: boolean; error?: string }>;
  estimateTokens(text: string): number;
}
