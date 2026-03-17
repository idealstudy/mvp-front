import {
  FrontendStudentHomeworkList,
  ProfileHomeworkListSortKey,
} from '@/entities/student';
import ExpandableListSection from '@/features/profile/components/expandable-list-section';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE } from '@/shared/constants';

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
      {visibleItems.map((item) => (
        <ListItem
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={`제출일: ${item.submittedAt ?? '-'} | 마감일 ${item.deadline}`}
          href={PRIVATE.HOMEWORK.DETAIL(item.studyRoomId, item.id)}
          tag={
            <span className="bg-gray-2 font-caption-normal text-gray-8 mb-1 rounded-sm px-1 py-0.5">
              {item.studyRoomName}
            </span>
          }
        />
      ))}
    </ExpandableListSection>
  );
}
