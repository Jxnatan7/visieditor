import { createContext, useContext } from 'react';
import type { Repo } from '@core/types/github';

interface RepoCardContextValue {
  repo: Repo;
  onPress: () => void;
}

export const RepoCardContext = createContext<RepoCardContextValue | null>(null);

export const useRepoCardContext = () => {
  const c = useContext(RepoCardContext);
  if (!c) throw new Error('RepoCard.* must be used inside <RepoCard>');
  return c;
};
