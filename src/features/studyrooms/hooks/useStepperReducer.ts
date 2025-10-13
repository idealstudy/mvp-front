import { Step } from '@/features/studyrooms/components/create/CreateStudyRoomFlow';

/**
 * order - 스텝 순서
 * index - 현재 인덱스
 * maxValidatedIndex - 검증 통과한 최댓값(점프 허용 경계)
 **/
export type StepState = {
  order: Step[];
  index: number;
  maxValidatedIndex: number;
};

export type StepAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO'; to: Step | number }
  | { type: 'MARK_VALIDATED'; upTo: number }
  | { type: 'RESET' };

export const createStepState = (
  order: Step[],
  initial?: Partial<StepState>
): StepState => {
  return {
    order,
    index: 0,
    maxValidatedIndex: 0,
    ...initial,
  };
};

export const stepperReducer = (
  state: StepState,
  action: StepAction
): StepState => {
  const clamp = (n: number) => Math.max(0, Math.min(n, state.order.length - 1));
  const toIndex = (to: Step | number) =>
    typeof to === 'number' ? clamp(to) : clamp(state.order.indexOf(to));

  switch (action.type) {
    case 'NEXT': {
      const next = clamp(state.index + 1);
      return { ...state, index: next };
    }
    case 'PREV': {
      const prev = clamp(state.index - 1);
      return { ...state, index: prev };
    }
    case 'GO': {
      // 앞으로 건너뛰기는 maxValidatedIndex까지 허용
      const target = toIndex(action.to);
      if (target <= state.maxValidatedIndex) {
        return { ...state, index: target };
      }
      // 허용 범위를 넘기면 무시(또는 index를 maxValidatedIndex로 보정하고 싶다면 아래처럼)
      // return { ...state, index: state.maxValidatedIndex };
      return state;
    }
    case 'MARK_VALIDATED': {
      // 검증 범위는 증가만 허용
      const upTo = clamp(action.upTo);
      if (upTo > state.maxValidatedIndex) {
        return { ...state, maxValidatedIndex: upTo };
      }
      return state;
    }
    case 'RESET':
      return { ...state, index: 0, maxValidatedIndex: 0 };
  }
};
