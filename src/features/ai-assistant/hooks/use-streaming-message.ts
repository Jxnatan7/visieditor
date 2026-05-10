import { useCallback, useRef, useState } from 'react';
import type { LLMProvider, CompletionRequest } from '@core/types/llm';
import { logger } from '@core/logger/logger';

interface UseStreamingMessageReturn {
  text: string;
  isStreaming: boolean;
  error: string | null;
  start: (provider: LLMProvider, req: CompletionRequest) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useStreamingMessage(): UseStreamingMessageReturn {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef(new AbortController());

  const start = useCallback(async (provider: LLMProvider, req: CompletionRequest) => {
    ctrl.current = new AbortController();
    setText('');
    setError(null);
    setIsStreaming(true);

    try {
      for await (const chunk of provider.stream(req, ctrl.current.signal)) {
        setText((t) => t + chunk.text);
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      const msg = (e as Error).message ?? 'Stream error';
      setError(msg);
      logger.error('Streaming error', e);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    ctrl.current.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return { text, isStreaming, error, start, stop, reset };
}
