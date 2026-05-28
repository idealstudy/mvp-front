export type AiCoachProgressStep = 'concept' | 'approach' | 'hint' | 'final';

export type AiCoachMessageTemplate = {
  step: AiCoachProgressStep;
  title: string;
  content: string;
};

export const MOCK_AI_COACH_INITIAL_MESSAGE =
  '좋아요. 정답을 바로 고르기보다, 먼저 문제에서 무엇을 묻는지 같이 정리해볼게요.';

export const MOCK_AI_COACH_MESSAGES = [
  {
    id: '1',
    role: 'ai',
    content:
      "분수의 나눗셈에서 '나누는 수의 역수를 곱한다'는 원리를 기억하고 있나요?\n이 문제도 이 원리를 적용하면 풀 수 있어요.",
    timestamp: '오후 2:30',
  },
  {
    id: '2',
    role: 'user',
    content: '네! 그런데 계산 과정이 헷갈려요.',
    timestamp: '오후 2:31',
  },
  {
    id: '3',
    role: 'ai',
    content:
      '좋아요! 그럼 숫자를 대입해서\n차근차근 계산해볼까요?\n어떤 수를 곱해야 할지 먼저 생각해봐요.',
    timestamp: '오후 2:31',
  },
  {
    id: '4',
    role: 'user',
    content: '나누는 수의 역수니까...\n3/5의 역수는 5/3이요!',
    timestamp: '오후 2:32',
  },
  {
    id: '5',
    role: 'ai',
    content:
      '맞아요! 이제 처음 식에 5/3을 곱해서\n계산해보면 답을 구할 수 있어요.\n한 번 직접 풀어볼래요?',
    timestamp: '오후 2:32',
  },
];

export const MOCK_AI_COACH_PROGRESS_MESSAGES: AiCoachMessageTemplate[] = [
  {
    step: 'concept',
    title: '개념 이해',
    content:
      '분수의 나눗셈은 나누는 수를 그대로 쓰지 않고, 그 수의 역수를 곱하는 흐름으로 바꿔서 생각해요.\n이 문제에서 나누는 수는 어떤 분수인가요?',
  },
  {
    step: 'approach',
    title: '접근 방향',
    content:
      '좋아요. 이제 3/5의 역수를 떠올려볼 차례예요.\n분자와 분모를 서로 바꾸면 어떤 분수가 될까요?',
  },
  {
    step: 'hint',
    title: '풀이 힌트',
    content:
      '방향이 좋아요. 이제 2/3에 방금 만든 역수를 곱해보면 돼요.\n분자는 분자끼리, 분모는 분모끼리 곱해서 식을 한 줄로 써볼까요?',
  },
  {
    step: 'final',
    title: '답 직전 힌트',
    content:
      '이제 계산만 남았어요. 나온 분수가 선택지 중 어디에 있는지 직접 비교해보세요.\n문제로 돌아가서 답을 골라볼까요?',
  },
];

export const MOCK_AI_COACH_STUCK_MESSAGE =
  '괜찮아요. 더 작게 쪼개서 볼게요.\n나눗셈을 곱셈으로 바꿀 때는 "뒤 분수를 뒤집는다"는 한 가지만 먼저 기억해보세요.';

export const MOCK_AI_COACH_QUICK_REPLIES = [
  '잘 모르겠어요',
  '더 쉽게요',
  '다음 힌트',
];
