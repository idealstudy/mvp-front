import { useState } from 'react';

import { cn } from '@/shared/lib';

import { ConsultationItem } from '../section-content/parent-consultation-item';
import { StudyRoomDropdown } from '../section/tabbed-section';
import { ParentStudent } from '../types/parent-student';

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

export const StudyConsulationList = ({ data }: { data: ParentStudent[] }) => {
  const studyRoomOptions = data.flatMap((student) =>
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
    <div
      className={cn(
        'bg-gray-white flex flex-1 flex-col items-center gap-3 px-4.5 pt-8 pb-3',
        'tablet:pt-12 tablet:pb-9 tablet:px-36'
      )}
    >
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center gap-2">
          {mockConsultationItems.length > 1 ? (
            <StudyRoomDropdown
              studyRooms={studyRoomOptions}
              selectedId={selectedStudyRoomId}
              onSelect={setSelectedStudyRoomId}
            />
          ) : null}

          <div className="font-body1-heading text-gray-12">
            {mockConsultationItems.length > 1 ? (
              <div className="flex items-center gap-2">
                학생의 학습 소식
                <span className="font-headline1-normal text-orange-7">
                  {mockConsultationItems.length}
                </span>
              </div>
            ) : (
              `${selectedStudyRoom?.name ?? '스터디룸'} ${mockConsultationItems.length}`
            )}
          </div>
        </div>
        {mockConsultationItems.length === 0 ? (
          <div className="flex h-22 w-full items-center justify-center">
            <p className="font-body2-normal text-gray-8">
              아이의 학습 소식이 없어요.
            </p>
          </div>
        ) : (
          <ConsultationItem
            items={mockConsultationItems}
            onSelectItem={() => {}}
          />
        )}
      </div>
    </div>
  );
};
