type Handler<T> = (payload: T) => void;

class EventBus {
  private handlers = new Map<string, Set<Handler<unknown>>>();

  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as Handler<unknown>);
    return () => this.off(event, handler);
  }

  off<T>(event: string, handler: Handler<T>): void {
    this.handlers.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<T>(event: string, payload: T): void {
    this.handlers.get(event)?.forEach((h) => h(payload));
  }
}

export const eventBus = new EventBus();

export const AppEvent = {
  AUTH_LOGOUT: 'auth:logout',
  AUTH_TOKEN_EXPIRED: 'auth:token-expired',
  WORKSPACE_FILE_SAVED: 'workspace:file-saved',
  WORKSPACE_COMMIT_SUCCESS: 'workspace:commit-success',
  AI_SESSION_STARTED: 'ai:session-started',
  TOAST_SHOW: 'toast:show',
} as const;
