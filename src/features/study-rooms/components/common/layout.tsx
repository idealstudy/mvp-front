import { SearchFilterBar } from '@/features/qna/components/detail/search-filter-bar';
import { SortKey } from '@/features/qna/types';
import { StudyNoteLimit, StudyNoteSortKey } from '@/features/study-notes/model';
import { Pagination } from '@/shared/components/ui/pagination';

// TODO: sort 타입 임시로 캐스팅 추후 QnA랑 같이 바꿀 예정
// TODO: src/features/qna/components/detail/search-filter-bar.tsx
// TODO: 중복 변수있음 삭제할꺼임
const NOTE_SORT_MAP: Record<SortKey, StudyNoteSortKey> = {
  LATEST: 'LATEST_EDITED',
  OLDEST: 'OLDEST_EDITED',
  ALPHABETICAL: 'TITLE_ASC',
};

// API → UI (역매핑, 선택사항)
const NOTE_SORT_REVERSE_MAP: Record<StudyNoteSortKey, SortKey> = {
  LATEST_EDITED: 'LATEST',
  OLDEST_EDITED: 'OLDEST',
  TITLE_ASC: 'ALPHABETICAL',
  TAUGHT_AT_ASC: 'LATEST',
};

export const StudyRoomDetailLayout = ({
  children,
  search,
  sort,
  limit,
  onSearch,
  onSortChange,
  onLimitChange,
  page,
}: {
  children: React.ReactNode;
  search: string;
  sort: StudyNoteSortKey;
  limit: StudyNoteLimit;
  onSearch: (value: string) => void;
  onSortChange: (value: StudyNoteSortKey) => void;
  onLimitChange: (value: StudyNoteLimit) => void;
  page: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}) => {
  const uiSort: SortKey = NOTE_SORT_REVERSE_MAP[sort];
  return (
    <div className="border-line-line1 flex flex-col gap-6 rounded-[12px] border bg-white p-6 px-8">
      <div className="flex flex-col gap-3">
        <SearchFilterBar
          search={search}
          sort={uiSort}
          limit={limit}
          onSearch={onSearch}
          onSortChange={(value) => {
            // QnaSortKey → StudyNoteSortKey
            const next = NOTE_SORT_MAP[value];
            onSortChange(next as StudyNoteSortKey);
          }}
          onLimitChange={onLimitChange}
        />
        {children}
      </div>
      <Pagination {...page} />
    </div>
  );
};
