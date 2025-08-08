import { z } from 'zod';

import { StudyNoteVisibility } from './write/schemas/note';

export type StudyNoteVisibility = z.infer<typeof StudyNoteVisibility>;
