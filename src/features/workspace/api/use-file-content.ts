import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { reposService } from '@core/api/github/services/repos';
import { workspaceKeys } from './use-tree';
import { useWorkspaceStore } from '../stores/workspace-store';

interface UseFileContentOptions {
  enabled?: boolean;
}

export function useFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  options: UseFileContentOptions = {},
) {
  return useQuery({
    queryKey: workspaceKeys.fileContent(owner, repo, branch, path),
    queryFn: () => reposService.getFileContent({ owner, repo, path, ref: branch }),
    staleTime: 1000 * 60 * 5,
    enabled: (options.enabled ?? true) && !!path,
  });
}

export function useSaveFile(owner: string, repo: string, branch: string, path: string) {
  const qc = useQueryClient();
  const setDraft = useWorkspaceStore((s) => s.setDraft);
  const key = workspaceKeys.fileContent(owner, repo, branch, path);

  return useMutation({
    mutationFn: async (content: string) => {
      setDraft(path, content);
      return content;
    },
    onMutate: async (content) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old: unknown) =>
        old ? { ...(old as object), content } : { content, sha: '', encoding: 'utf-8' },
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
  });
}
