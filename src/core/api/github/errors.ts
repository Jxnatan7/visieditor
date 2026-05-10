export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export type GithubErrorCode = 'unauthorized' | 'rate_limit' | 'not_found' | 'conflict' | 'unknown';

export class GithubApiError extends AppError {
  constructor(
    public readonly status: number,
    public readonly code: GithubErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GithubApiError';
  }
}

export class AuthRequiredError extends AppError {
  constructor() {
    super('Authentication required');
    this.name = 'AuthRequiredError';
  }
}

export function fromOctokitError(err: unknown): GithubApiError {
  if (err instanceof GithubApiError) return err;

  const status = (err as Record<string, number>)?.status ?? 0;
  const message = (err as Error)?.message ?? 'Unknown error';

  if (status === 401) return new GithubApiError(401, 'unauthorized', message);
  if (status === 403) return new GithubApiError(403, 'rate_limit', message);
  if (status === 404) return new GithubApiError(404, 'not_found', message);
  if (status === 409) return new GithubApiError(409, 'conflict', message);

  return new GithubApiError(status, 'unknown', message);
}

export function isRetriable(err: unknown): boolean {
  if (err instanceof GithubApiError) {
    return err.code !== 'unauthorized' && err.code !== 'not_found';
  }
  return true;
}
