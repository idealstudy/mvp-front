'use client';

import { useState } from 'react';

import { ClearIcon } from '@/shared/components/icons';
import { Button, Dialog, TextField } from '@/shared/components/ui';
import { Info, X } from 'lucide-react';

interface StudyRoomClassLinksInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, url: string) => void;
  defaultName?: string;
  defaultUrl?: string;
}

export const StudyroomClassLinksInputDialog = ({
  isOpen,
  onClose,
  onConfirm,
  defaultName,
  defaultUrl,
}: StudyRoomClassLinksInputDialogProps) => {
  const type = defaultName && defaultUrl ? 'edit' : 'add';
  const [linkName, setLinkName] = useState(defaultName ?? '');
  const [linkUrl, setLinkUrl] = useState(defaultUrl ?? '');

  const handleClose = () => {
    setLinkName('');
    setLinkUrl('');
    onClose();
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlError = linkUrl.length > 0 && !isValidUrl(linkUrl);

  const hasDefaults = defaultName !== undefined && defaultUrl !== undefined;
  const isDisabled = hasDefaults
    ? linkName === defaultName && linkUrl === defaultUrl
    : !linkName.trim() || !linkUrl.trim() || isUrlError;

  const handleConfirm = () => {
    if (isDisabled) return;
    onConfirm(linkName, linkUrl);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleClose}
    >
      <Dialog.Content className="max-w-[520px] gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Dialog.Title>
              수업 링크 {type === 'add' ? '추가' : '수정'}
            </Dialog.Title>
            <div className="text-gray-7 font-body2-normal flex items-center gap-1">
              <div className="flex h-6 w-6 p-1">
                <Info size={16} />
              </div>
              <span>현재는 링크 5개만 등록할 수 있어요.</span>
            </div>
          </div>
          <Dialog.Close
            className="text-gray-9 hover:text-gray-12 flex h-6 w-6 cursor-pointer items-center justify-center"
            aria-label="닫기"
          >
            <X size={34} />
          </Dialog.Close>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <TextField
            value={linkName}
            onChange={setLinkName}
            label={
              <TextField.Label className="font-body1-heading text-gray-12 mb-2 text-[18px]">
                링크 이름
              </TextField.Label>
            }
          >
            <TextField.Input
              placeholder="링크 이름을 작성해주세요 (예: 에듀반 비대면 바로가기)"
              maxLength={20} // 임시 길이 제한
            />
            {linkName.length > 0 && (
              <ClearButton onClick={() => setLinkName('')} />
            )}
          </TextField>

          <TextField
            value={linkUrl}
            onChange={setLinkUrl}
            error={isUrlError}
            errorMessage={
              <TextField.ErrorMessage>
                올바른 주소 형식이 아닙니다.
              </TextField.ErrorMessage>
            }
            label={
              <TextField.Label className="font-body1-heading text-gray-12 mb-2 text-[18px]">
                링크 주소
              </TextField.Label>
            }
          >
            <TextField.Input
              placeholder="수업 링크를 입력해주세요 (예: Zoom 링크)"
              maxLength={500} // 임시 길이 제한
            />
            {linkUrl.length > 0 && (
              <ClearButton onClick={() => setLinkUrl('')} />
            )}
          </TextField>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="small"
            className="h-auto px-12 py-4"
            disabled={isDisabled}
            onClick={handleConfirm}
          >
            {type === 'add' ? '추가' : '수정'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <TextField.Suffix className="-mr-4">
    <button
      type="button"
      onClick={onClick}
      className="text-gray-5 flex h-6 w-6 cursor-pointer items-center justify-center"
      aria-label="Clear"
    >
      <ClearIcon />
    </button>
  </TextField.Suffix>
);
