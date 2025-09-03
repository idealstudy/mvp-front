export interface StudyNote {
  id: number;
  groupId: number;
  groupName: string;
  teacherName: string;
  title: string;
  visibility: string;
  taughtAt: string;
  updatedAt: string;
}

export interface StudyNoteGroup {
  id: number;
  title: string;
}

export interface StudyNoteDetails {
  id: number;
  studyRoomId: number;
  studyRoomName: string;
  title: string;
  content: string;
  taughtAt: string;
  studentInfos: [
    {
      studentId: number;
      studentName: string;
    }[],
  ];
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
