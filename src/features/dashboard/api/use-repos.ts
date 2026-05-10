import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reposService } from '@core/api/github/services/repos';
import type { Repo, RepoFilter } from '@core/types/github';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  list: (filter: RepoFilter) => [...dashboardKeys.all, 'list', filter] as const,
};

export function useRepos(filter: RepoFilter) {
  return useQuery<Repo[]>({
    queryKey: dashboardKeys.list(filter),
    queryFn: () => reposService.list(filter),
    staleTime: 1000 * 60 * 2,
  });
}

export function useInvalidateRepos() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: dashboardKeys.all });
}
