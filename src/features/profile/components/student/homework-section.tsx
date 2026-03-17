import {
  FrontendStudentHomeworkList,
  ProfileHomeworkListSortKey,
} from '@/entities/student';
import { Pagination, SearchInput, Select } from '@/shared/components/ui';
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
    <>
      {isExpanded && (
        <div className="items-ceter mb-2 flex justify-between">
          <Select
            value={sortKey}
            onValueChange={(value) => {
              setSortKey(value as ProfileHomeworkListSortKey);
              setPage(1);
            }}
          >
            <Select.Trigger
              className="font-label-normal h-12 w-auto min-w-[130px] rounded-lg pr-10 pl-3"
              placeholder="정렬"
            />
            <Select.Content>
              {HOMEWORK_SORT_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  className="font-body2-normal h-10 justify-start px-4"
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select.Content>
          </Select>
          <SearchInput
            defaultValue={keyword}
            placeholder="검색어를 입력하세요"
            onSearch={(value) => {
              setKeyword(value);
              setPage(1);
            }}
          />
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
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

        {/* 페이지네이션 */}
        {isExpanded && (data?.totalPages ?? 0) > 1 && (
          <div className="flex justify-center">
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 0}
              onPageChange={setPage}
            />
          </div>
        )}

        <button
          onClick={() => setIsExpanded(isExpanded ? false : true)}
          className="font-label-normal hover:bg-gray-1 w-full cursor-pointer rounded-md py-2 text-center"
        >
          {isExpanded ? '접기' : '전체 보기'}
        </button>
      </div>
    </>
  );
}
