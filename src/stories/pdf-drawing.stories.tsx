'use client';

import { useState } from 'react';

import type { DrawingTool } from '@/shared/components/drawing/types';
import { DrawingToolbar } from '@/shared/components/drawing/ui/drawing-toolbar';
import { PdfDrawingFullscreen } from '@/shared/components/drawing/ui/pdf-drawing-fullscreen';
import type { Meta, StoryFn } from '@storybook/react';

// 공개 PDF 샘플 (스토리북 테스트용)
const SAMPLE_PDF_URL = '/sample.pdf';
const SAMPLE_DOCUMENT_ID = 'storybook-demo-doc';

// ──────────────────────────────────────────────────────────────
// Toolbar 스토리
// ──────────────────────────────────────────────────────────────

const toolbarMeta: Meta = {
  title: 'Drawing/DrawingToolbar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default toolbarMeta;

const ToolbarTemplate: StoryFn<{
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}> = ({ saveStatus }) => {
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState('#1a1a1a');
  const [size, setSize] = useState(4);

  return (
    <div className="bg-gray-12 w-full">
      <DrawingToolbar
        tool={tool}
        color={color}
        size={size}
        canUndo
        canRedo={false}
        saveStatus={saveStatus}
        onToolChange={setTool}
        onColorChange={setColor}
        onSizeChange={setSize}
        onUndo={() => {}}
        onRedo={() => {}}
        onClearAll={() => {}}
        onSave={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};

export const Default = ToolbarTemplate.bind({});
Default.args = { saveStatus: 'idle' };

export const Saving = ToolbarTemplate.bind({});
Saving.args = { saveStatus: 'saving' };

export const Saved = ToolbarTemplate.bind({});
Saved.args = { saveStatus: 'saved' };

export const SaveError = ToolbarTemplate.bind({});
SaveError.args = { saveStatus: 'error' };

// ──────────────────────────────────────────────────────────────
// 전체화면 모달 스토리
// ──────────────────────────────────────────────────────────────

// ── 빈 캔버스 전체화면 ─────────────────────────────────────────

export const BlankCanvasModal: StoryFn = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-2 flex h-screen items-center justify-center">
      <button
        onClick={() => setOpen(true)}
        className="bg-orange-7 hover:bg-orange-8 rounded-xl px-6 py-3 text-sm font-semibold text-white"
      >
        빈 캔버스 필기 열기
      </button>
      {open && (
        <PdfDrawingFullscreen
          documentId="storybook-blank-canvas"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
BlankCanvasModal.parameters = { layout: 'fullscreen' };
BlankCanvasModal.storyName = '빈 캔버스 전체화면';

// ── PDF 전체화면 ───────────────────────────────────────────────

export const FullscreenModal: StoryFn = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-2 flex h-screen items-center justify-center">
      <p className="text-gray-7 absolute top-4 text-sm">
        public/sample.pdf 파일이 있어야 정상 동작합니다.
      </p>
      <button
        onClick={() => setOpen(true)}
        className="bg-orange-7 hover:bg-orange-8 rounded-xl px-6 py-3 text-sm font-semibold text-white"
      >
        PDF 필기 열기
      </button>
      {open && (
        <PdfDrawingFullscreen
          pdfUrl={SAMPLE_PDF_URL}
          documentId={SAMPLE_DOCUMENT_ID}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
FullscreenModal.parameters = { layout: 'fullscreen' };
FullscreenModal.storyName = 'PDF 전체화면';
