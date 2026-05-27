import { type ChallengeCardData } from '../components/list/challenge-card';

export const MOCK_STREAK = {
  streakDays: 3,
  todayCompleted: true,
};

export const MOCK_CHALLENGES: ChallengeCardData[] = [
  {
    id: '1',
    subject: 'MATH',
    title: '함수의 극한, 이 조건에서 수렴할까?',
    sourceText: '고등 수학 (상) · 함수의 극한',
    questionImageUrl: null,
    passRate: 37,
    participantCount: 1248,
  },
  {
    id: '2',
    subject: 'KOREAN',
    title: '서술 방식 파악, 이 문장의 핵심은?',
    sourceText: '고등 국어 · 문학',
    questionImageUrl: null,
    passRate: 42,
    participantCount: 956,
  },
  {
    id: '3',
    subject: 'MATH',
    title: '도형의 성질, 숨겨진 조건을 찾아라',
    sourceText: '고등 수학 (하) · 도형의 방정식',
    questionImageUrl: null,
    passRate: 28,
    participantCount: 732,
  },
  {
    id: '4',
    subject: 'ENGLISH',
    title: '빈칸 추론, 문맥의 흐름을 읽어라',
    sourceText: '고등 영어 · 빈칸 추론',
    questionImageUrl: null,
    passRate: 51,
    participantCount: 2104,
  },
  {
    id: '5',
    subject: 'SCIENCE',
    title: '전기력과 자기력의 관계를 밝혀라',
    sourceText: '고등 물리학 Ⅰ · 전기와 자기',
    questionImageUrl: null,
    passRate: 19,
    participantCount: 341,
  },
  {
    id: '6',
    subject: 'MATH',
    title: '수열의 합, 이 점화식의 일반항은?',
    sourceText: '고등 수학 (상) · 수열',
    questionImageUrl: null,
    passRate: 33,
    participantCount: 867,
  },
];
