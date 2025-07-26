import { useRouter } from 'next/navigation';

import { ROUTE } from '@/constants/route';
import { useMutation, useQuery } from '@tanstack/react-query';

import { StudyNote } from '../type';
import { writeStudyNote } from './api';
import { getConnectMembersOption, getStudyRoomsOption } from './query-options';

export const useConnectMembers = (roomId: number) => {
  return useQuery(getConnectMembersOption(roomId));
};

export const useWriteStudyNoteMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: StudyNote) => writeStudyNote(data),
    onSuccess: () => {
      router.replace(ROUTE.DASHBOARD.HOME);
    },
  });
};

// 임시로 작성된 스터디 룸 Query
export const useStudyRoomsQuery = () => {
  return useQuery(getStudyRoomsOption());
};
