export type ChallengeDetailMock = {
  id: string;
  subject: string;
  topic: string;
  questionNumber: number;
  questionText: string;
  questionImageUrl: string | null;
  choices: string[];
  passRate: number;
  wrongAnswerRate: number;
};

export const MOCK_CHALLENGE_DETAIL: ChallengeDetailMock = {
  id: '1',
  subject: '수학',
  topic: '분수의 나눗셈',
  questionNumber: 1,
  questionText: '2/3 ÷ 3/5 의 계산 결과는?',
  questionImageUrl: null,
  choices: ['4/15', '2/5', '10/9', '5/6'],
  passRate: 37,
  wrongAnswerRate: 63,
};
