// 스터디 노트 상세
interface StudentInfo {
  studentId: number;
  studentName: string;
}

export interface StudyNoteDetail {
  id: number;
  studyRoomId: number;
  studyRoomName: string;
  title: string;
  content: string;
  taughtAt: string;
  studentInfos: StudentInfo[];
}
