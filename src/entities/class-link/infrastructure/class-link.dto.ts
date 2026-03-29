import { z } from 'zod';

const ClassLinkItemDto = z.object({
  id: z.number().int(),
  name: z.string(),
  url: z.string(),
});

const ClassLinkListDto = z.array(ClassLinkItemDto);

export const dto = {
  listItem: ClassLinkItemDto,
  list: ClassLinkListDto,
};
