const TYPES = ['feat', 'fix', 'refactor', 'chore', 'test', 'docs', 'style', 'perf', 'ci', 'build'] as const;
type CommitType = typeof TYPES[number];

export interface ParsedCommit {
  type: CommitType | null;
  scope: string | null;
  subject: string;
  body: string | null;
  breaking: boolean;
}

export function parseConventionalCommit(message: string): ParsedCommit {
  const headerPattern = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;
  const lines = message.split('\n');
  const header = lines[0] ?? '';
  const match = header.match(headerPattern);

  if (!match) {
    return { type: null, scope: null, subject: header, body: lines.slice(1).join('\n').trim() || null, breaking: false };
  }

  return {
    type: TYPES.includes(match[1] as CommitType) ? (match[1] as CommitType) : null,
    scope: match[2] ?? null,
    subject: match[4] ?? '',
    body: lines.slice(1).join('\n').trim() || null,
    breaking: match[3] === '!',
  };
}

export function formatConventionalCommit(parsed: ParsedCommit): string {
  const typeScope = parsed.type
    ? `${parsed.type}${parsed.scope ? `(${parsed.scope})` : ''}${parsed.breaking ? '!' : ''}: `
    : '';
  const header = `${typeScope}${parsed.subject}`;
  return parsed.body ? `${header}\n\n${parsed.body}` : header;
}

export const COMMIT_TYPES: Array<{ value: CommitType; label: string; description: string }> = [
  { value: 'feat', label: 'feat', description: 'New feature' },
  { value: 'fix', label: 'fix', description: 'Bug fix' },
  { value: 'refactor', label: 'refactor', description: 'Code refactoring' },
  { value: 'docs', label: 'docs', description: 'Documentation' },
  { value: 'test', label: 'test', description: 'Tests' },
  { value: 'chore', label: 'chore', description: 'Build / tooling' },
  { value: 'style', label: 'style', description: 'Formatting' },
  { value: 'perf', label: 'perf', description: 'Performance' },
];
