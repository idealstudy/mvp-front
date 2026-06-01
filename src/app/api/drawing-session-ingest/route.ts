import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

const CAPTURE_DIR = join(process.cwd(), '.cursor/drawing-captures');
const INGEST_LOG = join(CAPTURE_DIR, 'ingest.jsonl');
const LATEST_FILE = join(CAPTURE_DIR, 'latest-stroke.json');

function isCaptureAllowed() {
  return process.env.NODE_ENV !== 'production';
}

function persistPayload(payload: unknown) {
  mkdirSync(CAPTURE_DIR, { recursive: true });
  const line = `${JSON.stringify(payload)}\n`;
  appendFileSync(INGEST_LOG, line);
  if (
    typeof payload === 'object' &&
    payload !== null &&
    (payload as { kind?: string }).kind === 'stroke'
  ) {
    writeFileSync(LATEST_FILE, JSON.stringify(payload, null, 2));
  }
}

async function parseBody(request: Request): Promise<unknown> {
  const raw = await request.text();
  if (!raw) return null;
  return JSON.parse(raw) as unknown;
}

/** 개발 전용 — iPad 필기 캡처를 워크스페이스에 저장 (에이전트가 Read) */
export async function POST(request: Request) {
  if (!isCaptureAllowed()) {
    return new Response(null, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await parseBody(request);
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  if (payload === null) {
    return new Response('empty body', { status: 400 });
  }

  persistPayload(payload);
  return Response.json({ ok: true });
}

/** 에이전트·연결 확인용 */
export async function GET() {
  if (!isCaptureAllowed()) {
    return new Response(null, { status: 404 });
  }

  let strokeCount = 0;
  if (existsSync(INGEST_LOG)) {
    const text = readFileSync(INGEST_LOG, 'utf8');
    strokeCount = text
      .split('\n')
      .filter((line) => line.trim().length > 0).length;
  }

  return Response.json({
    ok: true,
    strokeCount,
    hasLatest: existsSync(LATEST_FILE),
    captureDir: CAPTURE_DIR,
  });
}
