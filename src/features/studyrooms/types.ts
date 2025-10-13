export interface StudyNoteGroup {
  id: number;
  title: string;
}

export interface CreateStepForm {
  onNext: () => void;
  disabled: boolean;
}

export type ApiResponse<T> = { status: number; message: string; data: T };
export type StudyRoom = {
  id: number;
  name: string;
  description: string;
  teacherName: string;
  visibility: 'PUBLIC' | 'PRIVATE';
};
