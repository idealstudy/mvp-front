'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  useStudentDashboardQnaListQuery,
  useTeacherDashboardQnaListQuery,
} from '@/features/dashboard/hooks/use-dashboard-query';
import { Pagination } from '@/shared/components/ui';
import { PRIVATE } from '@/shared/constants';
import { cn } from '@/shared/lib';

export const QnAList = ({ isTeacher }: { isTeacher: boolean }) => {
  const [page, setPage] = useState(0);

  const teacherQuery = useTeacherDashboardQnaListQuery({
    page,
    size: 10,
    sortKey: 'LATEST',
    enabled: isTeacher,
  });
  const studentQuery = useStudentDashboardQnaListQuery({
    page,
    size: 10,
    sortKey: 'LATEST',
    enabled: !isTeacher,
  });

  const data = isTeacher ? teacherQuery.data : studentQuery.data;
  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div
      className={cn(
        'bg-gray-white flex flex-1 flex-col items-center gap-3 px-4.5 pt-8 pb-3',
        'tablet:pt-12 tablet:pb-9 tablet:px-36'
      )}
    >
      <div className="flex w-full flex-col gap-8">
        {items.length === 0 ? (
          <div className="flex h-22 w-full items-center justify-center">
            <p className="font-body2-normal text-gray-8">
              {isTeacher
                ? '답변이 필요한 질문이 없어요.'
                : '답변 받은 질문이 없어요.'}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={PRIVATE.QUESTIONS.DETAIL(item.studyRoomId, item.id)}
              className="border-gray-3 flex w-full flex-col gap-1 border-b pb-8"
            >
              <div className="flex items-center gap-2">
                <span className="font-label-heading text-orange-7">
                  {item.studyRoomName}
                </span>
                {item.studentName && (
                  <>
                    <span className="text-gray-4">·</span>
                    <span className="font-label-normal text-gray-7">
                      {item.studentName}
                    </span>
                  </>
                )}
              </div>
              <p className="font-body1-heading text-gray-12 line-clamp-1">
                {item.title}
              </p>
              <p className="font-body2-normal text-gray-7 line-clamp-2">
                {item.contentPreview}
              </p>
            </Link>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
