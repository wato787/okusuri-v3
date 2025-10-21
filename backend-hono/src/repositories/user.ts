import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';

import * as schema from '../db/schema';

export const userRepository = (db: D1Database) => {
  const client = drizzle(db, { schema });

  return {
    getAllUsers() {
      return client.select().from(schema.users);
    },
  };
};
