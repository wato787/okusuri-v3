import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';
import { medicationLogSchema } from '../schemas';

export const createMedicationLog = async (c: Context) => {
  const body = medicationLogSchema.parse(await c.req.json());
  const db = getDb(c);

  const log = await medicationRepository.registerLog(db, dummyUserId, body);

  return c.json({ message: 'medication log registered successfully', log });
};
