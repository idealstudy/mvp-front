import {
  StudentQueryOptions,
  TeacherQueryOptions,
} from '@/features/study-notes/api';
import { ByGroupArgs, ListArgs } from '@/features/study-notes/model';
import { useQuery } from '@tanstack/react-query';

export const createStudentStudyNoteHooks = (
  studentQo: StudentQueryOptions
) => ({
  // 학생 노트 목록 조회
  useGetStudentNotesList: (args: ListArgs) => {
    return useQuery(studentQo.list(args));
  },

  // 학생 그룹별 노트 목록 조회
  useGetStudentNotesByGroup: (args: ByGroupArgs) => {
    return useQuery(studentQo.byGroup(args));
  },

  // 학생 노트 상세 조회
  useGetStudentNoteDetail: (teachingNoteId: number) => {
    return useQuery(studentQo.detail(teachingNoteId));
  },

  useGetStudentNoteMembers: (args: {
    studyRoomId: number;
    page?: number;
    size?: number;
    enabled?: boolean;
  }) => {
    return useQuery(studentQo.members(args));
  },
});

export const createTeacherStudyNoteHooks = (
  teacherQo: TeacherQueryOptions
) => ({
  // 선생님 노트 목록 조회
  useGetTeacherNotesList: (args: ListArgs) => {
    return useQuery(teacherQo.list(args));
  },

  // 선생님 그룹별 노트 목록 조회
  useGetTeacherNotesByGroup: (args: ByGroupArgs) => {
    return useQuery(teacherQo.byGroup(args));
  },

  // 선생님 노트 상세 조회
  useGetTeacherNoteDetail: (teachingNoteId: number) => {
    return useQuery(teacherQo.detail(teachingNoteId));
  },

  // 선생님 노트 멤버 목록 조회
  useGetTeacherNoteMembers: (args: {
    studyRoomId: number;
    page?: number;
    size?: number;
    enabled?: boolean;
  }) => {
    return useQuery(teacherQo.members(args));
  },
});
