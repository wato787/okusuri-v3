// serviceWorkerDebug.js

/**
 * サービスワーカーの診断を行うツール
 */
export async function debugServiceWorker() {
  console.log("=== サービスワーカー診断を開始 ===");
  
  // サービスワーカーのサポート確認
  if (!('serviceWorker' in navigator)) {
    console.log("このブラウザはサービスワーカーをサポートしていません");
    return;
  }
  
  try {
    // 登録済みのサービスワーカーを取得
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`登録されているサービスワーカー数: ${registrations.length}`);
    
    // 各サービスワーカーの情報を表示
    registrations.forEach((registration, index) => {
      console.log(`[${index + 1}] サービスワーカー情報:`);
      console.log(`  - スコープ: ${registration.scope}`);
      console.log(`  - 更新状態: ${registration.updateViaCache}`);
      console.log(`  - アクティブ: ${!!registration.active}`);
      console.log(`  - インストール待ち: ${!!registration.installing}`);
      console.log(`  - 待機中: ${!!registration.waiting}`);
    });
    
    // 複数のサービスワーカーが存在する場合の警告
    if (registrations.length > 1) {
      console.warn("⚠️ 複数のサービスワーカーが登録されています！これが通知の重複の原因かもしれません");
      console.log("対応策: すべてのサービスワーカーを登録解除して再登録してください");
    }
    
    // メッセージングの確認
    if (window.firebase?.messaging) {
      console.log("Firebase Messagingが初期化されています");
    } else {
      console.log("Firebase Messagingが初期化されていないか、利用できません");
    }
    
    // 通知権限の確認
    if ("Notification" in window) {
      const permission = Notification.permission;
      console.log(`通知の権限状態: ${permission}`);
    }
    
  } catch (error) {
    console.error("サービスワーカー診断中にエラーが発生しました:", error);
  }
  
  console.log("=== サービスワーカー診断終了 ===");
}

/**
 * すべてのサービスワーカーを登録解除する
 */
export async function unregisterAllServiceWorkers() {
  console.log("=== すべてのサービスワーカーの登録解除を開始 ===");
  
  if (!('serviceWorker' in navigator)) {
    console.log("このブラウザはサービスワーカーをサポートしていません");
    return false;
  }
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`登録解除する対象: ${registrations.length}個のサービスワーカー`);
    
    const results = await Promise.all(
      registrations.map(async (registration, index) => {
        try {
          const success = await registration.unregister();
          console.log(`[${index + 1}] スコープ ${registration.scope} の登録解除: ${success ? '成功' : '失敗'}`);
          return success;
        } catch (error) {
          console.error(`[${index + 1}] 登録解除中にエラー:`, error);
          return false;
        }
      })
    );
    
    const allSuccess = results.every(result => result === true);
    console.log(`すべてのサービスワーカーの登録解除: ${allSuccess ? '成功' : '一部失敗'}`);
    console.log("=== サービスワーカーの登録解除終了 ===");
    
    return allSuccess;
  } catch (error) {
    console.error("サービスワーカーの登録解除中にエラーが発生しました:", error);
    console.log("=== サービスワーカーの登録解除終了（エラー） ===");
    return false;
  }
}

/**
 * Firebase Messagingのトークンをクリアして再取得する
 */
export async function resetFirebaseMessagingToken(messaging) {
  console.log("=== Firebase Messagingトークンのリセットを開始 ===");
  
  if (!messaging) {
    console.error("Firebaseのmessagingインスタンスが提供されていません");
    return null;
  }
  
  try {
    // 既存のトークンがあれば削除
    const currentToken = await messaging.getToken();
    if (currentToken) {
      console.log(`既存のトークン: ${currentToken.substring(0, 10)}... を削除します`);
      await messaging.deleteToken();
      console.log("既存のトークンを削除しました");
    } else {
      console.log("削除するトークンがありませんでした");
    }
    
    // 新しいトークンを取得
    console.log("新しいトークンを取得中...");
    const newToken = await messaging.getToken({
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    if (newToken) {
      console.log(`新しいトークンを取得しました: ${newToken.substring(0, 10)}...`);
    } else {
      console.error("新しいトークンの取得に失敗しました");
    }
    
    console.log("=== Firebase Messagingトークンのリセット完了 ===");
    return newToken;
  } catch (error) {
    console.error("Firebase Messagingトークンのリセット中にエラーが発生しました:", error);
    console.log("=== Firebase Messagingトークンのリセット終了（エラー） ===");
    return null;
  }
}
