'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib';

import {
  ParentStudyNewsItemData,
  StudyNewsItem,
} from '../section-content/parent-study-news-item';
import { StudyRoomDropdown } from '../section/tabbed-section';
import { ParentStudent } from '../types/parent-student';

export const StudyNewsList = ({
  data,
  studyNewsData,
}: {
  data: ParentStudent[];
  studyNewsData: ParentStudyNewsItemData[];
}) => {
  const studentOptions = data.map((student) => ({
    id: student.studentId,
    name: student.studentName,
  }));

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    studentOptions[0]?.id ?? null
  );

  const selectedStudent = data.find(
    (student) => student.studentId === selectedStudentId
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
          {studentOptions.length > 1 ? (
            <StudyRoomDropdown
              studyRooms={studentOptions}
              selectedId={selectedStudentId}
              onSelect={setSelectedStudentId}
              student
            />
          ) : null}

          <p className="font-body1-heading text-gray-12">
            {studyNewsData.length > 1 ? (
              <>
                학생의 학습 소식
                <span className="font-headline1-normal text-orange-7">
                  {studyNewsData.length}
                </span>
              </>
            ) : (
              `${selectedStudent?.studentName}학생의 학습 소식 ${studyNewsData.length}`
            )}
          </p>
        </div>
        {studyNewsData.length === 0 ? (
          <div className="flex h-22 w-full items-center justify-center">
            <p className="font-body2-normal text-gray-8">
              아이의 학습 소식이 없어요.
            </p>
          </div>
        ) : (
          <>
            {studyNewsData.map((item) => (
              <StudyNewsItem
                key={`${item.type}-${item.id}`}
                item={item}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
