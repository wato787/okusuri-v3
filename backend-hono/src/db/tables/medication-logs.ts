import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const medicationLogs = sqliteTable('medication_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  hasBleeding: integer('has_bleeding', { mode: 'boolean' })
    .default(false)
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
