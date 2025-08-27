// dialogMachine.ts
export type DialogState =
  | { type: 'idle' }
  | { type: 'rename'; initialTitle: string }
  | { type: 'group-move' }
  | { type: 'delete'; noteId: string; title: string }
  | { type: 'onConfirm'; noteId: string; title: string };

export type DialogAction =
  | { type: 'OPEN_RENAME'; initialTitle: string }
  | { type: 'OPEN_GROUP_MOVE' }
  | { type: 'OPEN_DELETE'; noteId: string; title: string }
  | { type: 'GO_TO_CONFIRM' }
  | { type: 'CLOSE' };

export const initialDialogState: DialogState = { type: 'idle' };

export function dialogReducer(
  state: DialogState,
  action: DialogAction
): DialogState {
  switch (action.type) {
    case 'OPEN_RENAME':
      return { type: 'rename', initialTitle: action.initialTitle };
    case 'OPEN_GROUP_MOVE':
      return { type: 'group-move' };
    case 'OPEN_DELETE':
      return { type: 'delete', noteId: action.noteId, title: action.title };
    case 'GO_TO_CONFIRM':
      if (state.type !== 'delete') return state; // 안전장치
      return { type: 'onConfirm', noteId: state.noteId, title: state.title };
    case 'CLOSE':
      return { type: 'idle' };
    default:
      return state;
  }
}
