import {
  StudentNoteQueryKey,
  type StudentNoteWritePayload,
  studentNoteRepository,
} from '@/entities/student-study-note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* ─────────────────────────────────────────────────────
 * 진행 중인 학습 일지 조회
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerProgress = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: StudentNoteQueryKey.timerProgress(),
    queryFn: studentNoteRepository.timer.getProgress,
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 시간 측정 시작
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerStart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentNoteWritePayload) =>
      studentNoteRepository.timer.start(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: StudentNoteQueryKey.timerProgress(),
      });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 시간 측정 종료
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerFinish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studyNoteId,
      body,
    }: {
      studyNoteId: number;
      body: StudentNoteWritePayload;
    }) => studentNoteRepository.timer.finish(studyNoteId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentNoteQueryKey.all });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 시간 측정 일시 정지
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerPause = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studyNoteId,
      body,
    }: {
      studyNoteId: number;
      body: StudentNoteWritePayload;
    }) => studentNoteRepository.timer.pause(studyNoteId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: StudentNoteQueryKey.timerProgress(),
      });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 시간 측정 다시 시작
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studyNoteId: number) =>
      studentNoteRepository.timer.resume(studyNoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: StudentNoteQueryKey.timerProgress(),
      });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 시간 초기화
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerReset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studyNoteId: number) =>
      studentNoteRepository.timer.reset(studyNoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: StudentNoteQueryKey.timerProgress(),
      });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 임시 저장
 * ────────────────────────────────────────────────────*/
export const useStudyNoteTimerTempSave = () => {
  return useMutation({
    mutationFn: ({
      studyNoteId,
      body,
    }: {
      studyNoteId: number;
      body: StudentNoteWritePayload;
    }) => studentNoteRepository.timer.tempSave(studyNoteId, body),
  });
};
