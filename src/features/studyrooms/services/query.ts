//import { useRouter } from 'next/navigation';
import { studyroomApi } from '@/features/studyrooms/services/api';
import { StudyRoomsGroupQueryKey } from '@/features/studyrooms/services/query-options';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateStudyRoomMutation = () => {
  const queryClient = useQueryClient();
  //const router = useRouter();

  return useMutation({
    mutationFn: studyroomApi.create,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: StudyRoomsGroupQueryKey.all,
      });
      alert('폼 제출 완료: ' + JSON.stringify(data));
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line no-console
      console.error('스터디룸 생성 실패:', error);
      alert('생성에 실패했습니다. 다시 시도해주세요.' + JSON.stringify(error));
    },
  });
};
