import { z } from 'zod';

import { dto, payload } from '../infrastructure/connect.dto';

export type ConnectListPayload = z.infer<typeof payload.listQuery>;
export type ConnectSearchPayload = z.infer<typeof payload.searchQuery>;

export type ConnectStateDTO = z.infer<typeof dto.state>;
export type ConnectOpponentDTO = z.infer<typeof dto.opponent>;
export type ConnectSearchMemberDTO = z.infer<typeof dto.searchMember>;
export type ConnectListItemDTO = z.infer<typeof dto.listItem>;
export type ConnectListPageDTO = z.infer<typeof dto.listPage>;
