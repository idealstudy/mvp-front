import { dto } from '@/entities/student/infrastructure';
import { z } from 'zod';

export type DashboardTeachingNotesSortKey =
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'TITLE_ASC'
  | 'TAUGHT_AT_ASC';
export type DashboardQnASortKey = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';
export type DashboardHomeworkSortKey =
  | 'LATEST'
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'DEADLINE_IMMINENT'
  | 'DEADLINE_RECENT';

export type StudentReportDTO = z.infer<typeof dto.studentReport>;
