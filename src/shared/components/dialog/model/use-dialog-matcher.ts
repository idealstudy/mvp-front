import { useCallback } from 'react';

import {
  DialogKind,
  DialogScope,
  DialogState,
} from '@/shared/components/dialog';

export const isDialogMatching = (
  dialog: DialogState,
  scope?: DialogScope,
  kind?: DialogKind
): boolean => {
  if (dialog.status !== 'open') return false;
  if (scope && dialog.scope !== scope) return false;
  return !(kind && dialog.kind !== kind);
};

export const useDialogMatcher = (dialog: DialogState) => {
  return useCallback(
    (scope?: DialogScope, kind?: DialogKind) =>
      isDialogMatching(dialog, scope, kind),
    [dialog]
  );
};
