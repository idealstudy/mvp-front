import {
  FrontendStudentTeachingNoteList,
  ProfileTeachingNoteListSortKey,
} from '@/entities/student';
import ExpandableListSection from '@/features/profile/components/expandable-list-section';
import StudyNoteVisibilityIcon from '@/features/study-notes/components/studynote-visibility-icon';
import { ListItem } from '@/shared/components/ui/list-item';
import { PRIVATE } from '@/shared/constants';
import { formatMMDDWeekday } from '@/shared/lib';

interface TeachingNoteSectionProps {
  data: FrontendStudentTeachingNoteList | undefined;
  page: number;
  setPage: (page: number) => void;
  keyword: string;
  setKeyword: (value: string) => void;
  sortKey: ProfileTeachingNoteListSortKey;
  setSortKey: (value: ProfileTeachingNoteListSortKey) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const TEACHING_NOTE_SORT_OPTIONS: Array<{
  label: string;
  value: ProfileTeachingNoteListSortKey;
}> = [
  { label: '최근 편집순', value: 'LATEST_EDITED' },
  { label: '오래된순', value: 'OLDEST_EDITED' },
  { label: '가나다순', value: 'TITLE_ASC' },
  { label: '수업일자순', value: 'TAUGHT_AT_ASC' },
];

export default function TeachingNoteSection({
  data,
  page,
  setPage,
  keyword,
  setKeyword,
  sortKey,
  setSortKey,
  isExpanded,
  setIsExpanded,
}: TeachingNoteSectionProps) {
  const items = data?.content ?? [];
  const visibleItems = isExpanded ? items : items.slice(0, 5);

  if (data && data.totalElements === 0 && !keyword) {
    return (
      <p className="text-text-sub2 my-4 text-center">
        등록된 수업노트가 없습니다.
      </p>
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
        setSortKey(value as ProfileTeachingNoteListSortKey);
        setPage(1);
      }}
      sortOptions={TEACHING_NOTE_SORT_OPTIONS}
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
            icon={<StudyNoteVisibilityIcon visibility={item.visibility} />}
            subtitle={`수업일: ${formatMMDDWeekday(item.taughtAt)}`}
            href={PRIVATE.NOTE.DETAIL(item.studyRoomId, item.id)}
            tag={
              <span className="bg-gray-2 font-caption-normal text-gray-8 max-tablet:hidden mb-1 rounded-sm px-1 py-0.5">
                {item.studyRoomName}
              </span>
            }
          />
        ))
      )}
    </ExpandableListSection>
  );
}
