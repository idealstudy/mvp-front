import { z } from 'zod';

const ClassLinkListItemDomainSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1),
  url: z.string().url(),
});

const ClassLinkListDomainSchema = z.array(ClassLinkListItemDomainSchema);

export const domain = {
  listItem: ClassLinkListItemDomainSchema,
  list: ClassLinkListDomainSchema,
};
