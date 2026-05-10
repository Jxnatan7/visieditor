export function getBasename(path: string): string {
  return path.split('/').pop() ?? path;
}

export function getDirname(path: string): string {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/');
}

export function getExtension(path: string): string {
  const base = getBasename(path);
  const dotIndex = base.lastIndexOf('.');
  return dotIndex === -1 ? '' : base.slice(dotIndex + 1).toLowerCase();
}

export function detectLanguage(path: string): string {
  const ext = getExtension(path);
  const languageMap: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript',
    js: 'javascript', jsx: 'javascript',
    json: 'json', md: 'markdown',
    py: 'python', rs: 'rust',
    go: 'go', java: 'java',
    kt: 'kotlin', swift: 'swift',
    css: 'css', scss: 'scss',
    html: 'html', xml: 'xml',
    yaml: 'yaml', yml: 'yaml',
    toml: 'toml', sh: 'shell',
    sql: 'sql', graphql: 'graphql',
    vue: 'vue', svelte: 'svelte',
    dart: 'dart', rb: 'ruby',
    php: 'php', c: 'c',
    cpp: 'cpp', h: 'c',
  };
  return languageMap[ext] ?? 'plaintext';
}
