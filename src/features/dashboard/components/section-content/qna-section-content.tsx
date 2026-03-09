'use client';

import { StudentDashboardQnaListItemDTO } from '@/entities/student';
import { TeacherDashboardQnaListItemDTO } from '@/entities/teacher';
import { Pagination } from '@/shared/components/ui/pagination';

import { QnASectionListItem } from './qna-section-list-item';

export interface QnASectionContentProps {
  questions:
    | TeacherDashboardQnaListItemDTO[]
    | StudentDashboardQnaListItemDTO[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  createButton?: React.ReactNode;
}

const QnASectionContent = ({
  questions,
  page,
  totalPages,
  onPageChange,
  emptyMessage = '질문이 없어요.',
  createButton,
}: QnASectionContentProps) => {
  if (questions.length === 0) {
    return (
      <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
        <p className="font-body2-normal text-gray-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col">
        {createButton}
        <div className="flex w-full flex-col gap-1">
          {questions.map((question) => (
            <QnASectionListItem
              key={question.id}
              question={question}
              isTeacher
            />
          ))}
        </div>
      </div>
      {totalPages != null && totalPages > 1 && onPageChange && (
        <div className="flex justify-center">
          <Pagination
            page={page ?? 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default QnASectionContent;
