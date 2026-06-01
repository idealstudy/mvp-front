import { PDFDocument } from 'pdf-lib';

import { renderStrokes } from '../model/use-drawing-canvas';
import type { Stroke } from '../types';

const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// react-pdf 렌더 배율(1.5)과 맞춰 스트로크 굵기가 화면과 동일하게 출력됨
const RENDER_SCALE = 1.5;

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function exportPdf(
  pdfUrl: string | null,
  allStrokes: Record<number, Stroke[]>
): Promise<void> {
  let pdfDoc: PDFDocument;

  if (pdfUrl) {
    const bytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
    pdfDoc = await PDFDocument.load(bytes);
  } else {
    pdfDoc = await PDFDocument.create();
    const strokePages = Object.keys(allStrokes)
      .map(Number)
      .filter((n) => (allStrokes[n]?.length ?? 0) > 0);
    const pageCount = strokePages.length > 0 ? Math.max(...strokePages) : 1;
    for (let i = 0; i < pageCount; i++) pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  }

  const pages = pdfDoc.getPages();

  for (const [pageNumStr, strokes] of Object.entries(allStrokes)) {
    const pageIndex = Number(pageNumStr) - 1;
    const page = pages[pageIndex];
    if (!page || !strokes?.length) continue;

    const { width, height } = page.getSize();

    // 화면 렌더와 동일한 함수로 오프스크린 캔버스에 그림
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * RENDER_SCALE);
    canvas.height = Math.round(height * RENDER_SCALE);
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    renderStrokes(ctx, strokes);

    // PNG(투명 배경)로 변환 후 PDF 페이지에 오버레이
    const pngBytes = dataUrlToBytes(canvas.toDataURL('image/png'));
    const pngImage = await pdfDoc.embedPng(pngBytes);
    page.drawImage(pngImage, { x: 0, y: 0, width, height });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'submission.pdf';
  anchor.click();
  URL.revokeObjectURL(url);
}
