export const CreateStudyNoteGroupQueryKey = {
  all: ['createStudyNoteGroup'],
  createStudyNoteGroup: (args: { studyRoomId: number; title: string }) => [
    ...CreateStudyNoteGroupQueryKey.all,
    'createStudyNoteGroup',
    args.studyRoomId,
    args.title,
  ],
};

export const UpdateStudyNoteGroupQueryKey = {
  all: ['updateStudyNoteGroup'],
  updateStudyNoteGroup: (args: {
    teachingNoteGroupId: number;
    title: string;
  }) => [
    ...UpdateStudyNoteGroupQueryKey.all,
    'updateStudyNoteGroup',
    args.teachingNoteGroupId,
    args.title,
  ],
};

export const DeleteStudyNoteGroupQueryKey = {
  all: ['deleteStudyNoteGroup'],
  deleteStudyNoteGroup: (args: { teachingNoteGroupId: number }) => [
    ...DeleteStudyNoteGroupQueryKey.all,
    'deleteStudyNoteGroup',
    args.teachingNoteGroupId,
  ],
};
