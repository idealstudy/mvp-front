'use client';

import { MiniSpinner } from '@/shared/components/loading';
import { ListItem } from '@/shared/components/ui/list-item';
import { formatYYYYMMDD, getRelativeTimeString } from '@/shared/lib/utils';

import { HOMEWORK_SUBMIT_STATUS_LABEL } from '../model/constants';
import { StudentHomeworkItem } from '../model/homework.types';

export const StudentHomeworkList = ({
  data,
  studyRoomId,
  isPending,
}: {
  data: StudentHomeworkItem[];
  studyRoomId: number;
  isPending: boolean;
}) => {
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
      <div className="flex flex-col items-center gap-2">
        <p>아직 등록한 과제가 없어요.</p>
        <p>선생님이 과제를 등록하면 여기에서 확인할 수 있어요!</p>
      </div>
    );
  }

  return data.map((item) => (
    <ListItem
      key={item.id}
      warn={deadLineDate(item.deadline)}
      title={item.title}
      subtitle={formatYYYYMMDD(item.deadline)}
      rightTitle={HOMEWORK_SUBMIT_STATUS_LABEL[item.status]}
      rightSubTitle={getRelativeTimeString(item.modDate)}
      href={`/study-rooms/${studyRoomId}/homework/${item.id}`}
      id={item.id}
    />
  ));
};
