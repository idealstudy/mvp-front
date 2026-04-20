import Link from 'next/link';

import { ParentDashboardStudyNewsItemDTO } from '@/entities/parent';
import { StatusBadge } from '@/shared/components/ui';
import { cn, formatDateDot } from '@/shared/lib';
import {
  Check,
  ChevronRight,
  File,
  MessageCircleQuestionMark,
  PencilLine,
} from 'lucide-react';

type ParentStudyNewsType = 'HOMEWORK' | 'TEACHING_NOTE' | 'QNA';
type ParentStudyNewsDeadlineLabel = 'UPCOMING' | 'TODAY' | 'OVERDUE';

interface StudyNewsItemProps {
  data: ParentDashboardStudyNewsItemDTO;
}

const formatHomeworkDeadlineLabel = (
  label?: ParentStudyNewsDeadlineLabel,
  dday?: number
) => {
  if (label === 'TODAY') return 'D-day';
  if (label === 'OVERDUE') return '마감';
  if (typeof dday === 'number') return `D-${dday}`;
  return '';
};

const getTypeIcon = (type: ParentStudyNewsType) => {
  const iconClassName = 'h-5 w-5 shrink-0 text-gray-12';

  switch (type) {
    case 'HOMEWORK':
      return (
        <PencilLine
          size={36}
          className={iconClassName}
          strokeWidth={1.8}
        />
      );
    case 'QNA':
      return (
        <MessageCircleQuestionMark
          size={36}
          className={iconClassName}
          strokeWidth={1.8}
        />
      );
    case 'TEACHING_NOTE':
    default:
      return (
        <File
          size={36}
          className={iconClassName}
          strokeWidth={1.8}
        />
      );
  }
};

export const StudyNewsItem = ({ data }: StudyNewsItemProps) => {
  const isHomework = data.type === 'HOMEWORK';
  const isQna = data.type === 'QNA';

  let hrefLink = '';

  switch (data.type) {
    case 'HOMEWORK':
      hrefLink = `/study-rooms/${data.studyRoomId}/homework/${data.id}`;
      break;
    case 'QNA':
      hrefLink = `/study-rooms/${data.studyRoomId}/qna/${data.id}`;
      break;
    case 'TEACHING_NOTE':
      hrefLink = `/study-rooms/${data.studyRoomId}/note/${data.id}`;
      break;
  }

  const metaPrefix =
    isHomework || isQna ? undefined : data.studyRoomName || undefined;
  const metaText = `${formatDateDot(data.regDate)} 작성 · ${data.teacherName} 선생님`;
  const homeworkDeadlineLabel =
    data.type === 'HOMEWORK'
      ? formatHomeworkDeadlineLabel(data.deadlineLabel, data.dday)
      : '';

  return (
    <Link href={hrefLink}>
      <div
        className={cn(
          'hover:bg-gray-1 flex w-full items-start gap-3 rounded-lg px-2 py-3 text-left transition-colors'
        )}
      >
        <div className="pt-1">{getTypeIcon(data.type)}</div>

        <div className="min-w-0 flex-1">
          {isQna && (
            <p className="font-caption-heading text-orange-7 mb-1">
              {data.studyRoomName}
            </p>
          )}

          <p className="font-body2-normal text-gray-12 truncate">
            {data.title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {isHomework && (
              <span className="bg-gray-1 font-caption-normal text-gray-8 rounded px-1.5 py-0.5">
                제출일
              </span>
            )}

            {metaPrefix && (
              <span className="font-caption-normal text-gray-8">
                {metaPrefix}
              </span>
            )}

            <span className="font-caption-normal text-gray-8">{metaText}</span>

            {isHomework && homeworkDeadlineLabel && (
              <StatusBadge
                variant={
                  data.deadlineLabel === 'OVERDUE' ? 'default' : 'primary'
                }
                label={homeworkDeadlineLabel}
                className="font-caption-heading rounded-[4px] px-2 py-1"
              />
            )}

            {isQna && data.status === 'COMPLETED' && (
              <span className="bg-system-success-alt text-system-success font-caption-heading flex items-center gap-1 rounded-[4px] px-2 py-1">
                답변 완료
                <Check
                  className="h-3.5 w-3.5 shrink-0"
                  strokeWidth={2.4}
                />
              </span>
            )}

            {isQna && data.status === 'PENDING' && (
              <StatusBadge
                variant="default"
                label="답변 대기"
                className="font-caption-heading rounded-[4px] px-2 py-1"
              />
            )}
          </div>
        </div>

        <ChevronRight className="text-gray-6 mt-1 h-5 w-5 shrink-0" />
      </div>
    </Link>
  );
};
