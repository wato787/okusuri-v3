import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { desc, eq } from 'drizzle-orm';

import * as schema from '../db/schema';

export const notificationRepository = (db: D1Database) => {
  const client = drizzle(db, { schema });

  return {
    getSettingByUserId(userId: string) {
      return client
        .select()
        .from(schema.notificationSettings)
        .where(eq(schema.notificationSettings.userId, userId))
        .orderBy(desc(schema.notificationSettings.updatedAt))
        .limit(1)
        .get();
    },

    registerSetting(setting: {
      userId: string;
      isEnabled: boolean;
      platform: string;
      subscription?: string;
    }) {
      return client.insert(schema.notificationSettings).values({
        userId: setting.userId,
        isEnabled: setting.isEnabled,
        platform: setting.platform,
        subscription: setting.subscription ?? null,
      });
    },

    getAllSettings() {
      return client.select().from(schema.notificationSettings);
    },
  };
};
