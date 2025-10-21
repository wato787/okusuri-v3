import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';

export const getMedicationLog = async (c: Context) => {
  const db = getDb(c);
  const id = Number.parseInt(c.req.param('id'), 10);
  
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid medication log ID' }, 400);
  }
  
  const log = await medicationRepository.getLogById(db, dummyUserId, id);

  if (!log) {
    return c.json({ error: 'medication log not found' }, 404);
  }

  return c.json(log);
};
