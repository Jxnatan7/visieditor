import { useQuery } from '@tanstack/react-query';
import { reposService } from '@core/api/github/services/repos';
import { isRetriable } from '@core/api/github/errors';

export const workspaceKeys = {
  all: ['workspace'] as const,
  tree: (owner: string, repo: string, branch: string, path: string) =>
    [...workspaceKeys.all, 'tree', owner, repo, branch, path] as const,
  fileContent: (owner: string, repo: string, branch: string, path: string) =>
    [...workspaceKeys.all, 'file', owner, repo, branch, path] as const,
  branches: (owner: string, repo: string) =>
    [...workspaceKeys.all, 'branches', owner, repo] as const,
};

export function useTree(owner: string, repo: string, branch: string, path = '') {
  return useQuery({
    queryKey: workspaceKeys.tree(owner, repo, branch, path),
    queryFn: () => reposService.getTree({ owner, repo, branch, path }),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
    retry: (count, err) => isRetriable(err) && count < 3,
    enabled: !!owner && !!repo && !!branch,
  });
}
