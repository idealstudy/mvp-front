'use client';

import { ReactNode, useState } from 'react';

import { TextEditorValue } from '@/shared/components/editor/types';
import { Dialog } from '@/shared/components/ui/dialog';
import { cn, formatDateDot } from '@/shared/lib';
import { Info, X } from 'lucide-react';

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
          <div className="flex items-start justify-between">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-7 hover:text-gray-12 mt-0.5"
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
            {tab === 'write' ? '상담서 작성' : '상담서 기록'}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Dummy data
// ─────────────────────────────────────────────────────

type ConsultationItem = {
  id: string;
  date: string;
  preview: string;
  content: TextEditorValue;
};

const DUMMY_ITEMS: ConsultationItem[] = [
  {
    id: '1',
    date: '2026.02.28',
    preview:
      '상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다'.repeat(
                100
              ),
            },
          ],
        },
      ],
    },
  },
  {
    id: '2',
    date: '2026.02.22',
    preview:
      '상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '두 번째 상담서 내용입니다.' }],
        },
      ],
    },
  },
  {
    id: '3',
    date: '2026.02.15',
    preview: '세 번째 상담서 내용이 들어갑니다.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '세 번째 상담서 내용이 들어갑니다.' },
          ],
        },
      ],
    },
  },
  {
    id: '4',
    date: '2026.02.08',
    preview:
      '네 번째 상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '네 번째 상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다.',
            },
          ],
        },
      ],
    },
  },
  {
    id: '5',
    date: '2026.02.01',
    preview:
      '다섯 번째 상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '다섯 번째 상담서 내용입니다.' }],
        },
      ],
    },
  },
  {
    id: '6',
    date: '2026.01.25',
    preview:
      '여섯 번째 상담서 내용이 들어갑니다 상담서 내용이 들어갑니다상담서 내용이 들어갑니다상담서 내용이 들어갑니다.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '여섯 번째 상담서 내용입니다.' }],
        },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────
// Controller
// ─────────────────────────────────────────────────────

type View = 'list' | 'form' | 'detail';

type ConsultationDialogsProps = {
  studentName: string;
  initialView: 'list' | 'form';
  isOpen: boolean;
  onClose: () => void;
};

export const ConsultationDialogs = ({
  studentName,
  initialView,
  isOpen,
  onClose,
}: ConsultationDialogsProps) => {
  const [view, setView] = useState<View>(initialView);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<ConsultationItem[]>(DUMMY_ITEMS);

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  const handleTabChange = (tab: 'write' | 'list') =>
    setView(tab === 'write' ? 'form' : 'list');

  const handleSave = (content: TextEditorValue) => {
    const date = formatDateDot(new Date());
    const newItem: ConsultationItem = {
      id: String(Date.now()),
      date,
      preview: '',
      content,
    };
    setItems((prev) => [newItem, ...prev]);
    setView('list');
  };

  const handleUpdate = (content: TextEditorValue) => {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, content } : item))
    );
    setView('list');
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <ConsultationForm
        studentName={studentName}
        isOpen={isOpen}
        onClose={onClose}
        onTabChange={handleTabChange}
        onSave={handleSave}
      />
    );
  }

  if (view === 'detail' && selectedItem) {
    return (
      <ConsultationDetail
        isOpen={isOpen}
        onClose={onClose}
        onBack={() => setView('list')}
        date={selectedItem.date}
        initialContent={selectedItem.content}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <ConsultationList
      studentName={studentName}
      isOpen={isOpen}
      onClose={onClose}
      onTabChange={handleTabChange}
      onSelectItem={(id) => {
        setSelectedId(id);
        setView('detail');
      }}
      items={items}
    />
  );
};
