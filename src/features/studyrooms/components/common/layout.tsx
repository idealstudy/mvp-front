import { Pagination } from '@/components/ui/pagination';

import { SearchFilterBar } from '../studynotes/search-filter-bar';
import type { StudyNoteLimit, StudyNoteSortKey } from '../studynotes/type';

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
  return (
    <div className="border-line-line1 flex flex-col gap-6 rounded-[12px] border bg-white p-6 px-8">
      <div className="flex flex-col gap-3">
        <SearchFilterBar
          search={search}
          sort={sort}
          limit={limit}
          onSearch={onSearch}
          onSortChange={onSortChange}
          onLimitChange={onLimitChange}
        />
        {children}
      </div>
      <Pagination {...page} />
    </div>
  );
};
