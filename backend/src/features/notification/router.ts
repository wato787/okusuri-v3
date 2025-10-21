import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { Bindings, Variables } from '../../context/bindings';
import { registerSettingSchema } from './schemas';
import { sendNotifications, getNotificationSetting, registerNotificationSetting } from './handlers';

const notification = new Hono<{ Bindings: Bindings; Variables: Variables }>();

notification.post('/', sendNotifications);
notification.get('/setting', getNotificationSetting);
notification.post('/setting', zValidator('json', registerSettingSchema), registerNotificationSetting);

export const notificationRoutes = notification;
