// Push 수신용 최소한 작성
// TODO 캐싱 추가
self.addEventListener('push', (event) => {
  const data = (() => {
    try {
      return event.data?.json() ?? {};
    } catch {
      return { title: event.data?.text() ?? '알림' };
    }
  })();

  event.waitUntil(
    self.registration.showNotification(data.title ?? '알림', {
      body: data.body ?? '',
      icon: '/icons/icon-192.png',
    })
  );
});

// TODO 알림 종류별로 특정 페이지로 이동
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((list) => {
        if (list.length > 0) return list[0].focus();
        return clients.openWindow('/');
      })
  );
});
