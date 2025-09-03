export interface StudentInfo {
  studentId: number;
  studentName: string;
}

export interface StudyNote {
  id: number;
  groupId: number | null;
  groupName: string;
  teacherName: string;
  title: string;
  visibility: string;
  taughtAt: string;
  updatedAt: string;
}

export interface StudyNoteDetails extends StudyNote {
  content: string;
  studentInfos: StudentInfo[];
}

export interface StudyNoteGroupPageable {
  page: number;
  size: number;
  sortKey: string;
}

export type StudyNoteSortKey =
  | 'LATEST_EDITED'
  | 'OLDEST_EDITED'
  | 'TITLE_ASC'
  | 'TAUGHT_AT_ASC';

export type StudyNoteLimit = 20 | 30;
export interface StudyNotesPageable {
  sortKey: StudyNoteSortKey;
  limit: StudyNoteLimit;
  page: number;
}
