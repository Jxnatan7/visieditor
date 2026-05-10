import React from 'react';
import { View, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';
import { Text } from '@ui/Text';
import { useTheme } from '@core/design-system/theme-provider';
import { useCommit } from '../api/use-commit';
import { useWorkspaceStore } from '../../workspace/stores/workspace-store';

const commitSchema = z.object({
  subject: z.string().min(3, 'Min 3 chars').max(72, 'Max 72 chars'),
  body: z.string().max(2000).optional(),
  type: z.enum(['feat', 'fix', 'refactor', 'chore', 'test', 'docs', 'style', 'perf']).optional(),
});

type CommitFormValues = z.infer<typeof commitSchema>;

interface CommitFormProps {
  owner: string;
  repo: string;
  branch: string;
  onSuccess?: () => void;
}

export function CommitForm({ owner, repo, branch, onSuccess }: CommitFormProps) {
  const { spacing } = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<CommitFormValues>({
    resolver: zodResolver(commitSchema),
    defaultValues: { subject: '', type: 'feat' },
  });

  const commit = useCommit();
  const unsavedDrafts = useWorkspaceStore((s) => s.unsavedDrafts);

  const onSubmit = async (data: CommitFormValues) => {
    const files = Object.entries(unsavedDrafts).map(([path, content]) => ({ path, content }));
    if (files.length === 0) return;

    const message = data.type ? `${data.type}: ${data.subject}` : data.subject;
    await commit.mutateAsync({ owner, repo, branch, message: data.body ? `${message}\n\n${data.body}` : message, files });
    onSuccess?.();
  };

  const draftCount = Object.keys(unsavedDrafts).length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <Text variant="title">Commit Changes</Text>
      <Text variant="caption" tone="muted">{draftCount} file{draftCount !== 1 ? 's' : ''} to commit</Text>

      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <Input
            label="Summary"
            placeholder="Brief description of changes"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.subject?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="body"
        render={({ field }) => (
          <Input
            label="Description (optional)"
            placeholder="Detailed explanation..."
            value={field.value}
            onChangeText={field.onChange}
            multiline
            style={{ height: 80 }}
          />
        )}
      />

      <Button
        label={commit.isPending ? 'Committing...' : 'Commit'}
        onPress={handleSubmit(onSubmit)}
        loading={commit.isPending}
        disabled={draftCount === 0}
        fullWidth
      />

      {commit.error ? (
        <Text variant="caption" tone="danger">{(commit.error as Error).message}</Text>
      ) : null}
    </ScrollView>
  );
}
