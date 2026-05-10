import * as FileSystem from 'expo-file-system';

const CACHE_ROOT = `${FileSystem.cacheDirectory}repos/`;
const MAX_CACHE_BYTES = 200 * 1024 * 1024; // 200 MB
const MAX_DRAFTS = 5;

function blobPath(owner: string, repo: string, sha: string): string {
  return `${CACHE_ROOT}${owner}__${repo}/blobs/${sha}`;
}

function draftPath(owner: string, repo: string, branch: string, filePath: string): string {
  const safePath = filePath.replace(/\//g, '__');
  return `${CACHE_ROOT}${owner}__${repo}/drafts/${branch}/${safePath}`;
}

export const fileCache = {
  async readBlob(owner: string, repo: string, sha: string): Promise<string | null> {
    const path = blobPath(owner, repo, sha);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    return FileSystem.readAsStringAsync(path);
  },

  async writeBlob(owner: string, repo: string, sha: string, content: string): Promise<void> {
    const dir = `${CACHE_ROOT}${owner}__${repo}/blobs/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    await FileSystem.writeAsStringAsync(blobPath(owner, repo, sha), content);
  },

  async readDraft(owner: string, repo: string, branch: string, filePath: string): Promise<string | null> {
    const path = draftPath(owner, repo, branch, filePath);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    return FileSystem.readAsStringAsync(path);
  },

  async writeDraft(owner: string, repo: string, branch: string, filePath: string, content: string): Promise<void> {
    const dir = `${CACHE_ROOT}${owner}__${repo}/drafts/${branch}/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    await FileSystem.writeAsStringAsync(draftPath(owner, repo, branch, filePath), content);
  },

  async deleteDraft(owner: string, repo: string, branch: string, filePath: string): Promise<void> {
    const path = draftPath(owner, repo, branch, filePath);
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) await FileSystem.deleteAsync(path);
  },

  async cacheSize(): Promise<number> {
    const info = await FileSystem.getInfoAsync(CACHE_ROOT);
    if (!info.exists) return 0;
    return (info as { size?: number }).size ?? 0;
  },

  async clearAll(): Promise<void> {
    const info = await FileSystem.getInfoAsync(CACHE_ROOT);
    if (info.exists) await FileSystem.deleteAsync(CACHE_ROOT, { idempotent: true });
  },
};
