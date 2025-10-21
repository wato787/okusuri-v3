import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { notificationRepository } from '../../../repositories/notification';
import { userRepository } from '../../../repositories/user';

export const sendNotifications = async (c: Context) => {
  const db = getDb(c);

  try {
    const allUsers = await userRepository(db).getAllUsers();
    const settings = await notificationRepository(db).getAllSettings();

    const latestSettings = new Map<string, (typeof settings)[number]>();
    for (const setting of settings) {
      const existing = latestSettings.get(setting.userId);
      if (!existing || setting.updatedAt > existing.updatedAt) {
        latestSettings.set(setting.userId, setting);
      }
    }

    const sentSubs = new Set<string>();
    let sentCount = 0;

    for (const user of allUsers) {
      const setting = latestSettings.get(user.id ?? '');
      if (!setting || !setting.isEnabled) continue;
      if (setting.subscription && sentSubs.has(setting.subscription)) continue;

      // 実際にはWeb Push送信処理などを呼び出す想定
      sentCount += 1;

      if (setting.subscription) {
        sentSubs.add(setting.subscription);
      }
    }

    return c.json({
      message: 'notification sent successfully',
      sent_count: sentCount,
    });
  } catch (error) {
    console.error('failed to send notifications', error);
    return c.json({ error: 'failed to send notifications' }, 500);
  }
};
