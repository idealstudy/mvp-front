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
      '맞아요! 이제 처음 식에 5/3을 곱해서\n계산해보면 답을 구할 수 있어요.\n한 번 직접 풀어볼래요? 😊',
    timestamp: '오후 2:32',
  },
];

export const MOCK_AI_COACH_QUICK_REPLIES = [
  '잘 모르겠어요',
  '더 쉽게요',
  '다음 힌트',
];
