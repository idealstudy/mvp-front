'use client';

import type {
  ParentDashboardConnectedStudentListDTO,
  ParentDashboardStudyNewsListDTO,
} from '@/entities/parent';
import { Skeleton } from '@/shared/components/loading';
import { Pagination } from '@/shared/components/ui';
import { cn } from '@/shared/lib';

import { StudyNewsItem } from '../section-content/parent-study-news-item';
import { StudyRoomDropdown } from '../section/tabbed-section';

export const StudyNewsList = ({
  connectedStudentData,
  studyNewsData,
  studyNewsPending,
  selectedStudentId,
  setSelectedStudentId,
  page,
  onPageChange,
}: {
  connectedStudentData: ParentDashboardConnectedStudentListDTO;
  studyNewsData: ParentDashboardStudyNewsListDTO;
  studyNewsPending: boolean;
  selectedStudentId: number | null;
  setSelectedStudentId: (id: number | null) => void;
  page: number;
  onPageChange: (page: number) => void;
}) => {
  const studentOptions = connectedStudentData.map((student) => ({
    id: student.studentId,
    name: student.studentName,
  }));

  const selectedStudent = connectedStudentData.find(
    (student) => student.studentId === selectedStudentId
  );
  return (
    <div
      className={cn(
        'bg-gray-white flex flex-1 flex-col items-center gap-3 px-4.5 pt-8 pb-3',
        'tablet:px-36 tablet:pt-12 tablet:pb-9'
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

          <div className="font-body1-heading text-gray-12">
            {studyNewsData.content.length > 1 ? (
              <div className="flex items-center gap-2">
                학생별 학습 소식
                <span className="font-headline1-normal text-orange-7">
                  {studyNewsData.totalElements}
                </span>
              </div>
            ) : (
              `${selectedStudent?.studentName ?? '-'} 학생의 학습 소식 ${studyNewsData.totalElements}`
            )}
          </div>
        </div>

        {studyNewsPending ? (
          <div className="flex w-full flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton.Block
                key={i}
                className="h-12"
              />
            ))}
          </div>
        ) : studyNewsData.content.length === 0 ? (
          <div className="flex h-22 w-full items-center justify-center">
            <p className="font-body2-normal text-gray-8">
              학생의 학습 소식이 없어요.
            </p>
          </div>
        ) : (
          <>
            {studyNewsData.content.map((item) => (
              <StudyNewsItem
                key={`${item.type}-${item.id}`}
                data={item}
                selectedStudentId={selectedStudentId}
              />
            ))}
          </>
        )}
      </div>
      {studyNewsData.totalPages && (
        <Pagination
          page={page}
          onPageChange={onPageChange}
          totalPages={studyNewsData.totalPages}
        />
      )}
    </div>
  );
};
