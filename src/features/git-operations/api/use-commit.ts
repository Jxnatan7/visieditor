import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reposService } from '@core/api/github/services/repos';
import { workspaceKeys } from '../../workspace/api/use-tree';
import { useWorkspaceStore } from '../../workspace/stores/workspace-store';
import { eventBus } from '@core/events/event-bus';

interface CommitArgs {
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: Array<{ path: string; content: string }>;
}

export function useCommit() {
  const qc = useQueryClient();
  const clearDraft = useWorkspaceStore((s) => s.clearDraft);

  return useMutation({
    mutationFn: (args: CommitArgs) =>
      reposService.commit({
        owner: args.owner,
        repo: args.repo,
        branch: args.branch,
        message: args.message,
        files: args.files,
      }),
    onSuccess: (result, args) => {
      args.files.forEach((f) => {
        clearDraft(f.path);
        qc.invalidateQueries({ queryKey: workspaceKeys.fileContent(args.owner, args.repo, args.branch, f.path) });
      });
      qc.invalidateQueries({ queryKey: workspaceKeys.tree(args.owner, args.repo, args.branch, '') });
      eventBus.emit('workspace:commit-success', { sha: result.sha });
    },
  });
}
