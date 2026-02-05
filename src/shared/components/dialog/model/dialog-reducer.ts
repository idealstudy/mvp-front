import { DialogAction, DialogState } from '@/shared/components/dialog';

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
