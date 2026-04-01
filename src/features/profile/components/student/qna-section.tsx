import {
  FrontendStudentQnaList,
  ProfileQnaListSortKey,
  ProfileQnaListStatus,
} from '@/entities/student';
import ExpandableListSection from '@/features/profile/components/expandable-list-section';
import { Checkbox, StatusBadge } from '@/shared/components/ui';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE } from '@/shared/constants';
import { cn, formatMMDDWeekday } from '@/shared/lib';

interface QnaSectionProps {
  data: FrontendStudentQnaList | undefined;
  page: number;
  setPage: (page: number) => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  sort: ProfileQnaListSortKey;
  setSort: (value: ProfileQnaListSortKey) => void;
  status: ProfileQnaListStatus | undefined;
  setStatus: (value: ProfileQnaListStatus | undefined) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const QNA_SORT_OPTIONS: Array<{ label: string; value: ProfileQnaListSortKey }> =
  [
    { label: '최신순', value: 'LATEST' },
    { label: '오래된순', value: 'OLDEST' },
    { label: '가나다순', value: 'ALPHABETICAL' },
  ];

const QNA_STATUS_LABEL: Record<'PENDING' | 'COMPLETED', string> = {
  PENDING: '피드백 대기',
  COMPLETED: '피드백 완료',
};

export default function QnaSection({
  data,
  page,
  setPage,
  searchKeyword,
  setSearchKeyword,
  sort,
  setSort,
  status,
  setStatus,
  isExpanded,
  setIsExpanded,
}: QnaSectionProps) {
  const items = data?.content ?? [];
  const visibleItems = isExpanded ? items : items.slice(0, 5);

  if (data && data.totalElements === 0 && !searchKeyword && !status) {
    return (
      <p className="text-text-sub2 my-4 text-center">등록된 질문이 없습니다.</p>
    );
  }

  return (
    <ExpandableListSection
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      keyword={searchKeyword}
      onSearch={(value) => {
        setSearchKeyword(value);
        setPage(1);
      }}
      sortKey={sort}
      onSortChange={(value) => {
        setSort(value as ProfileQnaListSortKey);
        setPage(1);
      }}
      sortOptions={QNA_SORT_OPTIONS}
      page={page}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
    >
      {isExpanded && (
        <Checkbox.Label className="self-end">
          <Checkbox
            checked={status === 'PENDING'}
            onCheckedChange={(checked) => {
              setStatus(checked ? 'PENDING' : undefined);
              setPage(1);
            }}
          />
          <span className="font-label-normal">피드백 대기만 보기</span>
        </Checkbox.Label>
      )}

      {items.length === 0 ? (
        <p className="text-text-sub2 my-4 text-center">검색 결과가 없습니다.</p>
      ) : (
        visibleItems.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            title={item.title}
            subtitle={`작성일: ${formatMMDDWeekday(item.regDate)}`}
            href={PRIVATE.QUESTIONS.DETAIL(item.studyRoomId, item.id)}
            tag={
              <span
                className={cn(
                  'bg-gray-2 font-caption-normal text-gray-8 mb-1 rounded-sm px-1 py-0.5',
                  'max-tablet:hidden'
                )}
              >
                {item.studyRoomName}
              </span>
            }
            rightTitle={
              <StatusBadge
                label={QNA_STATUS_LABEL[item.status]}
                variant={item.status === 'PENDING' ? 'default' : 'primary'}
              />
            }
          />
        ))
      )}
    </ExpandableListSection>
  );
}
