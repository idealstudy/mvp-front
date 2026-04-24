import { api } from '@/shared/api';
import { CommonResponse, Pageable, PaginationMeta } from '@/types/http';

import {
  QnADetailResponse,
  QnAListItem,
  QnAStatus,
  QnAVisibility,
} from '../types';

// POST /api/study-rooms/{studyRoomId}/qna - 질문 생성
export const writeQnA = async (args: {
  studyRoomId: number;
  title: string;
  content: string;
  visibility: QnAVisibility;
  mediaIds?: string[];
  relatedTeachingNoteId?: number;
}) => {
  const data = {
    title: args.title,
    content: args.content,
    visibility: args.visibility,
    mediaIds: args.mediaIds ?? [],
    relatedTeachingNoteId: args.relatedTeachingNoteId ?? null,
  };

  await api.private.post(`/study-rooms/${args.studyRoomId}/qna`, data);
};

// POST /api/study-rooms/{studyRoomId}/qna/{contextId}/messages - 학생 추가 질문
export const writeStudentQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  content: string;
  mediaIds?: string[];
}) => {
  await api.private.post(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}/messages`,
    {
      content: args.content,
      mediaIds: args.mediaIds ?? [],
    }
  );
};

// POST /api/teacher/study-rooms/{studyRoomId}/qna/{contextId}/answers - 선생님 답변
export const writeTeacherQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  content: string;
  mediaIds?: string[];
}) => {
  await api.private.post(
    `/teacher/study-rooms/${args.studyRoomId}/qna/${args.contextId}/answers`,
    {
      content: args.content,
      mediaIds: args.mediaIds ?? [],
    }
  );
};

// GET /api/study-rooms/{studyRoomId}/qna - 학생 QnA 목록
export const getStudentQnAList = async (args: {
  studyRoomId: number;
  pageable: Pageable;
  status?: string;
  sort?: string;
  searchKeyword?: string;
}) => {
  const response = await api.private.get<
    CommonResponse<PaginationMeta & { content: QnAListItem[] }>
  >(`/study-rooms/${args.studyRoomId}/qna`, {
    params: {
      status: args.status,
      page: args.pageable.page,
      size: args.pageable.size,
      sort: args.sort,
      searchKeyword: args.searchKeyword,
    },
  });

  return response.data;
};

// GET /api/study-rooms/{studyRoomId}/qna/{contextId} - 학생 QnA 상세
export const getStudentQnADetail = async (args: {
  studyRoomId: number;
  contextId: number;
}) => {
  const response = await api.private.get<CommonResponse<QnADetailResponse>>(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}`
  );

  return response.data;
};

// GET /api/teacher/study-rooms/{studyRoomId}/qna - 선생님 QnA 목록
export const getTeacherQnAList = async (args: {
  studyRoomId: number;
  pageable: Pageable;
  status?: string;
  sort?: string;
  searchKeyword?: string;
}) => {
  const response = await api.private.get<
    CommonResponse<PaginationMeta & { content: QnAListItem[] }>
  >(`/teacher/study-rooms/${args.studyRoomId}/qna`, {
    params: {
      status: args.status,
      page: args.pageable.page,
      size: args.pageable.size,
      sort: args.sort,
      searchKeyword: args.searchKeyword,
    },
  });

  return response.data;
};

// GET /api/teacher/study-rooms/{studyRoomId}/qna/{contextId} - 선생님 QnA 상세
export const getTeacherQnADetail = async (args: {
  studyRoomId: number;
  contextId: number;
}) => {
  const response = await api.private.get<CommonResponse<QnADetailResponse>>(
    `/teacher/study-rooms/${args.studyRoomId}/qna/${args.contextId}`
  );

  return response.data;
};

// PATCH /api/study-rooms/{studyRoomId}/qna/{contextId}/messages/{messageId} - 학생 메시지 수정
export const updateStudentQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  messageId: number;
  content: string;
  mediaIds?: string[];
}) => {
  await api.private.patch(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}/messages/${args.messageId}`,
    {
      content: args.content,
      mediaIds: args.mediaIds ?? [],
    }
  );
};

// DELETE /api/study-rooms/{studyRoomId}/qna/{contextId}/messages/{messageId} - 학생 메시지 삭제
export const deleteStudentQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  messageId: number;
}) => {
  await api.private.delete(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}/messages/${args.messageId}`
  );
};

// PATCH /api/study-rooms/{studyRoomId}/qna/{contextId}/messages/{messageId} - 선생님 메시지 수정
// 백엔드 스펙: PATCH/DELETE는 /api/study-rooms/... 사용 (학생/선생님 공통)
// answers는 POST만 존재하고, 수정/삭제는 messages 엔드포인트 사용
export const updateTeacherQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  messageId: number;
  content: string;
  mediaIds?: string[];
}) => {
  await api.private.patch(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}/messages/${args.messageId}`,
    {
      content: args.content,
      mediaIds: args.mediaIds ?? [],
    }
  );
};

// DELETE /api/study-rooms/{studyRoomId}/qna/{contextId}/messages/{messageId} - 선생님 메시지 삭제
// 백엔드 스펙: PATCH/DELETE는 /api/study-rooms/... 사용 (학생/선생님 공통)
// answers는 POST만 존재하고, 수정/삭제는 messages 엔드포인트 사용
export const deleteTeacherQnAMessage = async (args: {
  studyRoomId: number;
  contextId: number;
  messageId: number;
}) => {
  await api.private.delete(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}/messages/${args.messageId}`
  );
};

// PATCH /api/study-rooms/{studyRoomId}/qna/{contextId} - QNA 질문 제목 수정
// 학생: 본인 QnA만, 선생님: 모든 QnA
export const updateQnATitle = async (args: {
  studyRoomId: number;
  contextId: number;
  title: string;
}) => {
  await api.private.patch(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}`,
    { title: args.title }
  );
};

// DELETE /api/study-rooms/{studyRoomId}/qna/{contextId} - QNA 컨텍스트(질문) 삭제
// 학생: 본인 QnA만, 선생님: 모든 QnA
export const deleteQnA = async (args: {
  studyRoomId: number;
  contextId: number;
}) => {
  await api.private.delete(
    `/study-rooms/${args.studyRoomId}/qna/${args.contextId}`
  );
};

// PATCH qna 상태 수정
export const updateQnAStatus = async (args: {
  studyRoomId: number;
  contextId: number;
  status: QnAStatus;
}) => {
  await api.private.patch(
    `/teacher/study-rooms/${args.studyRoomId}/qna/${args.contextId}/status`,
    { status: args.status }
  );
};

/**
 * GET /api/parent/student/{studentId}/study-rooms/{studyRoomId}/qna/{contextId}
 * 부모님 - 보호자가 자신의 학생의 QNA 상세 내용을 조회한다.
 */
export const getParentQnADetail = async (args: {
  studentId: number;
  studyRoomId: number;
  contextId: number;
}) => {
  const response = await api.private.get<CommonResponse<QnADetailResponse>>(
    `/parent/student/${args.studentId}/study-rooms/${args.studyRoomId}/qna/${args.contextId}`
  );
  return response.data;
};
