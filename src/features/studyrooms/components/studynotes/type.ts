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
