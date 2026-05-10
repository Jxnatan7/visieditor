import React from 'react';
import { Badge } from '@ui/Badge';
import { useRepoCardContext } from './context';

export function RepoCardLocalChangesBadge() {
  const { repo } = useRepoCardContext();
  if (!repo.localChanges || repo.localChanges === 0) return null;

  return <Badge label={`${repo.localChanges} changes`} tone="warning" />;
}
