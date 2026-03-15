import { z } from 'zod';

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

// export type CommentResolvedContentDomain = z.infer<typeof domain.resolvedContent>;
// export type CommentAuthorInfoDomain = z.infer<typeof domain.authorInfo>;
// export type CommentChildItemDomain = z.infer<typeof domain.childItem>;
// export type CommentItemDomain = z.infer<typeof domain.item>;
// export type CommentReadItemDomain = z.infer<typeof domain.readItem>;
// export type CommentListDomain = z.infer<typeof domain.list>;
// export type CommentReadListDomain = z.infer<typeof domain.readList>;
