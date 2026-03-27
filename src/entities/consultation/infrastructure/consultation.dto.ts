import { z } from 'zod';

const ConsultationDtoSchema = z.object({
  id: z.number(),
  regDate: z.string(),
  modDate: z.string(),
  content: z.string(),
});

const ConsultationListDtoSchema = z.array(ConsultationDtoSchema);

const ConsultationPayloadSchema = z.object({
  content: z.string(),
});

export const dto = {
  item: ConsultationDtoSchema,
  list: ConsultationListDtoSchema,
};

export const payload = {
  create: ConsultationPayloadSchema,
  update: ConsultationPayloadSchema,
};
