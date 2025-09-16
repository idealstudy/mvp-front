import { useStudyNoteDetailQuery } from '@/features/dashboard/studynote/detail/service/query';
import { useUpdateStudyNote } from '@/features/studynotes/services/query';
import { ConfirmDialog } from '@/features/studyrooms/components/common/dialog/confirm-dialog';
import { InputDialog } from '@/features/studyrooms/components/common/dialog/input-dialog';
import type {
  DialogAction,
  DialogState,
} from '@/features/studyrooms/hooks/useDialogReducer';

import type { StudyNote, StudyNoteGroupPageable } from '../type';
import { GroupMoveDialog } from './group-move-dialog';

export const StudyNotesDialog = ({
  state,
  dispatch,
  studyRoomId,
  item,
  pageable,
  keyword,
}: {
  state: DialogState;
  dispatch: (action: DialogAction) => void;
  studyRoomId: number;
  item: StudyNote;
  pageable: StudyNoteGroupPageable;
  keyword: string;
}) => {
  // const [error, setError] = useState<string | null>(null);
  const { data, isPending, isError } = useStudyNoteDetailQuery(item.id, {
    enabled: state.status === 'open',
  });

  const { mutate: updateStudyNote } = useUpdateStudyNote();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const handleRename = (name: string) => {
    updateStudyNote(
      {
        teachingNoteId: item.id,
        studyRoomId,
        title: name,
        teachingNoteGroupId: item.groupId ?? null,
        content: data?.content || '',
        visibility: item.visibility,
        taughtAt: item.taughtAt,
        studentIds: data?.studentInfos?.map((student) => student.studentId),
      }
      // {
      //   onError: (error) => {
      //     setError(error.message || '이름 중복');
      //   },
      // }
    );
  };

  if (state.status !== 'open') return null;

  return (
    <>
      {state.scope === 'note' && state.kind === 'rename' && (
        <InputDialog
          isOpen={true}
          placeholder={state.payload?.initialTitle || ''}
          onOpenChange={() => dispatch({ type: 'CLOSE' })}
          title="제목 수정하기"
          description="수업노트 제목"
          onSubmit={(name) => handleRename(name)}
        />
      )}

      {state.scope === 'note' && state.kind === 'group-move' && (
        <GroupMoveDialog
          open
          dispatch={dispatch}
          studyRoomId={studyRoomId}
          studyNoteId={item.id}
          pageable={pageable}
          keyword={keyword}
        />
      )}

      {state.scope === 'note' && state.kind === 'delete' && (
        <ConfirmDialog
          type="delete"
          open
          dispatch={dispatch}
          onDelete={() => dispatch({ type: 'GO_TO_CONFIRM' })}
          title="수업 노트를 삭제하시겠습니까?"
          description="삭제된 수업노트는 복구할 수 없습니다."
        />
      )}

      {state.scope === 'note' && state.kind === 'onConfirm' && (
        <ConfirmDialog
          type="confirm"
          open
          dispatch={dispatch}
          description="수업노트가 삭제되었습니다."
        />
      )}
    </>
  );
};
