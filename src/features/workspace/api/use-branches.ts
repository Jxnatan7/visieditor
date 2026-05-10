import { useQuery } from '@tanstack/react-query';
import { reposService } from '@core/api/github/services/repos';
import { workspaceKeys } from './use-tree';

export function useBranches(owner: string, repo: string) {
  return useQuery({
    queryKey: workspaceKeys.branches(owner, repo),
    queryFn: () => reposService.listBranches(owner, repo),
    staleTime: 1000 * 60 * 5,
  });
}
