'use client';

import { useState } from 'react';

import { MiniSpinner } from '@/shared/components/loading';
import { ListItem } from '@/shared/components/ui/list-item';
import { formatYYYYMMDD, getRelativeTimeString } from '@/shared/lib/utils';

import { HomeworkPageable, TeacherHomeworkItem } from '../model/homework.types';
import { HomeworkDropdown } from './dropdown';

export const TeacherHomeworkList = ({
  data,
  studyRoomId,
  onRefresh,
  isPending,
}: {
  data: TeacherHomeworkItem[];
  studyRoomId: number;
  pageable: HomeworkPageable;
  keyword: string;
  onRefresh: () => void;
  isPending: boolean;
}) => {
  const [open, setOpen] = useState(0);

  const handleOpen = (id: number) => {
    setOpen(open === id ? 0 : id);
  };

  // 마감일 계산
  const deadLineDate = (date: string) => {
    const today = new Date();
    const end = new Date(date);

    const diffMs = end.getTime() - today.getTime();

    if (diffMs <= 0) return '마감';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '마감 임박';

    return `마감 ${diffDays}일 전`;
  };

  // 제출율 계산
  const SubmissionRate = (total: number, submitted: number) => {
    const percent = total === 0 ? 0 : Math.floor((submitted / total) * 100);
    return `제출율 ${percent}% (${submitted}/${total})`;
  };

  // 과제가 없을 시
  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <MiniSpinner />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <p className="flex flex-col items-center">아직 등록한 과제가 없어요.</p>
    );
  }

  return data.map((item) => (
    <ListItem
      key={item.id}
      warn={deadLineDate(item.deadline)}
      title={item.title}
      subtitle={formatYYYYMMDD(item.deadline)}
      rightTitle={SubmissionRate(item.totalStudentCount, item.submittedCount)}
      rightSubTitle={getRelativeTimeString(item.modDate)}
      dropdown={
        <HomeworkDropdown
          open={open}
          handleOpen={handleOpen}
          item={item}
          studyRoomId={studyRoomId}
          onRefresh={onRefresh}
        />
      }
      href={`/study-rooms/${studyRoomId}/homework/${item.id}`}
      id={item.id}
    />
  ));
};
