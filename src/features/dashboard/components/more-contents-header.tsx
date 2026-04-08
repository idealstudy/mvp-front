import Link from 'next/link';

import { cn } from '@/shared/lib';
import { ChevronLeft } from 'lucide-react';

interface MoreContentsHeaderPorps {
  isTeacher?: boolean;
  kind?: string;
}

export const MoreContentsHeader = ({
  isTeacher,
  kind,
}: MoreContentsHeaderPorps) => {
  let headerTitle = '';
  switch (kind) {
    case 'QNA':
      headerTitle = isTeacher
        ? '답변이 필요한 질문만 확인해보세요'
        : '답변 받은 질문만 확인해보세요';
    case 'STUDY_NEWS':
      headerTitle = '내 아이의 학습 소식';
    case 'STUDY_CONSULATION':
      headerTitle = '내 아이의 학습 일지';
  }

  return (
    <div
      className={cn(
        'bg-system-background flex flex-col items-center px-4.5',
        'tablet:px-36'
      )}
    >
      <div className="text-gray-8 tablet:h-20 flex h-10 w-full items-end gap-2">
        <Link
          href="/dashboard"
          className="flex items-center"
        >
          <ChevronLeft
            size={20}
            className="tablet:h-5 tablet:w-5 h-4 w-4"
          />
          <span className="font-body2-normal tablet:font-headline2-normal">
            이전으로
          </span>
        </Link>
      </div>
      <div className="tablet:pt-19 tablet:pb-9 tablet:h-[155px] flex h-20 w-full pt-8 pb-4">
        <h1 className="font-headline2-heading tablet:font-title-heading text-gray-12 text-left">
          {headerTitle}
        </h1>
      </div>
    </div>
  );
};
