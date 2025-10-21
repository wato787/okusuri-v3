import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';

export const listMedicationLogs = async (c: Context) => {
  const db = getDb(c);
  const logs = await medicationRepository.getLogsByUserId(db, dummyUserId);
  return c.json(logs);
};
