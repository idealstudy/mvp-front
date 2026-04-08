import { useState } from 'react';

import { Skeleton } from '@/shared/components/loading';

import { ConsultationItem } from '../section-content/parent-consultation-item';
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
export const ConsultationSection = () => {
  const isPending = false;

  const mockConsultationItems = [
    {
      id: 'consultation-1',
      date: '2026.02.30',
      preview:
        '메모 내용이 들어갑니다 메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다',
    },
    {
      id: 'consultation-2',
      date: '2026.02.30',
      preview:
        '메모 내용이 들어갑니다 메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다',
    },
    {
      id: 'consultation-3',
      date: '2026.02.30',
      preview:
        '메모 내용이 들어갑니다 메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다',
    },
    {
      id: 'consultation-4',
      date: '2026.02.30',
      preview:
        '메모 내용이 들어갑니다 메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다메모 내용이 들어갑니다',
    },
  ];
  const limit = mockConsultationItems.slice(0, 3);

  const studyRoomOptions = mockStudentData.flatMap((student) =>
    student.studyRooms.map((studyRoom) => ({
      id: studyRoom.studyRoomId,
      name: studyRoom.studyRoomName,
    }))
  );

  const [selectedStudyRoomId, setSelectedStudyRoomId] = useState<number | null>(
    studyRoomOptions[0]?.id ?? null
  );

  const selectedStudyRoom = studyRoomOptions.find(
    (studyRoom) => studyRoom.id === selectedStudyRoomId
  );

  return (
    <section>
      <DashboardSection
        title={`${selectedStudyRoom?.name ?? '스터디룸'} 학습 일지`}
        headerAction={
          <StudyRoomDropdown
            studyRooms={studyRoomOptions}
            selectedId={selectedStudyRoomId}
            onSelect={setSelectedStudyRoomId}
          />
        }
        description="선생님이 직접 작성한 학습일지예요"
        count={mockConsultationItems.length}
        isMoreHref="/dashboard/study-consulation"
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
          <ConsultationItem
            items={limit}
            onSelectItem={() => {}}
          />
        )}
      </DashboardSection>
    </section>
  );
};
