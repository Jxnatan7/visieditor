import { FileRow as Root } from './FileRow';
import { FileRowIcon } from './FileRow.Icon';
import { FileRowName } from './FileRow.Name';
import { FileRowMeta } from './FileRow.Meta';
import { FileRowStatus } from './FileRow.Status';

export const FileRow = Object.assign(Root, {
  Icon: FileRowIcon,
  Name: FileRowName,
  Meta: FileRowMeta,
  Status: FileRowStatus,
});
