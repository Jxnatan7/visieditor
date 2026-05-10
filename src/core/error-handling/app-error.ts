export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor() {
    super('No internet connection');
    this.name = 'NetworkError';
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export function handleError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred';
}
