'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib';
import { ChevronRight } from 'lucide-react';

type Props = {
  studentName?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  isMore?: boolean;
  isMoreHref?: string;
  isMoreDescription?: string;
  headerAction?: React.ReactNode;
  count?: number;
  onMoreClick?: () => void;
};

const DashboardSection = ({
  studentName,
  title,
  description,
  children,
  className,
  isMore = false,
  isMoreHref = '',
  isMoreDescription = '',
  headerAction,
  count,
  onMoreClick,
}: Props) => {
  return (
    <div
      className={cn('flex w-full flex-col gap-6', 'tablet:gap-8', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              'font-body1-heading tablet:font-headline1-heading text-gray-12'
            )}
          >
            <div className="flex items-center gap-2">
              {studentName && (
                <h1 className="font-body1-heading tablet:font-headline1-heading text-gray-12">
                  {studentName} 학생의
                </h1>
              )}
              {headerAction}
              <h1 className="font-body1-heading tablet:font-headline1-heading text-gray-12">
                {title}
              </h1>
              <span className="font-headline1-normal text-orange-7">
                {count}
              </span>
            </div>
          </div>
          {description && (
            <p
              className={cn(
                'font-label-normal tablet:font-body2-normal text-gray-11 tablet:text-gray-10'
              )}
            >
              {description}
            </p>
          )}
        </div>
        {isMore && (
          <Link
            href={isMoreHref}
            className="text-gray-8 flex gap-1"
            onClick={onMoreClick}
          >
            <span className="font-body2-heading">
              {isMoreDescription ? isMoreDescription : '더보기'}
            </span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

export default DashboardSection;
