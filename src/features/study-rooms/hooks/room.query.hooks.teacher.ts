import { StudyNoteQueryKey } from '@/entities/study-note';
import { teacherKeys } from '@/entities/teacher';
import {
  InvitationQueryKey,
  StudyRoomsQueryKey,
  TeacherStudyRoomRequests,
  createTeacherStudyRoomQueryOptions,
} from '@/features/study-rooms/api';
import type { StudyRoomSubmitValues } from '@/features/study-rooms/model';
import { BaseQueryOptions } from '@/shared/lib/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type SearchArgs = { studyRoomId: number; keyword: string; enabled?: boolean };

export const createTeacherStudyRoomHooks = (
  api: TeacherStudyRoomRequests,
  base?: BaseQueryOptions
) => {
  const qo = createTeacherStudyRoomQueryOptions(api, base);

  // 스터디룸 목록 조회 (강사용 - 임시: 추후 위의 useDashboardQuery 필요 예상)
  const useTeacherStudyRoomsQuery = (options?: { enabled?: boolean }) =>
    useQuery({
      ...qo.teacherList(),
      enabled: options?.enabled ?? true,
    });

  // 스터디룸 상세 조회 (선생님)
  const useTeacherStudyRoomDetailQuery = (
    studyRoomId: number,
    options?: { enabled?: boolean }
  ) =>
    useQuery({
      ...qo.teacherDetail(studyRoomId),
      enabled: options?.enabled ?? true,
    });

  // 사용자 이름 초대 검색
  const useSearchInvitation = (args: SearchArgs) =>
    useQuery({
      ...qo.searchInvitation({
        studyRoomId: args.studyRoomId,
        keyword: args.keyword,
      }),
      enabled: false,
    });

  // 스터디룸 생성
  const useCreateStudyRoom = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: StudyRoomSubmitValues) => api.create(payload),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: StudyRoomsQueryKey.teacherList });

        void qc.invalidateQueries({
          queryKey: teacherKeys.dashboard.studyRoomList(),
        });

        // 마이페이지 캐시 무효화
        void qc.invalidateQueries({ queryKey: teacherKeys.all });
      },
    });
  };

  // 초대 보내기
  const useSendInvitation = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.invitations.send,
      onSuccess: (data, variables) => {
        // 초대 검색 쿼리 무효화
        void qc.invalidateQueries({ queryKey: InvitationQueryKey.all });
        // 멤버 목록 쿼리 무효화 (새로 초대된 멤버가 목록에 반영되도록)
        void qc.invalidateQueries({
          queryKey: StudyNoteQueryKey.membersPrefix(
            'teacher',
            variables.studyRoomId
          ),
        });
        // 스터디룸 상세 쿼리 무효화 (studentNames 업데이트)
        void qc.invalidateQueries({
          queryKey: StudyRoomsQueryKey.detail(variables.studyRoomId),
        });
      },
    });
  };

  // 특정 학생 내보내기 (삭제)
  const useRemoveMember = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.removeMember,
      onSuccess: (_, variables) => {
        qc.invalidateQueries({
          queryKey: StudyNoteQueryKey.membersPrefix(
            'teacher',
            variables.studyRoomId
          ),
        });
      },
    });
  };

  // 특정 학생 수업 종료하기
  const useTerminateMember = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.terminateMember,
      onSuccess: (_, variables) => {
        qc.invalidateQueries({
          queryKey: StudyNoteQueryKey.membersPrefix(
            'teacher',
            variables.studyRoomId
          ),
        });
      },
    });
  };

  // 특정 학생 수업 재개하기
  const useResumeMember = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: api.resumeMember,
      onSuccess: (_, variables) => {
        qc.invalidateQueries({
          queryKey: StudyNoteQueryKey.membersPrefix(
            'teacher',
            variables.studyRoomId
          ),
        });
      },
    });
  };

  return {
    useTeacherStudyRoomsQuery,
    useTeacherStudyRoomDetailQuery,
    useSearchInvitation,
    useCreateStudyRoom,
    useSendInvitation,
    useRemoveMember,
    useTerminateMember,
    useResumeMember,
  };
};
