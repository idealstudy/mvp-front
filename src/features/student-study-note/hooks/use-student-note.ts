import {
  StudentNoteQueryKey,
  type StudentNoteWritePayload,
  studentNoteRepository,
} from '@/entities/student-study-note';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* ─────────────────────────────────────────────────────
 * 월 학습 시간 조회
 * ────────────────────────────────────────────────────*/
export const useStudyNoteMonthly = (
  studentId: number,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: StudentNoteQueryKey.monthly(studentId, year, month),
    queryFn: () =>
      studentNoteRepository.calendar.getMonthly(studentId, { year, month }),
    enabled: !!studentId,
    retry: false,
  });
};

/* ─────────────────────────────────────────────────────
 * 일일 학습 기록 조회
 * ────────────────────────────────────────────────────*/
export const useStudyNoteDaily = (studentId: number, date: string) => {
  return useQuery({
    queryKey: StudentNoteQueryKey.daily(studentId, date),
    queryFn: () => studentNoteRepository.calendar.getDaily({ studentId, date }),
    enabled: !!studentId && !!date,
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 목록 조회
 * ────────────────────────────────────────────────────*/
export const useStudentNoteList = (page: number, size = 6) => {
  return useQuery({
    queryKey: StudentNoteQueryKey.list(page, size),
    queryFn: () => studentNoteRepository.crud.getList(page, size),
    retry: false,
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 상세 조회
 * ────────────────────────────────────────────────────*/
export const useStudentNoteDetail = (studyNoteId: number) => {
  return useQuery({
    queryKey: StudentNoteQueryKey.detail(studyNoteId),
    queryFn: () => studentNoteRepository.crud.getDetail(studyNoteId),
    enabled: !!studyNoteId,
    retry: false,
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 작성 (타이머 없이)
 * ────────────────────────────────────────────────────*/
export const useStudentNoteCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentNoteWritePayload) =>
      studentNoteRepository.crud.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentNoteQueryKey.all });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 수정
 * ────────────────────────────────────────────────────*/
export const useStudentNoteUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studyNoteId,
      body,
    }: {
      studyNoteId: number;
      body: StudentNoteWritePayload;
    }) => studentNoteRepository.crud.update(studyNoteId, body),
    onSuccess: (_data, { studyNoteId }) => {
      queryClient.invalidateQueries({
        queryKey: StudentNoteQueryKey.detail(studyNoteId),
      });
      queryClient.invalidateQueries({ queryKey: StudentNoteQueryKey.all });
    },
  });
};

/* ─────────────────────────────────────────────────────
 * 학습 일지 삭제
 * ────────────────────────────────────────────────────*/
export const useStudentNoteDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studyNoteId: number) =>
      studentNoteRepository.crud.delete(studyNoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: StudentNoteQueryKey.all });
    },
  });
};
