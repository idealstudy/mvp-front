import type {
  DialogAction,
  DialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import type { StudyNoteGroupPageable } from '../type';
import { DeleteDialog } from './delete-dialog';
import { GroupMoveDialog } from './group-move-dialog';
import { OnConfirmDialog } from './on-confirm-dialog';
import { RenameDialog } from './rename-dialog';

export const StudyNotesDialog = ({
  state,
  dispatch,
  studyRoomId,
  studyNoteId,
  pageable,
  keyword,
}: {
  state: DialogState;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  studyNoteId: number;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  if (state.status !== 'open') return null;

  return (
    <>
      {state.scope === 'note' && state.kind === 'rename' && (
        <RenameDialog
          open
          state={state}
          dispatch={dispatch}
          studyNoteId={studyNoteId}
        />
      )}

      {state.scope === 'note' && state.kind === 'group-move' && (
        <GroupMoveDialog
          open
          dispatch={dispatch}
          studyRoomId={studyRoomId}
          studyNoteId={studyNoteId}
          pageable={pageable}
          keyword={keyword}
        />
      )}

      {state.scope === 'note' && state.kind === 'delete' && (
        <DeleteDialog
          open
          onCancel={() => dispatch({ type: 'CLOSE' })}
          onConfirm={() => dispatch({ type: 'GO_TO_CONFIRM' })}
          onOpenChange={(open) => !open && dispatch({ type: 'CLOSE' })}
        />
      )}

      {state.scope === 'note' && state.kind === 'onConfirm' && (
        <OnConfirmDialog
          open
          dispatch={dispatch}
        />
      )}
    </>
  );
};
