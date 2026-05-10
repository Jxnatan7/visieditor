import { create } from 'zustand';

interface RateLimitState {
  remaining: number;
  limit: number;
  resetAt: number | null;
  updateFromHeaders: (headers: Record<string, string>) => void;
}

export const useRateLimitStore = create<RateLimitState>()((set) => ({
  remaining: 5000,
  limit: 5000,
  resetAt: null,
  updateFromHeaders: (headers) => {
    const remaining = parseInt(headers['x-ratelimit-remaining'] ?? '5000', 10);
    const limit = parseInt(headers['x-ratelimit-limit'] ?? '5000', 10);
    const resetAt = parseInt(headers['x-ratelimit-reset'] ?? '0', 10) * 1000;
    set({ remaining, limit, resetAt: resetAt || null });
  },
}));
