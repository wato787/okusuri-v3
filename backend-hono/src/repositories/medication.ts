import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { and, eq } from 'drizzle-orm';

import * as schema from '../db/schema';

export const medicationRepository = {
  async registerLog(
    db: D1Database,
    userId: string,
    input: { hasBleeding: boolean; date?: string }
  ) {
    const client = drizzle(db, { schema });
    const [log] = await client
      .insert(schema.medicationLogs)
      .values({
        userId,
        hasBleeding: input.hasBleeding,
        createdAt: input.date ? new Date(input.date) : new Date(),
      })
      .returning();

    return log;
  },

  async getLogsByUserId(db: D1Database, userId: string) {
    const client = drizzle(db, { schema });
    return client
      .select()
      .from(schema.medicationLogs)
      .where(eq(schema.medicationLogs.userId, userId));
  },

  async getLogById(db: D1Database, userId: string, id: number) {
    const client = drizzle(db, { schema });
    const [log] = await client
      .select()
      .from(schema.medicationLogs)
      .where(
        and(
          eq(schema.medicationLogs.id, id),
          eq(schema.medicationLogs.userId, userId)
        )
      );

    return log ?? null;
  },

  async updateLog(db: D1Database, userId: string, id: number, hasBleeding: boolean) {
    const client = drizzle(db, { schema });
    const result = await client
      .update(schema.medicationLogs)
      .set({ hasBleeding })
      .where(
        and(
          eq(schema.medicationLogs.id, id),
          eq(schema.medicationLogs.userId, userId)
        )
      )
      .returning();

    return result.length > 0;
  },
};
