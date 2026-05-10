import type { TreeNode } from '@core/types/github';

const EXT_MAP: Record<string, string> = {
  ts: '🟦', tsx: '🟦', js: '🟨', jsx: '🟨',
  json: '📋', md: '📝', py: '🐍', rs: '🦀',
  go: '🐹', java: '☕', kt: '🟣', swift: '🟠',
  css: '🎨', scss: '🎨', html: '🌐', xml: '📄',
  yaml: '📄', yml: '📄', toml: '📄', sh: '💻',
  bash: '💻', zsh: '💻', sql: '🗄️', graphql: '💜',
  vue: '💚', svelte: '🔥', dart: '🎯', rb: '💎',
  php: '🐘', c: '🔵', cpp: '🔵', h: '🔵', hpp: '🔵',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️',
  pdf: '📕', zip: '📦', tar: '📦', gz: '📦',
  lock: '🔒', env: '⚙️', gitignore: '🚫',
};

export function fileIconFor(node: TreeNode): string {
  if (node.type === 'tree') return '📁';

  const parts = node.path.split('/');
  const filename = parts[parts.length - 1] ?? '';
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';

  if (filename === '.env' || filename.startsWith('.env.')) return '⚙️';
  if (filename === '.gitignore') return '🚫';

  return EXT_MAP[ext] ?? '📄';
}

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp',
  'pdf', 'zip', 'tar', 'gz', 'bz2', 'xz', '7z',
  'mp4', 'mp3', 'wav', 'ogg', 'mov', 'avi',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  'exe', 'dll', 'so', 'dylib',
]);

export function isBinaryFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return BINARY_EXTENSIONS.has(ext);
}

export function isImageFile(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
}
