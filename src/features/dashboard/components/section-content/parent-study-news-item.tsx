import { StatusBadge } from '@/shared/components/ui';
import { cn, formatDateDot } from '@/shared/lib';
import {
  Check,
  ChevronRight,
  FileText,
  MessageSquareText,
  PencilLine,
} from 'lucide-react';

export type ParentStudyNewsType = 'HOMEWORK' | 'TEACHING_NOTE' | 'QNA';
export type ParentStudyNewsDeadlineLabel = 'UPCOMING' | 'TODAY' | 'OVERDUE';
export type ParentStudyNewsQnaStatus = 'PENDING' | 'COMPLETED';

export interface ParentStudyNewsItemData {
  type: ParentStudyNewsType;
  id: number;
  title: string;
  regDate: string;
  teacherName: string;
  studyRoomName: string;
  deadline?: string;
  deadlineLabel?: ParentStudyNewsDeadlineLabel;
  dday?: number;
  status?: ParentStudyNewsQnaStatus;
}

interface StudyNewsItemProps {
  item: ParentStudyNewsItemData;
  className?: string;
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
  const iconClassName = 'h-5 w-5 text-gray-12 shrink-0';

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
        <MessageSquareText
          size={36}
          className={iconClassName}
          strokeWidth={1.8}
        />
      );
    case 'TEACHING_NOTE':
    default:
      return (
        <FileText
          size={36}
          className={iconClassName}
          strokeWidth={1.8}
        />
      );
  }
};

export const StudyNewsItem = ({ item, className }: StudyNewsItemProps) => {
  const isHomework = item.type === 'HOMEWORK';
  const isQna = item.type === 'QNA';
  const metaPrefix =
    isHomework || isQna ? undefined : item.studyRoomName || undefined;
  const metaText = `${formatDateDot(item.regDate)} 작성 · ${item.teacherName}선생님`;
  const homeworkDeadlineLabel = formatHomeworkDeadlineLabel(
    item.deadlineLabel,
    item.dday
  );

  return (
    <button
      type="button"
      className={cn(
        'hover:bg-gray-1 flex w-full items-start gap-3 rounded-lg px-2 py-3 text-left transition-colors',
        className
      )}
    >
      <div className="pt-1">{getTypeIcon(item.type)}</div>

      <div className="min-w-0 flex-1">
        {isQna && (
          <p className="font-caption-heading text-orange-7 mb-1">
            {item.studyRoomName}
          </p>
        )}

        <p className="font-body2-normal text-gray-12 truncate">{item.title}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {isHomework && (
            <span className="font-caption-normal text-gray-8 bg-gray-1 rounded px-1.5 py-0.5">
              제출 전
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
              variant={item.deadlineLabel === 'OVERDUE' ? 'default' : 'primary'}
              label={homeworkDeadlineLabel}
              className="font-caption-heading rounded-[4px] px-2 py-1"
            />
          )}

          {isQna && item.status === 'COMPLETED' && (
            <span className="bg-system-success-alt text-system-success font-caption-heading flex items-center gap-1 rounded-[4px] px-2 py-1">
              답변 완료
              <Check
                className="h-3.5 w-3.5 shrink-0"
                strokeWidth={2.4}
              />
            </span>
          )}

          {isQna && item.status === 'PENDING' && (
            <StatusBadge
              variant="default"
              label="답변 대기"
              className="font-caption-heading rounded-[4px] px-2 py-1"
            />
          )}
        </div>
      </div>

      <ChevronRight className="text-gray-6 mt-1 h-5 w-5 shrink-0" />
    </button>
  );
};
