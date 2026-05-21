'use client';

import { useState } from 'react';

import { DrawingExtension } from '@/shared/components/editor/model/drawing-extension';
import { createNotionExtensions } from '@/shared/components/editor/model/extensions';
import { TextEditorValue } from '@/shared/components/editor/types';
import { cn } from '@/shared/lib';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditorContent, useEditor } from '@tiptap/react';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const INITIAL_VALUE: TextEditorValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '아래 블록을 클릭하면 드로잉 모달이 열립니다.' },
      ],
    },
    {
      type: 'drawing',
      attrs: { documentId: 'test-blank-001', pdfUrl: null },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '에디터 안에서 텍스트도 함께 작성할 수 있습니다.',
        },
      ],
    },
  ],
};

function DrawingEditor() {
  const [value, setValue] = useState<TextEditorValue>(INITIAL_VALUE);

  const editor = useEditor({
    extensions: [
      ...createNotionExtensions({ enableSlashCommand: true }),
      DrawingExtension,
    ],
    content: value,
    editable: true,
    onUpdate: ({ editor: e }) => setValue(e.getJSON()),
    editorProps: {
      attributes: {
        class: cn(
          'outline-none w-full px-4 py-3 prose prose-sm sm:prose-base max-w-none'
        ),
        style: 'min-height: 300px;',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* 에디터 */}
      <div className="relative flex w-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-colors focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400/20">
        {/* 미니 툴바 */}
        {editor && (
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setDrawing({ documentId: `blank-${Date.now()}` })
                  .run()
              }
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
            >
              <PencilIcon />빈 캔버스 삽입
            </button>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* JSON 상태 */}
      <details className="rounded-lg border border-gray-200 text-xs">
        <summary className="cursor-pointer px-3 py-2 text-gray-400 hover:bg-gray-50">
          에디터 JSON 상태 보기
        </summary>
        <pre className="max-h-48 overflow-auto bg-gray-50 px-3 py-2 text-gray-700">
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default function TestDrawingPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">Drawing 테스트</h1>
            <p className="mt-1 text-sm text-gray-500">
              필기 블록을 클릭하면 전체화면 드로잉 모달이 열립니다.
            </p>
          </div>
          <DrawingEditor />
        </div>
      </div>
    </QueryClientProvider>
  );
}

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
