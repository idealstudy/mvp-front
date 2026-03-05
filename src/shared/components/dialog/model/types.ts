export type DialogScope =
  | 'group'
  | 'studyroom'
  | 'note'
  | 'invite'
  | 'qna'
  | 'homework'
  | 'homework-feedback'
  | 'homework-student'
  | 'notification'
  | 'profile';

export type DialogKind =
  | 'rename'
  | 'group-move'
  | 'delete'
  | 'onConfirm'
  | 'cancel'
  | 'create'
  | 'invite'
  | 'select-representative';

export type DialogState =
  | { status: 'idle' }
  | {
      status: 'open';
      scope: DialogScope;
      kind: DialogKind;
      payload?: {
        noteId?: number;
        title?: string;
        initialTitle?: string;
        groupId?: number;
        studyRoomId?: number;
        homeworkId?: number;
        homeworkStudentId?: number;
        content?: string;
        isLast?: boolean;
      };
    };

export type DialogAction =
  | {
      type: 'OPEN';
      scope: DialogScope;
      kind: DialogKind;
      payload?: {
        noteId?: number;
        title?: string;
        initialTitle?: string;
        groupId?: number;
        studyRoomId?: number;
        homeworkId?: number;
        homeworkStudentId?: number;
        content?: string;
        isLast?: boolean;
      };
    }
  | { type: 'GO_TO_CONFIRM' }
  | { type: 'CLOSE' };
