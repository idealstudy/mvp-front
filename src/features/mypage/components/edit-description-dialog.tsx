'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { FrontendTeacherDescription } from '@/entities/teacher';
import { useUpdateTeacherDescription } from '@/features/mypage/hooks/teacher/use-description';
import {
  ConfirmDialog,
  DialogAction,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import {
  TextEditor,
  mergeResolvedContentWithMediaIds,
  parseEditorContent,
  prepareContentForSave,
  useTextEditor,
} from '@/shared/components/editor';
import { Button, Dialog } from '@/shared/components/ui';
import { classifyMypageError, handleApiError } from '@/shared/lib/errors';
import { Pen } from 'lucide-react';

type EditHighlightDialogProps = {
  description?: FrontendTeacherDescription;
};

export default function EditHighlightDialog({
  description,
}: EditHighlightDialogProps) {
  const router = useRouter();
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { value, onChange } = useTextEditor();
  const updateTeacherDescriptionMutation = useUpdateTeacherDescription();

  // 값 변경 비교
  const initialValue = useRef<typeof value>(null);
  const isDirty =
    JSON.stringify(value) !== JSON.stringify(initialValue.current);

  useEffect(() => {
    if (!description) return;

    const source = parseEditorContent(description.description || '');
    const resolved = parseEditorContent(
      description.resolvedDescription.content || ''
    );

    const merged = mergeResolvedContentWithMediaIds(source, resolved);
    onChange(merged);

    initialValue.current = merged;

    // onChange는 useTextEditor 내부의 setValue 래퍼로 안정적이나 useCallback으로 감싸지지 않아 eslint-disable 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const handleSave = () => {
    const { contentString, mediaIds } = prepareContentForSave(value);

    updateTeacherDescriptionMutation.mutate(
      { description: contentString, mediaIds },
      {
        onSuccess: () => {
          dispatch({ type: 'CLOSE' });
        },
        onError: (error) => {
          handleApiError(error, classifyMypageError, {
            onAuth: () => {
              setTimeout(() => {
                router.replace('/login');
              }, 1500);
            },
            onUnknown: () => {},
          });
        },
      }
    );
  };

  // 에디터 닫기 시도 시 변경사항 있으면 confirm 모달만 열기
  // dialogReducer와 별도 관리: ConfirmDialog의 CLOSE가 에디터 상태까지 닫아버리는 문제 방지
  const handleEditorClose = (open: boolean) => {
    if (!open && isDirty) {
      setIsConfirmOpen(true);
      return;
    }

    dispatch({ type: 'CLOSE' });
  };

  // ConfirmDialog의 dispatch prop 타입이 (action: DialogAction) => void이므로 setIsConfirmOpen을 감싸서 넘겨야 함
  const confirmDispatch = (action: DialogAction) => {
    if (action.type === 'CLOSE') setIsConfirmOpen(false);
  };

  // 다이얼로그가 닫힌 후 에디터 값을 초기값으로 복원
  // 닫히는 시점에 onChange를 호출하면 아직 마운트된 TextEditor에서 flushSync 충돌이 발생하므로 여기서 처리
  useEffect(() => {
    if (dialog.status === 'idle' && initialValue.current) {
      onChange(initialValue.current);
    }
    // onChange는 useTextEditor 내부의 setValue 래퍼로 안정적이나 useCallback으로 감싸지지 않아 eslint-disable 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.status]);

  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: 'OPEN',
            scope: 'note',
            kind: 'select-representative',
          })
        }
        className="cursor-pointer"
      >
        <Pen />
      </button>

      <Dialog
        isOpen={dialog.status === 'open'}
        onOpenChange={handleEditorClose}
      >
        <Dialog.Content className="flex h-150 max-w-200 flex-col gap-6">
          <Dialog.Header>
            <Dialog.Title>선생님 특징 편집</Dialog.Title>
          </Dialog.Header>
          {/* 에디터 내부에만 스크롤이 생기도록 .notion-editor에 직접 스타일링 */}
          <Dialog.Body className="flex min-h-0 flex-1 flex-col overflow-hidden [&_.notion-editor]:min-h-0 [&_.notion-editor]:flex-1 [&_.notion-editor>div:last-child]:min-h-0 [&_.notion-editor>div:last-child]:flex-1">
            <TextEditor
              value={value}
              onChange={onChange}
              placeholder="선생님의 특징을 자유롭게 작성해주세요."
              maxHeight="100%"
            />
          </Dialog.Body>
          <Dialog.Footer className="self-end">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outlined"
                size="small"
              >
                취소
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={handleSave}
              disabled={updateTeacherDescriptionMutation.isPending || !isDirty}
            >
              저장
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      {
        <ConfirmDialog
          open={isConfirmOpen}
          dispatch={confirmDispatch}
          variant="confirm-cancel"
          title="작성 중인 내용이 사라집니다."
          description="닫으시겠습니까?"
          confirmText="닫기"
          cancelText="계속 작성"
          onConfirm={() => {
            setIsConfirmOpen(false);
            dispatch({ type: 'CLOSE' });
          }}
          onCancel={() => setIsConfirmOpen(false)}
          emphasis="title-strong"
        />
      }
    </>
  );
}
