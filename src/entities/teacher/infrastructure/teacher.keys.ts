export const teacherKeys = {
  all: ['teacher'] as const,
  report: () => [...teacherKeys.all, 'report'] as const,
  noteList: () => [...teacherKeys.all, 'noteList'] as const,
  studyRoomList: () => [...teacherKeys.all, 'studyRoomList'] as const,
  basicInfo: () => [...teacherKeys.all, 'basicInfo'] as const,
};
