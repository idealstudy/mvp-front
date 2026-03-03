'use client';

import { useReducer, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FrontendTeacherCareerListItem } from '@/entities/teacher';
import CareerDialog from '@/features/mypage/components/career-dialog';
import { useDeleteTeacherCareer } from '@/features/mypage/hooks/teacher/use-careers';
import {
  ConfirmDialog,
  dialogReducer,
  initialDialogState,
} from '@/shared/components/dialog';
import { DropdownMenu } from '@/shared/components/ui';
import { classifyMypageError, handleApiError } from '@/shared/lib/errors';

export function CareerDropdown({
  career,
}: {
  career: FrontendTeacherCareerListItem;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  const deleteTeacherCareerMutation = useDeleteTeacherCareer();

  const handleDelete = () => {
    deleteTeacherCareerMutation.mutate(career.id, {
      onSuccess: () => {
        dispatch({ type: 'CLOSE' });
      },
      onError: (error) => {
        handleApiError(error, classifyMypageError, {
          onContext: () => {
            // CAREER_NOT_EXIST
            router.refresh();
            dispatch({ type: 'CLOSE' });
          },
          onAuth: () => {
            // CAREER_AND_TEACHER_NOT_MATCH
            // MEMBER_NOT_EXIST
            setTimeout(() => {
              router.replace('/login');
            }, 1500);
          },
          onUnknown: () => {},
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={() => setIsOpen((prev) => !prev)}
      >
        <DropdownMenu.Trigger>
          <Image
            src="/studynotes/gray-kebab.svg"
            width={24}
            height={24}
            alt="dropdown-icon"
            className="cursor-pointer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[110px] justify-center">
          <DropdownMenu.Item
            onClick={() => setIsCareerDialogOpen(true)}
            aria-label="경력 수정"
            className="justify-center"
          >
            <p>수정하기</p>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => {
              dispatch({
                type: 'OPEN',
                scope: 'profile',
                kind: 'delete',
              });
            }}
            className="justify-center"
            variant="danger"
          >
            삭제하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* 경력 Dialog */}
      {isCareerDialogOpen && (
        <CareerDialog
          isOpen={isCareerDialogOpen}
          onOpenChange={setIsCareerDialogOpen}
          career={career}
        />
      )}

      {/* 삭제 confirm Dialog */}
      {dialog.status === 'open' && (
        <ConfirmDialog
          variant="delete"
          open={dialog.status === 'open'}
          dispatch={dispatch}
          onConfirm={handleDelete}
          emphasis="none"
          title="해당 경력을 삭제하시겠습니까?"
          description="삭제된 경력은 복구할 수 없습니다."
        />
      )}
    </>
  );
}
