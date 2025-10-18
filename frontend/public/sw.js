// Service Worker for Web Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'お薬の時間です',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: data.data || {},
      vibrate: [100, 50, 100],
      tag: 'medication-reminder',
      renotify: true,
      actions: [
        {
          action: 'open',
          title: '確認する'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'お薬通知', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open' || event.action === '') {
    // ユーザーがメインページに移動するようにする
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // 既に開いているウィンドウがあればそれをフォーカス
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('/record') && 'focus' in client) {
            return client.focus();
          }
        }
        // なければ新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow('/record');
        }
      })
    );
  }
});

// サービスワーカーのインストール時に実行
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// サービスワーカーのアクティブ化時に実行
self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
