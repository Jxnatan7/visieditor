import { getClient } from '../client';
import { fromOctokitError } from '../errors';
import type { Repo, TreeNode, FileBlob, Branch, CommitResult, RepoFilter } from '@core/types/github';

function mapRepo(r: Record<string, unknown>): Repo {
  const owner = (r['owner'] as { login: string } | null)?.login ?? '';
  return {
    id: r['id'] as number,
    owner,
    name: r['name'] as string,
    fullName: r['full_name'] as string,
    description: (r['description'] as string | null) ?? null,
    private: r['private'] as boolean,
    defaultBranch: (r['default_branch'] as string) ?? 'main',
    language: (r['language'] as string | null) ?? null,
    stargazersCount: (r['stargazers_count'] as number) ?? 0,
    pushedAt: (r['pushed_at'] as string) ?? '',
    updatedAt: (r['updated_at'] as string) ?? '',
    localChanges: 0,
  };
}

export const reposService = {
  async list(filter: RepoFilter): Promise<Repo[]> {
    try {
      const { rest } = await getClient();
      const perPage = 100;

      if (filter === 'starred') {
        const { data } = await rest.activity.listReposStarredByAuthenticatedUser({ per_page: perPage });
        return data.map((r) => mapRepo(r as unknown as Record<string, unknown>));
      }

      const sort = filter === 'recent' ? 'pushed' : 'full_name';
      const { data } = await rest.repos.listForAuthenticatedUser({
        sort: sort as 'pushed' | 'full_name',
        per_page: perPage,
      });
      return data.map((r) => mapRepo(r as unknown as Record<string, unknown>));
    } catch (e) {
      throw fromOctokitError(e);
    }
  },

  async getTree(args: { owner: string; repo: string; branch: string; path?: string }): Promise<TreeNode[]> {
    try {
      const { rest } = await getClient();
      const { data } = await rest.git.getTree({
        owner: args.owner,
        repo: args.repo,
        tree_sha: args.branch,
        recursive: 'false',
      });
      return (data.tree ?? [])
        .filter((item): item is Required<typeof item> => !!item.path && !!item.type)
        .map((item) => ({
          path: item.path,
          type: item.type as 'blob' | 'tree',
          sha: item.sha ?? '',
          size: item.size,
          mode: item.mode ?? '100644',
        }));
    } catch (e) {
      throw fromOctokitError(e);
    }
  },

  async getFileContent(args: { owner: string; repo: string; path: string; ref?: string }): Promise<FileBlob> {
    try {
      const { rest } = await getClient();
      const params = args.ref
        ? { owner: args.owner, repo: args.repo, path: args.path, ref: args.ref }
        : { owner: args.owner, repo: args.repo, path: args.path };

      const { data } = await rest.repos.getContent(params);

      if (Array.isArray(data) || data.type !== 'file') {
        throw new Error('Expected a file, got a directory');
      }

      const rawContent = data.content.replace(/\n/g, '');
      const content = data.encoding === 'base64'
        ? Buffer.from(rawContent, 'base64').toString('utf-8')
        : data.content;

      return {
        content,
        sha: data.sha,
        encoding: 'utf-8',
      };
    } catch (e) {
      throw fromOctokitError(e);
    }
  },

  async commit(args: {
    owner: string;
    repo: string;
    branch: string;
    message: string;
    files: Array<{ path: string; content: string }>;
  }): Promise<CommitResult> {
    try {
      const { rest } = await getClient();

      const { data: refData } = await rest.git.getRef({
        owner: args.owner,
        repo: args.repo,
        ref: `heads/${args.branch}`,
      });
      const latestSha = refData.object.sha;

      const { data: commitData } = await rest.git.getCommit({
        owner: args.owner,
        repo: args.repo,
        commit_sha: latestSha,
      });
      const treeSha = commitData.tree.sha;

      const blobs = await Promise.all(args.files.map(async (f) => {
        const { data: blob } = await rest.git.createBlob({
          owner: args.owner,
          repo: args.repo,
          content: f.content,
          encoding: 'utf-8',
        });
        return { path: f.path, sha: blob.sha };
      }));

      const { data: newTree } = await rest.git.createTree({
        owner: args.owner,
        repo: args.repo,
        base_tree: treeSha,
        tree: blobs.map((b) => ({
          path: b.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: b.sha,
        })),
      });

      const { data: newCommit } = await rest.git.createCommit({
        owner: args.owner,
        repo: args.repo,
        message: args.message,
        tree: newTree.sha,
        parents: [latestSha],
      });

      await rest.git.updateRef({
        owner: args.owner,
        repo: args.repo,
        ref: `heads/${args.branch}`,
        sha: newCommit.sha,
      });

      return { sha: newCommit.sha, url: newCommit.url };
    } catch (e) {
      throw fromOctokitError(e);
    }
  },

  async listBranches(owner: string, repo: string): Promise<Branch[]> {
    try {
      const { rest } = await getClient();
      const { data } = await rest.repos.listBranches({ owner, repo, per_page: 100 });
      return data.map((b) => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected,
      }));
    } catch (e) {
      throw fromOctokitError(e);
    }
  },

  async getCurrentUser() {
    try {
      const { rest } = await getClient();
      const { data } = await rest.users.getAuthenticated();
      return {
        login: data.login,
        id: data.id,
        avatarUrl: data.avatar_url,
        name: data.name ?? null,
        email: data.email ?? null,
      };
    } catch (e) {
      throw fromOctokitError(e);
    }
  },
};
