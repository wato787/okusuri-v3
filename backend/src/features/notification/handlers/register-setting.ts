import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { notificationRepository } from '../../../repositories/notification';
import { dummyUserId } from '../../../lib/auth';
import { registerSettingSchema } from '../schemas';

export const registerNotificationSetting = async (c: Context) => {
  const db = getDb(c);
  const body = registerSettingSchema.parse(await c.req.json());

  try {
    await notificationRepository(db).registerSetting({
      userId: dummyUserId,
      isEnabled: body.isEnabled,
      platform: body.platform,
      subscription: body.subscription,
    });

    return c.json({ message: 'notification setting registered successfully' });
  } catch (error) {
    console.error('failed to register notification setting', error);
    return c.json({ error: 'failed to register notification setting' }, 500);
  }
};
