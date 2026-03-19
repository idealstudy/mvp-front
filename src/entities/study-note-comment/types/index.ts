import { z } from 'zod';

import { domain } from '../core';
import { dto } from '../infrastructure/comment.dto';

export type CommentResolvedContentDTO = z.infer<typeof dto.resolvedContent>;
export type CommentAuthorInfoDTO = z.infer<typeof dto.authorInfo>;
export type CommentChildItemDTO = z.infer<typeof dto.childItem>;
export type CommentItemDTO = z.infer<typeof dto.item>;
export type CommentReadItemDTO = z.infer<typeof dto.readItem>;

export type CommentCreateRequestDTO = z.infer<typeof dto.createRequest>;
export type CommentUpdateRequestDTO = z.infer<typeof dto.updateRequest>;

export type CommentListDTO = z.infer<typeof dto.list>;
export type CommentReadListDTO = z.infer<typeof dto.readList>;

export type CommentResolvedContent = z.infer<typeof domain.resolvedContent>;
export type CommentAuthorInfo = z.infer<typeof domain.authorInfo>;
export type CommentChildItem = z.infer<typeof domain.childItem>;
export type CommentItem = z.infer<typeof domain.item>;
export type CommentReadItem = z.infer<typeof domain.readItem>;
export type CommentList = z.infer<typeof domain.list>;
export type CommentReadList = z.infer<typeof domain.readList>;
