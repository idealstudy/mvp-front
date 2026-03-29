import { z } from 'zod';

import { dto } from '../infrastructure';

export type ClassLink = z.infer<typeof dto.listItem>;
export type ClassLinkList = z.infer<typeof dto.list>;
