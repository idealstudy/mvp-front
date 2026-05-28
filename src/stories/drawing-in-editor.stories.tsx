'use client';

import { useState } from 'react';

import { DrawingExtension } from '@/shared/components/editor/model/drawing-extension';
import { createNotionExtensions } from '@/shared/components/editor/model/extensions';
import { TextEditorValue } from '@/shared/components/editor/types';
import { cn } from '@/shared/lib';
import type { Meta, StoryFn } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditorContent, useEditor } from '@tiptap/react';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// 공개 PDF (스토리북 테스트용 — public/sample.pdf 로 교체 가능)
const SAMPLE_PDF_URL = '/sample.pdf';
const SAMPLE_DOCUMENT_ID = 'story-editor-doc-001';

// 에디터 초기값 — 빈 캔버스 블록 + PDF 블록
const INITIAL_VALUE: TextEditorValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '▼ 빈 캔버스 필기 블록 (PDF 없이 바로 필기)' },
      ],
    },
    {
      type: 'drawing',
      attrs: {
        documentId: 'story-blank-canvas-001',
        pdfUrl: null,
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '▼ PDF 위에 필기하는 블록 (public/sample.pdf 필요)',
        },
      ],
    },
    {
      type: 'drawing',
      attrs: {
        pdfUrl: SAMPLE_PDF_URL,
        documentId: SAMPLE_DOCUMENT_ID,
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '필기를 마친 뒤 툴바의 제출 버튼을 눌러 PDF로 내보낼 수 있습니다.',
        },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────
// 에디터 컴포넌트 (drawing extension 포함)
// ──────────────────────────────────────────────────────────────

function DrawingEditor({ readOnly = false }: { readOnly?: boolean }) {
  const [value, setValue] = useState<TextEditorValue>(INITIAL_VALUE);

  const editor = useEditor({
    extensions: [
      ...createNotionExtensions({ enableSlashCommand: !readOnly }),
      DrawingExtension,
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor: e }) => setValue(e.getJSON()),
    editorProps: {
      attributes: {
        class: cn(
          'outline-none w-full px-4 py-3',
          'prose prose-sm sm:prose-base max-w-none'
        ),
        style: 'min-height: 200px;',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="border-gray-3 focus-within:border-orange-7 focus-within:ring-orange-7/20 relative flex w-full flex-col rounded-lg border bg-white transition-colors focus-within:ring-1">
        {/* 툴바 힌트 */}
        {!readOnly && editor && (
          <div className="border-gray-2 flex items-center gap-2 border-b px-3 py-2">
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setDrawing({ documentId: `blank-${Date.now()}` })
                  .run()
              }
              className="border-gray-3 text-gray-7 hover:bg-gray-1 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <PencilIcon />빈 캔버스 삽입
            </button>
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setDrawing({
                    pdfUrl: SAMPLE_PDF_URL,
                    documentId: `doc-${Date.now()}`,
                  })
                  .run()
              }
              className="border-gray-3 text-gray-7 hover:bg-gray-1 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs"
            >
              <PdfAddIcon />
              PDF 필기 삽입
            </button>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* JSON 상태 표시 (개발 확인용) */}
      <details className="border-gray-2 rounded-lg border text-xs">
        <summary className="text-gray-6 hover:bg-gray-1 cursor-pointer px-3 py-2">
          에디터 JSON 상태 보기
        </summary>
        <pre className="bg-gray-1 text-gray-8 max-h-48 overflow-auto px-3 py-2">
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Meta
// ──────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Drawing/InEditor',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[700px]">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

// ──────────────────────────────────────────────────────────────
// 스토리 1 — 에디터 안에 drawing 블록 (편집 가능)
// ──────────────────────────────────────────────────────────────

export const EditableWithDrawing: StoryFn = () => <DrawingEditor />;
EditableWithDrawing.storyName = '에디터 — 필기 블록 포함 (편집 모드)';

// ──────────────────────────────────────────────────────────────
// 스토리 2 — 읽기 전용 (선생님 뷰 등)
// ──────────────────────────────────────────────────────────────

export const ReadOnlyWithDrawing: StoryFn = () => <DrawingEditor readOnly />;
ReadOnlyWithDrawing.storyName = '에디터 — 필기 블록 포함 (읽기 전용)';

// ──────────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function PdfAddIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="12"
      />
      <line
        x1="9"
        y1="15"
        x2="15"
        y2="15"
      />
    </svg>
  );
}
