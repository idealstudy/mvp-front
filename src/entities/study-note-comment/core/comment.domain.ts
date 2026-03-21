import type { Role } from '@/entities/member';
import { z } from 'zod';

import { dto } from '../infrastructure';

/* ─────────────────────────────────────────────────────
 * DTO 스키마를 Domain 스키마로 변환
 * ────────────────────────────────────────────────────*/
const CommentResolvedContentDomainSchema = dto.resolvedContent;

/* ─────────────────────────────────────────────────────
 * 역할 -> 한글 변환 매핑
 * ────────────────────────────────────────────────────*/

const ROLE_META: Record<
  Role,
  {
    label: string;
    profileImageSrc: string;
    isStudent: boolean;
  }
> = {
  ROLE_STUDENT: {
    label: '학생',
    profileImageSrc: '/character/img_profile_student01.png',
    isStudent: true,
  },
  ROLE_TEACHER: {
    label: '선생님',
    profileImageSrc: '/character/img_profile_teacher01.png',
    isStudent: false,
  },
  ROLE_PARENT: {
    label: '부모님',
    profileImageSrc: '/character/img_profile_teacher01.png',
    isStudent: false,
  },
  ROLE_ADMIN: {
    label: '관리자',
    profileImageSrc: '/character/img_profile_teacher01.png',
    isStudent: false,
  },
  ROLE_MEMBER: {
    label: '회원',
    profileImageSrc: '/character/img_profile_student02.png',
    isStudent: false,
  },
};

export const getCommentRoleLabel = (role?: Role): string => {
  return role ? ROLE_META[role].label : '회원';
};

export const getCommentProfileImageSrc = (role?: Role): string => {
  return role
    ? ROLE_META[role].profileImageSrc
    : '/character/img_profile_teacher01.png';
};

const toCommentAuthorInfo = (authorInfo: z.infer<typeof dto.authorInfo>) => ({
  ...authorInfo,
  roleLabel: getCommentRoleLabel(authorInfo.role),
  profileImageSrc: ROLE_META[authorInfo.role].profileImageSrc,
  isStudent: ROLE_META[authorInfo.role].isStudent,
});

const toCommentChildItem = (comment: z.infer<typeof dto.childItem>) => ({
  ...comment,
  authorInfo: toCommentAuthorInfo(comment.authorInfo),
  isDeleted: comment.deletedAt != null,
});

const toCommentItem = (comment: z.infer<typeof dto.item>) => ({
  ...comment,
  authorInfo: toCommentAuthorInfo(comment.authorInfo),
  children: comment.children.map(toCommentChildItem),
  isDeleted: comment.deletedAt != null,
});

const toCommentReadItem = (reader: z.infer<typeof dto.readItem>) => ({
  ...reader,
  roleLabel: getCommentRoleLabel(reader.role),
  profileImageSrc: ROLE_META[reader.role].profileImageSrc,
  isStudent: ROLE_META[reader.role].isStudent,
});

/* ─────────────────────────────────────────────────────
 * Domain 스키마 (비즈니스 로직 포함)
 * ────────────────────────────────────────────────────*/
const CommentAuthorInfoDomainSchema =
  dto.authorInfo.transform(toCommentAuthorInfo);
const CommentChildItemDomainSchema =
  dto.childItem.transform(toCommentChildItem);
const CommentItemDomainSchema = dto.item.transform(toCommentItem);
const CommentReadItemDomainSchema = dto.readItem.transform(toCommentReadItem);
const CommentListDomainSchema = z.array(CommentItemDomainSchema);
const CommentReadListDomainSchema = z.array(CommentReadItemDomainSchema);

/* ─────────────────────────────────────────────────────
 * 내보내기
 * ────────────────────────────────────────────────────*/
export const domain = {
  resolvedContent: CommentResolvedContentDomainSchema,
  authorInfo: CommentAuthorInfoDomainSchema,
  childItem: CommentChildItemDomainSchema,
  item: CommentItemDomainSchema,
  readItem: CommentReadItemDomainSchema,
  list: CommentListDomainSchema,
  readList: CommentReadListDomainSchema,
};
