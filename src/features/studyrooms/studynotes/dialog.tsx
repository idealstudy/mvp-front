import type { DialogAction, DialogState } from '../hook/dialog-reducer';
import { DeleteDialog } from './dialog/delete-dialog';
import { GroupMoveDialog } from './dialog/group-move-dialog';
import { OnConfirmDialog } from './dialog/on-confirm-dialog';
import { RenameDialog } from './dialog/rename-dialog';

export const StudyNotesDialog = ({
  state,
  dispatch,
}: {
  state: DialogState;
  dispatch: (action: DialogAction) => void;
}) => {
  return (
    <>
      {state.type === 'rename' && (
        <RenameDialog
          open
          state={state}
          dispatch={dispatch}
        />
      )}

      {state.type === 'group-move' && (
        <GroupMoveDialog
          open
          dispatch={dispatch}
        />
      )}

      {state.type === 'delete' && (
        <DeleteDialog
          open
          onCancel={() => dispatch({ type: 'CLOSE' })}
          onConfirm={() => dispatch({ type: 'GO_TO_CONFIRM' })}
          onOpenChange={(open) => !open && dispatch({ type: 'CLOSE' })}
        />
      )}

      {state.type === 'onConfirm' && (
        <OnConfirmDialog
          open
          dispatch={dispatch}
        />
      )}
    </>
  );
};
