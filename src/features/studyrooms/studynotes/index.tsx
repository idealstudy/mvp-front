import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';

import { StudyNotesList } from './list';

export const StudyNotes = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <Input placeholder="검색어를 입력하세요" />
          <Input placeholder="필터" />
        </div>
        <StudyNotesList />
      </div>
      <Pagination />
    </div>
  );
};
