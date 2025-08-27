export type DialogScope = 'group' | 'studyroom' | 'note';
export type DialogKind = 'rename' | 'group-move' | 'delete' | 'onConfirm';

export type DialogState =
  | { status: 'idle' }
  | {
      status: 'open';
      scope: DialogScope;
      kind: DialogKind;
      payload?: {
        noteId?: string;
        title?: string;
        initialTitle?: string;
        groupId?: string;
      };
    };

export type DialogAction =
  | {
      type: 'OPEN';
      scope: DialogScope;
      kind: DialogKind;
      payload?: {
        noteId?: string;
        title?: string;
        initialTitle?: string;
        groupId?: string;
      };
    }
  | { type: 'GO_TO_CONFIRM' }
  | { type: 'CLOSE' };

export const initialDialogState: DialogState = { status: 'idle' };

export const dialogReducer = (
  state: DialogState,
  action: DialogAction
): DialogState => {
  switch (action.type) {
    case 'OPEN':
      return {
        status: 'open',
        scope: action.scope,
        kind: action.kind,
        payload: action.payload,
      };
    case 'GO_TO_CONFIRM':
      if (state.status !== 'open' || state.kind !== 'delete') return state;
      return { ...state, kind: 'onConfirm' };
    case 'CLOSE':
      return { status: 'idle' };
    default:
      return state;
  }
};
