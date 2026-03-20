'use client';

import { useCallback, useReducer } from 'react';
import { toast } from 'react-toastify';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  useTeacherRepresentativeTeachingNotes,
  useTeacherTeachingNotes,
  useUpdateTeacherNoteRepresentative,
} from '@/features/mypage/profile/hooks/teacher/use-teaching-notes';
import TeachingnotesItem from '@/features/profile/components/teacher/teachingnotes-item';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { Accordion, Dialog } from '@/shared/components/ui';
import { classifyMypageError, handleApiError } from '@/shared/lib/errors';

export default function SelectTeachingnotesDialog() {
  const router = useRouter();
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  // 대표 수업노트
  const { data: representativeNotes } = useTeacherRepresentativeTeachingNotes();
  // 대표 수업노트가 없을 경우, 최신 노트 5개를 받음
  // 이를 구분하기 위한 변수 (isRepresentative)
  const isRepresentative = representativeNotes?.[0]?.representative ?? false;

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useTeacherTeachingNotes({
      size: 20,
      sortKey: 'TAUGHT_AT_ASC',
    });

  const allNotes = data?.pages.flatMap((page) => page.content) ?? [];

  const {
    mutate: updateRepresentative,
    isPending,
    variables,
  } = useUpdateTeacherNoteRepresentative();

  const loadingNoteId = isPending ? variables.teachingNoteId : null;

  const toggleNote = (id: number, current: boolean) => {
    if (
      isRepresentative &&
      !current &&
      (representativeNotes?.length ?? 0) >= 5
    ) {
      toast.error('대표 수업노트는 최대 5개까지만 선택할 수 있습니다.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
      return;
    }

    updateRepresentative(
      { teachingNoteId: id, representative: !current },
      {
        onError: (error) => {
          handleApiError(error, classifyMypageError, {
            onField: () => {
              // REPRESENTATIVE_LIMIT_EXCEEDED
              // 클라이언트에서 선 차단, 서버 에러는 toast 자동 표시
            },
            onContext: () => {
              // TEACHING_NOTE_NOT_EXIST
              router.refresh();
              setTimeout(() => {
                dispatch({ type: 'CLOSE' });
              }, 1500);
            },
            onAuth: () => {
              // MEMBER_NOT_EXIST
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

  // 무한 스크롤
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    },
    [fetchNextPage]
  );

  // 수업노트 목록 렌더링 (로딩 / 빈 상태 / 목록)
  let noteList;
  if (isLoading) {
    noteList = (
      <p className="text-text-sub2 my-4 text-center">불러오는 중...</p>
    );
  } else if (allNotes.length === 0) {
    noteList = (
      <p className="text-text-sub2 my-4 text-center">수업노트가 없습니다.</p>
    );
  } else {
    noteList = (
      <div className="space-y-3 overflow-y-auto px-3 py-4">
        {allNotes.map((note) => (
          <TeachingnotesItem
            variant="selectable"
            key={note.id}
            teachingnote={note}
            checked={note.representative}
            onClick={() => toggleNote(note.id, note.representative)}
            isLoading={loadingNoteId === note.id}
          />
        ))}

        <div ref={sentinelRef} />

        {isFetchingNextPage && (
          <p className="text-text-sub2 text-center text-sm">불러오는 중...</p>
        )}
      </div>
    );
  }

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
        <Image
          src={'/common/settings.svg'}
          alt="대표 수업노트 설정"
          width={20}
          height={20}
        />
      </button>

      <Dialog
        isOpen={dialog.status === 'open'}
        onOpenChange={() => dispatch({ type: 'CLOSE' })}
      >
        <Dialog.Content className="flex h-150 max-w-200 flex-col gap-6">
          <Dialog.Header>
            <div className="max-desktop:flex-col flex items-center gap-2">
              <Dialog.Title>대표 수업노트 선택</Dialog.Title>
              <Dialog.Description className="font-caption-normal text-text-sub2 flex gap-1">
                <Image
                  src={'/common/info.svg'}
                  alt="선택 안내"
                  width={12}
                  height={12}
                />
                <span>대표 수업노트는 5개까지 선택가능해요!</span>
              </Dialog.Description>
            </div>
          </Dialog.Header>
          <Dialog.Body>
            <div>
              {/* 상단: 대표 수업노트 */}
              {representativeNotes && isRepresentative && (
                <div className="sticky top-0 mb-2 bg-white">
                  <Accordion
                    type="single"
                    collapsible
                  >
                    <Accordion.Item value="representative">
                      <Accordion.Trigger className="cursor-pointer">
                        대표 ({representativeNotes.length}/5)
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div className="text-text-main space-y-3 overflow-y-auto">
                          {representativeNotes.map((note) => (
                            <TeachingnotesItem
                              variant="selectable"
                              key={note.id}
                              teachingnote={note}
                              checked={true}
                              onClick={() => toggleNote(note.id, true)}
                              isLoading={loadingNoteId === note.id}
                            />
                          ))}
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              )}

              {isRepresentative && (representativeNotes?.length ?? 0) >= 5 && (
                <div className="text-center text-sm">
                  대표 수업노트 5개가 모두 선택되었습니다. 다른 노트를
                  선택하려면 기존 선택을 해제해주세요.
                </div>
              )}

              {/* 하단: 나머지 수업노트 */}
              {noteList}
            </div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
