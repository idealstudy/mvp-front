import { ParentStudyNewsItemData } from '@/features/dashboard/components/section-content/parent-study-news-item';
import { StudyNews } from '@/features/dashboard/components/study-news';

const mockStudentData = [
  {
    studentId: 101,
    studentName: '김학생',
    studyRooms: [
      {
        studyRoomId: 1001,
        studyRoomName: '스터디룸',
      },
    ],
  },
  {
    studentId: 102,
    studentName: '이학생',
    studyRooms: [
      {
        studyRoomId: 2001,
        studyRoomName: '스터디룸',
      },
      {
        studyRoomId: 2002,
        studyRoomName: '스터디룸2',
      },
    ],
  },
];

const mockStudyNews: ParentStudyNewsItemData[] = [
  {
    type: 'TEACHING_NOTE',
    id: 45,
    title: '삼각함수 핵심정리',
    regDate: '2026-04-05T14:00:00',
    teacherName: '김수학',
    studyRoomName: '수학 심화반',
  },
  {
    type: 'HOMEWORK',
    id: 12,
    title: '미적분 Chapter3 풀어오기',
    regDate: '2026-04-05T18:30:00',
    teacherName: '김수학',
    studyRoomName: '수학 심화반',
    deadline: '2026-04-10T23:59:59',
    deadlineLabel: 'UPCOMING',
    dday: 4,
  },
  {
    type: 'QNA',
    id: 78,
    title: '3번 문제 질문이요',
    regDate: '2026-04-04T09:15:00',
    teacherName: '김수학',
    studyRoomName: '수학 심화반',
    status: 'COMPLETED',
  },
  {
    type: 'HOMEWORK',
    id: 13,
    title: '확률과 통계 단원평가 준비하기',
    regDate: '2026-04-03T13:20:00',
    teacherName: '김수학',
    studyRoomName: '수학 심화반',
    deadline: '2026-04-08T23:59:59',
    deadlineLabel: 'UPCOMING',
    dday: 2,
  },
  {
    type: 'QNA',
    id: 79,
    title: '로그 계산에서 밑 변환이 헷갈려요',
    regDate: '2026-04-02T16:45:00',
    teacherName: '김수학',
    studyRoomName: '수학 심화반',
    status: 'COMPLETED',
  },
];

export default function StudyNewsPage() {
  return (
    <StudyNews
      data={mockStudentData}
      studyNewsData={mockStudyNews}
    />
  );
}
