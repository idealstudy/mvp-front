declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/**
 * GTM dataLayer에 이벤트를 푸시하는 함수
 * GTM + Amplitude 동시 전송은 track()을 사용하세요.
 *
 * @param event - 이벤트 이름 (예: 'gnb_logo_click')
 * @param params - 이벤트 파라미터 객체
 *
 * 서버 사이드 렌더링(SSR) 환경에서는 실행되지 않습니다.
 */
export const pushToDataLayer = (
  event: string,
  params?: Record<string, unknown>
): void => {
  // Next.js SSR 환경에서는 window 객체가 없으므로 early return
  if (typeof window === 'undefined') return;

  // dataLayer가 없으면 빈 배열로 초기화
  window.dataLayer = window.dataLayer || [];

  // 이벤트와 파라미터를 함께 dataLayer에 푸시
  // GTM Trigger가 'event' 키워드를 감지하여 해당 이벤트를 처리합니다
  window.dataLayer.push({ event, ...params });
};
