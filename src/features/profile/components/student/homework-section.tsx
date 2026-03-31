import {
  FrontendStudentHomeworkList,
  ProfileHomeworkListSortKey,
} from '@/entities/student';
import ExpandableListSection from '@/features/profile/components/expandable-list-section';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE } from '@/shared/constants';
import { cn, formatMMDDWeekday } from '@/shared/lib';

interface HomeworkSectionProps {
  data: FrontendStudentHomeworkList | undefined;
  page: number;
  setPage: (page: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  sortKey: ProfileHomeworkListSortKey;
  setSortKey: (sortKey: ProfileHomeworkListSortKey) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const HOMEWORK_STATUS_LABEL: Record<
  'NOT_SUBMIT' | 'SUBMIT' | 'LATE_SUBMIT',
  string
> = {
  NOT_SUBMIT: '미제출',
  SUBMIT: '제출 완료',
  LATE_SUBMIT: '지연 제출',
};

const HOMEWORK_SORT_OPTIONS: Array<{
  label: string;
  value: ProfileHomeworkListSortKey;
}> = [
  { label: '마감 임박순', value: 'DEADLINE_IMMINENT' },
  { label: '최신순', value: 'LATEST' },
  { label: '최근 편집순', value: 'LATEST_EDITED' },
  { label: '오래된순', value: 'OLDEST_EDITED' },
  { label: '최근 마감순', value: 'DEADLINE_RECENT' },
];

export default function HomeworkSection({
  data,
  page,
  setPage,
  keyword,
  setKeyword,
  sortKey,
  setSortKey,
  isExpanded,
  setIsExpanded,
}: HomeworkSectionProps) {
  const items = data?.content ?? [];
  const visibleItems = isExpanded ? items : items.slice(0, 5);

  if (data && data.totalElements === 0 && !keyword) {
    return (
      <p className="text-text-sub2 my-4 text-center">등록된 과제가 없습니다.</p>
    );
  }

  return (
    <ExpandableListSection
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      keyword={keyword}
      onSearch={(value) => {
        setKeyword(value);
        setPage(1);
      }}
      sortKey={sortKey}
      onSortChange={(value) => {
        setSortKey(value as ProfileHomeworkListSortKey);
        setPage(1);
      }}
      sortOptions={HOMEWORK_SORT_OPTIONS}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
    >
      {items.length === 0 ? (
        <p className="text-text-sub2 my-4 text-center">검색 결과가 없습니다.</p>
      ) : (
        visibleItems.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={
              (item.submittedAt
                ? `제출일: ${formatMMDDWeekday(item.submittedAt)} | `
                : '') + `마감일: ${formatMMDDWeekday(item.deadline)}`
            }
            href={PRIVATE.HOMEWORK.DETAIL(item.studyRoomId, item.id)}
            tag={
              <span className="bg-gray-2 font-caption-normal text-gray-8 mb-1 rounded-sm px-1 py-0.5">
                {item.studyRoomName}
              </span>
            }
            rightTitle={
              <span
                className={cn(
                  'font-label-normal px-3 py-1.5 whitespace-nowrap',
                  item.status === 'NOT_SUBMIT'
                    ? 'bg-gray-1'
                    : 'bg-orange-1 text-key-color-primary'
                )}
              >
                {HOMEWORK_STATUS_LABEL[item.status]}
              </span>
            }
          />
        ))
      )}
    </ExpandableListSection>
  );
}
