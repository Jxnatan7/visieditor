export interface GithubUser {
  login: string;
  id: number;
  avatarUrl: string;
  name: string | null;
  email: string | null;
}

export interface Repo {
  id: number;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  language: string | null;
  stargazersCount: number;
  pushedAt: string;
  updatedAt: string;
  localChanges?: number;
}

export interface TreeNode {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  mode: string;
}

export interface FileBlob {
  content: string;
  sha: string;
  encoding: 'base64' | 'utf-8';
}

export interface Branch {
  name: string;
  sha: string;
  protected: boolean;
}

export interface CommitResult {
  sha: string;
  url: string;
}

export type RepoFilter = 'recent' | 'starred' | 'all';

export type GitStatus = 'modified' | 'added' | 'deleted' | 'renamed' | 'conflict' | 'untracked';
