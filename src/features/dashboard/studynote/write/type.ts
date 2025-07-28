import { Role } from '@/features/auth/type';
import { z } from 'zod';

import { StudyNoteVisibility } from './schemas/note';

export interface StudyNote {
  studyRoomId: number;
  title: string;
  content: string;
  visibility: string;
  taughtAt: string;
  studentIds: number[];
}

export interface ConnectedMember {
  role: Role;
  id: number;
  name: string;
  email: string;
  joinDate: string | null;
}

// 임시로 작성
export interface StudyRoom {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  visibility: string;
  numberOfTeachingNote: number;
  studentNames: string[];
  startDate: string;
  endDate: string;
}

export type StudyNoteVisibility = z.infer<typeof StudyNoteVisibility>;
