import type { StudyRoomSubmitValues } from '@/features/study-rooms';
import {
  TeacherStudyRoomRequests,
  createStudyRoomBaseApi,
} from '@/features/study-rooms/api';
import { Invitee } from '@/features/study-rooms/hooks/useInvitationController';
import type { CommonResponse, Pageable, PaginationData } from '@/types/http';

import type {
  ApiResponse,
  MemberInvitation,
  SearchInvitationPayload,
  StudyNoteGroup,
  StudyRoom,
  StudyRoomClient,
  StudyRoomDetail,
} from '../model/types';

export const createTeacherStudyRoomApi = (
  client?: StudyRoomClient
): TeacherStudyRoomRequests => {
  const base = createStudyRoomBaseApi(client);

  // 스터디룸 목록 조회
  const getStudyRooms = async (): Promise<StudyRoom[]> => {
    const response = await base.client.get<CommonResponse<StudyRoom[]>>(
      base.teacherBasePath
    );
    return response.data;
  };

  // 스터디룸 상세 조회
  const getStudyRoomDetail = async (
    studyRoomId: number
  ): Promise<StudyRoomDetail> => {
    const response = await base.client.get<CommonResponse<StudyRoomDetail>>(
      `${base.teacherBasePath}/${studyRoomId}`
    );
    return response.data;
  };

  // 스터디룸 생성
  const create = async (payload: StudyRoomSubmitValues): Promise<StudyRoom> => {
    const response = await base.client.post<ApiResponse<StudyRoom>>(
      base.teacherBasePath,
      payload
    );
    return response.data;
  };

  // 스터디룸 초대
  const sendInvitation = async (args: {
    studyRoomId: number;
    emails: string[];
  }): Promise<MemberInvitation> => {
    const response = await base.client.post<ApiResponse<MemberInvitation>>(
      `${base.teacherBasePath}/${args.studyRoomId}/members`,
      { studentEmailList: args.emails }
    );
    return response.data;
  };

  // 초대할 사용자 검색
  const searchInvitation = async (
    args: SearchInvitationPayload
  ): Promise<Invitee[]> => {
    const response = await base.client.get<ApiResponse<Invitee[]>>(
      `${base.teacherBasePath}/${args.studyRoomId}/search`,
      { params: { keyword: args.keyword } }
    );
    return response.data;
  };

  // 수업노트 그룹 조회
  const getStudyNoteGroup = async (args: {
    studyRoomId: number;
    pageable: Pageable;
  }): Promise<PaginationData<StudyNoteGroup>> => {
    const response = await base.client.get<
      CommonResponse<PaginationData<StudyNoteGroup>>
    >(`${base.teacherBasePath}/${args.studyRoomId}/teaching-note-groups`, {
      params: args.pageable,
      paramsSerializer: { indexes: null },
    });
    return response.data;
  };

  // 학생 내보내기
  const removeMember = async (args: {
    studyRoomId: number;
    studentId: number;
  }): Promise<void> => {
    await base.client.delete(
      `${base.teacherBasePath}/${args.studyRoomId}/members/${args.studentId}`
    );
  };

  const terminateMember = async (args: {
    studyRoomId: number;
    studentId: number;
  }): Promise<void> => {
    await base.client.post(
      `${base.teacherBasePath}/${args.studyRoomId}/terminate/${args.studentId}`
    );
  };

  const resumeMember = async (args: {
    studyRoomId: number;
    studentId: number;
  }): Promise<void> => {
    await base.client.post(
      `${base.teacherBasePath}/${args.studyRoomId}/resume/${args.studentId}`
    );
  };

  return {
    getStudyRooms,
    getStudyRoomDetail,
    create,
    invitations: { send: sendInvitation, search: searchInvitation },
    getStudyNoteGroup,
    removeMember,
    terminateMember,
    resumeMember,
  };
};
