import { createId } from '@/shared/lib/create-id';

/** iPad 필기 세션 — 서버(.cursor/drawing-captures)로 자동 전송 */

export type CapturedCoalesced = {
  clientX: number;
  clientY: number;
  pressure: number;
  timeStamp: number;
};

export type CapturedPointerEvent = {
  phase: string;
  timeStamp: number;
  pointerId: number;
  pointerType: string;
  clientX: number;
  clientY: number;
  pressure: number;
  buttons: number;
  coalesced: CapturedCoalesced[];
};

export type StrokeCapturePayload = {
  kind: 'stroke';
  sessionId: string;
  strokeId: string;
  documentId?: string;
  tool: string;
  pointCount: number;
  events: CapturedPointerEvent[];
  canvas: { width: number; height: number };
  userAgent: string;
  capturedAt: number;
};

export type PingCapturePayload = {
  kind: 'ping';
  sessionId: string;
  documentId?: string;
  userAgent: string;
  capturedAt: number;
};

const INGEST_URL = '/api/drawing-session-ingest';
const PENDING_KEY = 'drawing-capture-pending';

let sessionId = createId();
let documentIdRef = 'unknown';
let strokeEvents: CapturedPointerEvent[] = [];

export function resetCaptureSession(docId?: string) {
  sessionId = createId();
  documentIdRef = docId ?? documentIdRef;
  strokeEvents = [];
  void sendPing();
  void drainPendingQueue();
}

export function setCaptureDocumentId(docId: string) {
  documentIdRef = docId;
}

export function beginCaptureStroke() {
  strokeEvents = [];
  void drainPendingQueue();
}

function serializeCoalesced(e: PointerEvent): CapturedCoalesced[] {
  if (typeof e.getCoalescedEvents !== 'function') return [];
  const list = e.getCoalescedEvents();
  return list.map((ev) => ({
    clientX: ev.clientX,
    clientY: ev.clientY,
    pressure: ev.pressure,
    timeStamp: ev.timeStamp,
  }));
}

export function capturePointerEvent(e: PointerEvent, phase: string) {
  strokeEvents.push({
    phase,
    timeStamp: e.timeStamp,
    pointerId: e.pointerId,
    pointerType: e.pointerType,
    clientX: e.clientX,
    clientY: e.clientY,
    pressure: e.pressure,
    buttons: e.buttons,
    coalesced: serializeCoalesced(e),
  });
}

export function capturePhase(phase: string) {
  strokeEvents.push({
    phase,
    timeStamp: performance.now(),
    pointerId: -1,
    pointerType: 'marker',
    clientX: 0,
    clientY: 0,
    pressure: 0,
    buttons: 0,
    coalesced: [],
  });
}

function readPendingQueue(): StrokeCapturePayload[] {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StrokeCapturePayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePendingQueue(items: StrokeCapturePayload[]) {
  if (typeof sessionStorage === 'undefined') return;
  if (items.length === 0) {
    sessionStorage.removeItem(PENDING_KEY);
    return;
  }
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(items));
}

function queuePending(payload: StrokeCapturePayload) {
  writePendingQueue([...readPendingQueue(), payload]);
}

async function postPayload(body: string): Promise<boolean> {
  try {
    const res = await fetch(INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendPayload(
  payload: StrokeCapturePayload | PingCapturePayload
): Promise<void> {
  const body = JSON.stringify(payload);

  if (await postPayload(body)) return;

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const ok = navigator.sendBeacon(
      INGEST_URL,
      new Blob([body], { type: 'application/json' })
    );
    if (ok) return;
  }

  if (payload.kind === 'stroke') {
    queuePending(payload);
  }
}

export async function drainPendingQueue() {
  const pending = readPendingQueue();
  if (pending.length === 0) return;

  const remaining: StrokeCapturePayload[] = [];
  for (const item of pending) {
    const ok = await postPayload(JSON.stringify(item));
    if (!ok) remaining.push(item);
  }
  writePendingQueue(remaining);
}

export function sendPing() {
  const payload: PingCapturePayload = {
    kind: 'ping',
    sessionId,
    documentId: documentIdRef,
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    capturedAt: Date.now(),
  };
  void sendPayload(payload);
}

export function flushStrokeCapture(meta: {
  strokeId: string;
  tool: string;
  pointCount: number;
  canvasWidth: number;
  canvasHeight: number;
}) {
  const payload: StrokeCapturePayload = {
    kind: 'stroke',
    sessionId,
    strokeId: meta.strokeId,
    documentId: documentIdRef,
    tool: meta.tool,
    pointCount: meta.pointCount,
    events: [...strokeEvents],
    canvas: { width: meta.canvasWidth, height: meta.canvasHeight },
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    capturedAt: Date.now(),
  };

  strokeEvents = [];
  void sendPayload(payload);
}
