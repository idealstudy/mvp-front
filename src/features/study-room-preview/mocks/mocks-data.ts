// api 생기면 삭제

export const mockStudyRoomDetail: StudyRoomDetail = {
  id: 1,
  name: '상위권을 위한 국어논술 스터디',
  introduction: {
    description:
      '200자 분량의 장문형 기출문, 상위권 내신과 정시를 준비하는 스터디입니다. 독해력과 논리력을 동시에 강화하며 매주 피드백을 통해 글쓰기 실력을 체계적으로 향상시킵니다.',
  },
  operationInfo: {
    subject: '수학',
    target: '고등학교 1학년 ~ 3학년',
    classSize: '온라인 · 최대 6명',
  },
  reviewSummary: {
    totalCount: 21,
    averageRating: 4.8,
    gradeDistribution: {
      '4학년': 9,
      '5학년': 5,
      '6학년': 7,
    },
  },
  reviews: [
    {
      id: 101,
      author: {
        name: '김지우',
        grade: '2학년',
        profileImage: '/mock/profile1.png',
      },
      createdAt: '2023-02-01',
      content:
        '200자 분량의 장문형 기출문, 상위권 내신과 정시를 준비하는 스터디로서 체계적인 첨삭과 피드백이 정말 도움이 되었습니다. 글의 구조를 잡는 방법을 배울 수 있었어요.',
      helpfulCount: 12,
    },
    {
      id: 102,
      author: {
        name: '김지현',
        grade: '3학년',
        profileImage: '/mock/profile2.png',
      },
      createdAt: '2023-03-15',
      content:
        '매주 과제를 통해 꾸준히 연습할 수 있었고, 첨삭이 구체적이라 실력이 확실히 늘었습니다. 상위권을 목표로 하는 학생에게 추천합니다.',
      helpfulCount: 8,
    },
    {
      id: 103,
      author: {
        name: '이현수',
        grade: '6학년',
        profileImage: '/mock/profile3.png',
      },
      createdAt: '2023-05-10',
      content:
        '정시 대비 논술 준비에 큰 도움이 되었습니다. 특히 논리 전개 방식과 결론 정리 부분에서 많은 피드백을 받았습니다.',
      helpfulCount: 5,
    },
    {
      id: 104,
      author: {
        name: '댕댕댕',
        grade: '6학년',
        profileImage: '/mock/profile3.png',
      },
      createdAt: '2023-05-10',
      content:
        '정시 대비 논술 준비에 큰 도움이 되었습니다. 특히 논리 전개 방식과 결론 정리 부분에서 많은 피드백을 받았습니다.',
      helpfulCount: 5,
    },
    {
      id: 105,
      author: {
        name: '김지현',
        grade: '3학년',
        profileImage: '/mock/profile2.png',
      },
      createdAt: '2023-03-15',
      content:
        '매주 과제를 통해 꾸준히 연습할 수 있었고, 첨삭이 구체적이라 실력이 확실히 늘었습니다. 상위권을 목표로 하는 학생에게 추천합니다.',
      helpfulCount: 8,
    },
    {
      id: 106,
      author: {
        name: '김지현',
        grade: '3학년',
        profileImage: '/mock/profile2.png',
      },
      createdAt: '2023-03-15',
      content:
        '매주 과제를 통해 꾸준히 연습할 수 있었고, 첨삭이 구체적이라 실력이 확실히 늘었습니다. 상위권을 목표로 하는 학생에게 추천합니다.',
      helpfulCount: 8,
    },
    {
      id: 107,
      author: {
        name: '김지현',
        grade: '3학년',
        profileImage: '/mock/profile2.png',
      },
      createdAt: '2023-03-15',
      content:
        '매주 과제를 통해 꾸준히 연습할 수 있었고, 첨삭이 구체적이라 실력이 확실히 늘었습니다. 상위권을 목표로 하는 학생에게 추천합니다.',
      helpfulCount: 8,
    },
    {
      id: 108,
      author: {
        name: '김지현',
        grade: '3학년',
        profileImage: '/mock/profile2.png',
      },
      createdAt: '2023-03-15',
      content:
        '매주 과제를 통해 꾸준히 연습할 수 있었고, 첨삭이 구체적이라 실력이 확실히 늘었습니다. 상위권을 목표로 하는 학생에게 추천합니다.',
      helpfulCount: 8,
    },
  ],
};

export interface StudyRoomDetail {
  id: number;
  name: string;
  introduction: {
    description: string;
  };
  operationInfo: {
    subject: string;
    target: string;
    classSize: string;
  };
  reviewSummary: {
    totalCount: number;
    averageRating: number;
    gradeDistribution: Record<string, number>;
  };
  reviews: ReviewItem[];
}

export interface ReviewItem {
  id: number;
  author: {
    name: string;
    grade: string;
    profileImage: string;
  };
  createdAt: string;
  content: string;
  helpfulCount: number;
}
