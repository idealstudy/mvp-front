import { z } from 'zod';

/* ─────────────────────────────────────────────────────
 * 칼럼 목록 조회 DTO (공개, APPROVED만)
 * ────────────────────────────────────────────────────*/
const ColumnListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorName: z.string().nullable(),
  authorNickname: z.string().nullable(),
  tags: z.array(z.string()),
  thumbnailUrl: z.string().nullable(),
  viewCount: z.number(),
  regDate: z.string(),
});

const ColumnPageDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(ColumnListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 칼럼 상세 조회 DTO (공개, APPROVED만)
 * ────────────────────────────────────────────────────*/
const ColumnDetailDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorName: z.string().nullable(),
  authorNickname: z.string().nullable(),
  tags: z.array(z.string()),
  thumbnailUrl: z.string().nullable(),
  content: z.string(),
  resolvedContent: z.object({
    content: z.string(),
    expiresAt: z.string().nullable(),
  }),
  viewCount: z.number(),
  regDate: z.string(),
  modDate: z.string(),
});

/* ─────────────────────────────────────────────────────
 * 마이페이지 칼럼 목록 조회 DTO (선생님)
 * ────────────────────────────────────────────────────*/
const MyColumnListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()),
  status: z.enum(['PENDING_APPROVAL', 'APPROVED']),
  thumbnailUrl: z.string().nullable(),
  viewCount: z.number(),
  regDate: z.string(),
  modDate: z.string(),
});

const MyColumnPageDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(MyColumnListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 관리자 칼럼 목록 조회 DTO (관리자)
 * ────────────────────────────────────────────────────*/
const AdminColumnListItemDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorName: z.string().nullable(),
  authorNickname: z.string().nullable(),
  tags: z.array(z.string()),
  status: z.enum(['PENDING_APPROVAL', 'APPROVED']),
  thumbnailUrl: z.string().nullable(),
  viewCount: z.number(),
  regDate: z.string(),
  modDate: z.string(),
});

const AdminColumnPageDtoSchema = z.object({
  pageNumber: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  content: z.array(AdminColumnListItemDtoSchema),
});

/* ─────────────────────────────────────────────────────
 * 칼럼 생성 Payload (선생님/관리자)
 * 선생님 - PENDING_APPROVAL 상태로 저장
 * 관리자 - APPROVED 상태로 즉시 게시
 * POST
 * ────────────────────────────────────────────────────*/
const CreateColumnArticlePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  thumbnailMediaId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mediaIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 칼럼 수정 Payload (선생님/관리자, 수정 후 다시 PENDING_APPROVAL)
 * ────────────────────────────────────────────────────*/
const UpdateColumnArticlePayloadSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  thumbnailMediaId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mediaIds: z.array(z.string()).optional(),
});

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const dto = {
  listItem: ColumnListItemDtoSchema,
  page: ColumnPageDtoSchema,
  detail: ColumnDetailDtoSchema,
  myListItem: MyColumnListItemDtoSchema,
  myPage: MyColumnPageDtoSchema,
  adminListItem: AdminColumnListItemDtoSchema,
  adminPage: AdminColumnPageDtoSchema,
};

export const payload = {
  create: CreateColumnArticlePayloadSchema,
  update: UpdateColumnArticlePayloadSchema,
};
