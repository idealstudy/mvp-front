'use client';

import { useState } from 'react';

import { MemberListItem } from '@/features/member/member-list-item';
import { SearchFilterBar } from '@/features/qna/components/detail/search-filter-bar';
import { SortKey } from '@/features/qna/types';
import { useGetTeacherNoteMembers } from '@/features/study-notes/hooks';
import { useMemberFilter } from '@/features/study-notes/hooks/use-member-filter';
import { StudyNoteLimit, StudyNoteSortKey } from '@/features/study-notes/model';
import { transformMembersData } from '@/features/study-notes/model/transform';
import { Pagination } from '@/shared/components/ui/pagination';

type Props = {
  studyRoomId: number;
};

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

export default function MembersPanel({ studyRoomId }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<StudyNoteSortKey>('LATEST_EDITED');
  const [limit, setLimit] = useState<StudyNoteLimit>(20);

  const { data, isLoading } = useGetTeacherNoteMembers({
    studyRoomId,
    page: currentPage,
    size: limit,
  });

  const members = transformMembersData(data?.data);
  const filteredMembers = useMemberFilter(members, search, sort);

  if (isLoading) {
    return (
      <div className="mx-auto flex h-64 w-full max-w-3xl items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <p className="text-sm text-zinc-500">로딩 중...</p>
      </div>
    );
  }

  const uiSort: SortKey = NOTE_SORT_REVERSE_MAP[sort];

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-4">
        <SearchFilterBar
          search={search}
          sort={uiSort}
          limit={limit}
          onSearch={setSearch}
          onSortChange={(value) => {
            // QnaSortKey → StudyNoteSortKey
            const next = NOTE_SORT_MAP[value];
            setSort(next);
          }}
          onLimitChange={setLimit}
        />
      </div>

      <ul
        role="list"
        className="divide-y divide-zinc-100"
      >
        {filteredMembers.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-zinc-500">
            사용자가 없습니다.
          </li>
        ) : (
          filteredMembers.map((member, idx) => (
            <MemberListItem
              key={member.id}
              member={member}
              isHighlighted={idx === 4}
            />
          ))
        )}
      </ul>

      <Pagination
        page={currentPage}
        totalPages={data?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        className="my-5 justify-center"
      />
    </div>
  );
}
