'use client';

import { useState } from 'react';

import { MemberListItem } from '@/features/member/components/member-list-item';
import { StudyNoteSearchFilterBar } from '@/features/study-notes/components/search-filter-bar';
import { useGetTeacherNoteMembers } from '@/features/study-notes/hooks';
import { useMemberFilter } from '@/features/study-notes/hooks/use-member-filter';
import { StudyNoteLimit, StudyNoteSortKey } from '@/features/study-notes/model';
import { transformMembersData } from '@/features/study-notes/model/transform';
import { MiniSpinner } from '@/shared/components/loading';
import { Pagination } from '@/shared/components/ui/pagination';

type Props = {
  studyRoomId: number;
};

export default function MembersPanel({ studyRoomId }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<StudyNoteSortKey>('LATEST_EDITED');
  const [limit, setLimit] = useState<StudyNoteLimit>(20);

  const { data, isPending } = useGetTeacherNoteMembers({
    studyRoomId,
    page: currentPage,
    size: limit,
  });

  const members = transformMembersData(data?.data);
  const filteredMembers = useMemberFilter(members, search, sort);

  if (isPending) {
    return (
      <div className="mx-auto flex h-64 w-full max-w-3xl items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <MiniSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-4">
        <StudyNoteSearchFilterBar
          search={search}
          sort={sort}
          limit={limit}
          onSearch={setSearch}
          onSortChange={setSort}
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
          filteredMembers.map((member) => (
            <MemberListItem
              key={member.id}
              member={member}
              studyRoomId={studyRoomId}
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
