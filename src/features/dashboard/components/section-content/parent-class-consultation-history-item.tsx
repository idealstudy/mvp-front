'use client';

import { useState } from 'react';

import { Pagination, StatusBadge } from '@/shared/components/ui';
import { formatDateDot } from '@/shared/lib';
import { Check } from 'lucide-react';

export type ClassConsultationHistoryItemType = {
  id: number;
  teacherId: number;
  teacherName: string;
  title: string;
  status: 'PENDING' | 'COMPLETED';
  regDate: string;
};

interface ClassConsultationHistoryItemProps {
  content: ClassConsultationHistoryItemType[];
}

export const ClassConsultationHistoryItem = ({
  content,
}: ClassConsultationHistoryItemProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(content.length / pageSize);
  const pagedContent = content.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="border-line-line1 overflow-hidden rounded-2xl border">
      <div className="bg-gray-1 grid grid-cols-[minmax(0,1.8fr)_140px_140px_140px] gap-4 px-6 py-5">
        <span className="font-body2-heading text-gray-12">문의 내용</span>
        <span className="font-body2-heading text-gray-12">답변 상태</span>
        <span className="font-body2-heading text-gray-12">문의 날짜</span>
        <span className="font-body2-heading text-gray-12">문의 대상</span>
      </div>

      <div className="divide-line-line1 divide-y">
        {pagedContent.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1.8fr)_140px_140px_140px] items-center gap-4 px-6 py-5"
          >
            <p className="font-label-normal text-gray-11 truncate">
              {item.title}
            </p>

            <div>
              {item.status === 'COMPLETED' ? (
                <span className="bg-system-success-alt text-system-success font-caption-heading inline-flex items-center gap-1 rounded-md px-3 py-2">
                  답변 완료
                  <Check
                    className="h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                  />
                </span>
              ) : (
                <StatusBadge
                  variant="primary"
                  label="답변 대기 중"
                  className="font-caption-heading rounded-md px-3 py-2"
                />
              )}
            </div>

            <span className="font-label-normal text-gray-11">
              {formatDateDot(item.regDate)}
            </span>

            <span className="font-label-normal text-gray-11">
              {item.teacherName} 선생님
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 py-6">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
