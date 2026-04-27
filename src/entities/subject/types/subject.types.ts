import { z } from 'zod';

import { subjectDto } from '../infrastructure/subject.dto';

export type Subject = z.infer<typeof subjectDto.list>[number];
