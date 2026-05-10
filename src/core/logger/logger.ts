const SENSITIVE_PATTERN = /sk-[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]+|Bearer\s+[a-zA-Z0-9._-]+/g;

function redact(msg: string): string {
  return msg.replace(SENSITIVE_PATTERN, '[REDACTED]');
}

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = {
  info: (msg: string, ...args: unknown[]) => {
    if (isDev) console.info(`[INFO] ${redact(msg)}`, ...args);
  },
  warn: (msg: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${redact(msg)}`, ...args);
  },
  error: (msg: string, err?: unknown) => {
    const clean = redact(msg);
    console.error(`[ERROR] ${clean}`, err);
  },
  debug: (msg: string, ...args: unknown[]) => {
    if (isDev) console.debug(`[DEBUG] ${redact(msg)}`, ...args);
  },
};
