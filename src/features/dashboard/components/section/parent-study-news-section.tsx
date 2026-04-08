import { useState } from 'react';

import { Skeleton } from '@/shared/components/loading';

import {
  ParentStudyNewsItemData,
  StudyNewsItem,
} from '../section-content/parent-study-news-item';
import DashboardSection from './single-section';
import { StudyRoomDropdown } from './tabbed-section';

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

export const mockStudyNews: ParentStudyNewsItemData[] = [
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

export const StudyNewsSection = () => {
  const isPending = false;

  const studentOptions = mockStudentData.map((student) => ({
    id: Number(student.studentId),
    name: student.studentName,
  }));

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    studentOptions[0]?.id ?? null
  );

  const selectedStudent =
    mockStudentData.find(
      (student) => student.studentId === selectedStudentId
    ) ?? mockStudentData[0];

  return (
    <section>
      <DashboardSection
        title={
          mockStudentData.length === 1
            ? `${selectedStudent?.studentName} 학생의 학습 소식`
            : `학생의 학습 소식`
        }
        isMoreHref="/dashboard/study-news"
        headerAction={
          mockStudentData.length > 1 ? (
            <StudyRoomDropdown
              studyRooms={studentOptions}
              selectedId={selectedStudentId}
              onSelect={setSelectedStudentId}
              student
            />
          ) : null
        }
        count={mockStudyNews.length}
        isMore
        isAll
      >
        {isPending ? (
          <div className="flex w-full flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton.Block
                key={i}
                className="h-12"
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {mockStudyNews.map((item) => (
              <StudyNewsItem
                key={`${item.type}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        )}
      </DashboardSection>
    </section>
  );
};
