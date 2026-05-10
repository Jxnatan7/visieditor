import { RepoCard as Root } from './RepoCard';
import { RepoCardHeader } from './RepoCard.Header';
import { RepoCardMeta } from './RepoCard.Meta';
import { RepoCardLocalChangesBadge } from './RepoCard.LocalChangesBadge';

export const RepoCard = Object.assign(Root, {
  Header: RepoCardHeader,
  Meta: RepoCardMeta,
  LocalChangesBadge: RepoCardLocalChangesBadge,
});
