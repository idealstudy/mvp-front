import { Role } from '@/entities/member';

export type SortKey = 'LATEST' | 'OLDEST' | 'ALPHABETICAL';

export type LimitNumber = 20 | 30;

export type QnAFilter = 'DEFAULT' | 'PENDING' | 'COMPLETED';

export type QnAStatus = 'PENDING' | 'COMPLETED';

export type QnAVisibility = 'STUDENT_AND_PARENT' | 'STUDENT_ONLY';

export interface QnAListItem {
  id: number;
  title: string;
  status: string;
  content: string;
  viewCount?: number;
  authorName: string;
  regDate: string;
  messages: string[];
}

export interface QnAListResponse {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  authorName: string;
  regDate: string;
  read: boolean;
}

export interface QnADetailResponse {
  id: number;
  title: string;
  status: QnAStatus;
  visibility: QnAVisibility;
  relatedTeachingNote: TeachingNote;
  viewCount: number;
  authorName: string;
  authorProfileImageUrl: string | null;
  regDate: string;
  messages: QnAMessage[];
}

export interface QnAMessage {
  id: number;
  content: string;
  authorType: Role;
  authorName: string;
  authorProfileImageUrl: string | null;
  regDate: string;
}

export interface TeachingNote {
  id: number;
  title: string;
}
