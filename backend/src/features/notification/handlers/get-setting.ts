import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { notificationRepository } from '../../../repositories/notification';
import { dummyUserId } from '../../../lib/auth';

export const getNotificationSetting = async (c: Context) => {
  const db = getDb(c);
  const setting = await notificationRepository(db).getSettingByUserId(dummyUserId);

  if (!setting) {
    return c.json({ error: 'notification setting not found' }, 404);
  }

  return c.json(setting);
};
