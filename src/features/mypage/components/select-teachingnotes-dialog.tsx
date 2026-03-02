'use client';

import { useReducer } from 'react';
import { toast } from 'react-toastify';

import Image from 'next/image';

import {
  useTeacherRepresentativeTeachingNotes,
  useTeacherTeachingNotes,
  useUpdateTeacherNoteRepresentative,
} from '@/features/mypage/hooks/teacher/use-teaching-notes';
import TeachingnotesItem from '@/features/profile/components/teacher/teachingnotes-item';
import { dialogReducer, initialDialogState } from '@/shared/components/dialog';
import { Accordion, Dialog } from '@/shared/components/ui';

export default function SelectTeachingnotesDialog() {
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  // 대표 수업노트
  const { data: representativeNotes } = useTeacherRepresentativeTeachingNotes();

  // TODO 페이지네이션 또는 무한 스크롤 추가 (현재 고정)
  const { data: allNotesData } = useTeacherTeachingNotes({
    page: 1,
    size: 30,
    sortKey: 'LATEST_EDITED',
  });

  const allNotes = allNotesData?.content;

  const {
    mutate: updateRepresentative,
    isPending,
    variables,
  } = useUpdateTeacherNoteRepresentative();

  const loadingNoteId = isPending ? variables.teachingNoteId : null;

  const toggleNote = (id: number, current: boolean) => {
    if (!current && (representativeNotes?.length ?? 0) >= 5) {
      toast.error('대표 수업노트는 최대 5개까지만 선택할 수 있습니다.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
      return;
    }

    updateRepresentative({ teachingNoteId: id, representative: !current });
  };

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
              {representativeNotes && representativeNotes.length > 0 && (
                <div className="sticky top-0 z-10 mb-2 bg-white">
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

              {(representativeNotes?.length ?? 0) >= 5 && (
                <div className="text-center text-sm">
                  대표 수업노트 5개가 모두 선택되었습니다. 다른 노트를
                  선택하려면 기존 선택을 해제해주세요.
                </div>
              )}

              {/* 하단: 나머지 수업노트 */}
              {allNotes && (
                <div className="space-y-3 overflow-y-auto px-3 py-4">
                  {allNotes.map((note) => (
                    <TeachingnotesItem
                      variant="selectable"
                      key={note.id}
                      teachingnote={note}
                      checked={false}
                      onClick={() => toggleNote(note.id, false)}
                      isLoading={loadingNoteId === note.id}
                    />
                  ))}
                </div>
              )}

              {allNotes && allNotes.length === 0 && (
                <p className="text-text-sub2 my-4 text-center">
                  수업노트가 없습니다.
                </p>
              )}
            </div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
