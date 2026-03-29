'use client';

import { ReactNode, useEffect, useState } from 'react';

import {
  useConsultationDetail,
  useConsultationList,
  useCreateConsultation,
  useDeleteConsultation,
  useUpdateConsultation,
} from '@/features/member/hooks/use-consultation';
import { parseEditorContent } from '@/shared/components/editor';
import { showBottomToast } from '@/shared/components/ui';
import { Dialog } from '@/shared/components/ui/dialog';
import { cn, formatDateDot, toPlainText } from '@/shared/lib';
import { ChevronLeft, Info, X } from 'lucide-react';

import { ConsultationDetail } from './detail';
import { ConsultationForm } from './form';
import { ConsultationList } from './list';

// ─────────────────────────────────────────────────────
// Layout (공통 다이얼로그 프레임)
// ─────────────────────────────────────────────────────

type LayoutProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  navigation?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const ConsultationDialogLayout = ({
  isOpen,
  onClose,
  title,
  navigation,
  children,
  footer,
}: LayoutProps) => {
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Content className="tablet:h-[80vh] tablet:max-w-[600px] desktop:h-[602px] desktop:w-[720px] desktop:max-w-[720px] h-[85vh] max-w-[calc(100%-2rem)] gap-0 overflow-y-hidden p-6">
        <Dialog.Header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <Dialog.Title className="min-w-0 flex-1">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-7 hover:text-gray-12 shrink-0"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="font-label-normal text-gray-7 flex items-center gap-1">
            <Info size={14} />
            작성된 내용은 학생과 보호자에게도 공유돼요.
          </Dialog.Description>
        </Dialog.Header>

        {navigation && <div className="mb-5">{navigation}</div>}

        <Dialog.Body className="min-h-0">{children}</Dialog.Body>

        {footer && (
          <Dialog.Footer className="mt-6 justify-end">{footer}</Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────
// Tab Nav
// ─────────────────────────────────────────────────────

type TabNavProps = {
  activeTab: 'write' | 'list';
  onTabChange: (tab: 'write' | 'list') => void;
};

export const ConsultationTabNav = ({ activeTab, onTabChange }: TabNavProps) => {
  return (
    <div className="flex gap-2">
      {(['write', 'list'] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              'font-body2-normal rounded-full border px-5 py-2 transition-colors',
              isActive
                ? 'border-key-color-primary text-key-color-primary'
                : 'border-gray-4 text-gray-7 hover:border-gray-6'
            )}
          >
            {tab === 'write' ? '기록 일지 작성' : '기록 일지 기록'}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Controller
// ─────────────────────────────────────────────────────

type View = 'list' | 'form' | 'detail';

type ConsultationDialogsProps = {
  studyRoomId: number;
  studentId: string;
  studentName: string;
  initialView: 'list' | 'form';
  isOpen: boolean;
  isTeacher: boolean;
  onClose: () => void;
};

export const ConsultationDialogs = ({
  studyRoomId,
  studentId,
  studentName,
  initialView,
  isOpen,
  isTeacher,
  onClose,
}: ConsultationDialogsProps) => {
  const numericStudentId = Number(studentId);
  const [view, setView] = useState<View>(initialView);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [accItems, setAccItems] = useState<
    { id: string; date: string; preview: string }[]
  >([]);

  const { data: pageData } = useConsultationList(
    studyRoomId,
    numericStudentId,
    page,
    isOpen
  );

  useEffect(() => {
    if (!pageData) return;
    const newItems = pageData.list.map((item) => ({
      id: String(item.id),
      date: formatDateDot(item.regDate),
      preview: toPlainText(item.content),
    }));
    setAccItems((prev) => (page === 0 ? newItems : [...prev, ...newItems]));
  }, [pageData, page]);

  const hasMore = pageData ? page + 1 < pageData.totalPages : false;

  const { data: detailData, isError } = useConsultationDetail(
    studyRoomId,
    numericStudentId,
    selectedId,
    view === 'detail' && selectedId !== null
  );

  const createMutation = useCreateConsultation(studyRoomId, numericStudentId);
  const updateMutation = useUpdateConsultation(studyRoomId, numericStudentId);
  const deleteMutation = useDeleteConsultation(studyRoomId, numericStudentId);

  const handleTabChange = (tab: 'write' | 'list') =>
    setView(tab === 'write' ? 'form' : 'list');

  const handleSave = (contentString: string, mediaIds: string[]) => {
    createMutation.mutate(
      { content: contentString, mediaIds },
      { onSuccess: () => setView('list') }
    );
  };

  const handleUpdate = (contentString: string, mediaIds: string[]) => {
    if (!selectedId) return;
    updateMutation.mutate(
      { sheetId: selectedId, content: contentString, mediaIds },
      { onSuccess: () => setView('list') }
    );
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const date = formatDateDot(detailData?.regDate ?? new Date());
    deleteMutation.mutate(
      { sheetId: selectedId },
      {
        onSuccess: () => {
          setSelectedId(null);
          setView('list');
          showBottomToast(
            `${date} ${studentName} 학생 기록 일지가 삭제되었어요.`
          );
        },
      }
    );
  };

  if (view === 'form') {
    return (
      <ConsultationForm
        studentId={studentId}
        studentName={studentName}
        isOpen={isOpen}
        isTeacher={isTeacher}
        onClose={onClose}
        onTabChange={handleTabChange}
        onSave={handleSave}
      />
    );
  }

  if (view === 'detail' && selectedId !== null) {
    const fallback = accItems.find((item) => item.id === String(selectedId));
    const date = detailData
      ? formatDateDot(detailData.regDate)
      : (fallback?.date ?? '');

    const content = detailData
      ? (detailData.resolvedContent?.content ?? detailData.content)
      : null;
    if (isError) {
      return (
        <ConsultationDialogLayout
          isOpen={isOpen}
          onClose={onClose}
          title={
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="text-gray-12 -ml-1 shrink-0"
                aria-label="목록으로"
              >
                <ChevronLeft
                  size={24}
                  aria-hidden
                />
              </button>
              <span className="truncate">
                {date ? `${date} 기록 일지` : '기록 일지'}
              </span>
            </div>
          }
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="font-body2-normal text-gray-7">
              기록을 불러오지 못했어요.
            </span>
            <button
              type="button"
              onClick={() => setView('list')}
              className="font-label-normal text-key-color-primary"
            >
              목록으로 돌아가기
            </button>
          </div>
        </ConsultationDialogLayout>
      );
    }

    if (!date || !content)
      return (
        <ConsultationDialogLayout
          isOpen={isOpen}
          onClose={onClose}
          title={
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="text-gray-12 -ml-1 shrink-0 p-1"
                aria-label="목록으로"
              >
                <ChevronLeft
                  size={24}
                  aria-hidden
                />
              </button>
              <span className="truncate">
                {date ? `${date} 기록 일지` : '기록 일지'}
              </span>
            </div>
          }
        >
          <div className="flex flex-1 items-center justify-center">
            <span className="font-body2-normal text-gray-7">
              불러오는 중...
            </span>
          </div>
        </ConsultationDialogLayout>
      );
    return (
      <ConsultationDetail
        isOpen={isOpen}
        isTeacher={isTeacher}
        onClose={onClose}
        onBack={() => setView('list')}
        date={date}
        initialContent={parseEditorContent(content)}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <ConsultationList
      studentName={studentName}
      isOpen={isOpen}
      isTeacher={isTeacher}
      onClose={onClose}
      onTabChange={handleTabChange}
      onSelectItem={(id) => {
        setSelectedId(Number(id));
        setView('detail');
      }}
      items={accItems}
      hasMore={hasMore}
      onLoadMore={() => setPage((p) => p + 1)}
    />
  );
};
