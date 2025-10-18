'use client';

import { urlBase64ToUint8Array } from './urlBase64ToUint8Array';

// Web Push APIの登録・管理を行うクラス
class WebPushClient {
  private swRegistration: ServiceWorkerRegistration | null = null;
  
  // サービスワーカーの登録
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('このブラウザはWeb Push通知をサポートしていません');
      return null;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('サービスワーカーが登録されました', this.swRegistration);
      return this.swRegistration;
    } catch (error) {
      console.error('サービスワーカーの登録に失敗しました:', error);
      return null;
    }
  }

  // Web Push通知の許可を取得
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error('このブラウザは通知をサポートしていません');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('通知の許可取得に失敗しました:', error);
      return false;
    }
  }

  // Push Subscriptionを取得
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      await this.registerServiceWorker();
    }

    if (!this.swRegistration) {
      return null;
    }

    try {
      let subscription = await this.swRegistration.pushManager.getSubscription();
      
      // 既存のサブスクリプションがなければ作成
      if (!subscription) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        
        if (!vapidPublicKey) {
          console.error('VAPID公開キーが設定されていません');
          return null;
        }

        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
      }
      
      return subscription;
    } catch (error) {
      console.error('プッシュ通知の取得に失敗しました:', error);
      return null;
    }
  }

  // サブスクリプションを解除
  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('サブスクリプションの解除に失敗しました:', error);
      return false;
    }
  }
}

// Web Push APIクライアントのシングルトンインスタンス
export const webPushClient = new WebPushClient();

// Web Push通知を初期化し、サブスクリプションを取得する関数
export async function initializeWebPush(): Promise<string | null> {
  try {
    // サービスワーカーを登録
    const registration = await webPushClient.registerServiceWorker();
    
    if (!registration) {
      return null;
    }

    // 通知の許可を取得
    const isPermissionGranted = await webPushClient.requestNotificationPermission();
    
    if (!isPermissionGranted) {
      return null;
    }

    // サブスクリプションを取得
    const subscription = await webPushClient.getSubscription();
    
    if (!subscription) {
      return null;
    }

    // サブスクリプション情報をJSON文字列に変換
    return JSON.stringify(subscription);
  } catch (error) {
    console.error('Web Push通知の初期化に失敗しました:', error);
    return null;
  }
}
