import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';
import { updateMedicationLogSchema } from '../schemas';

export const updateMedicationLog = async (c: Context) => {
  const db = getDb(c);
  const id = Number.parseInt(c.req.param('id'), 10);
  
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid medication log ID' }, 400);
  }
  
  const body = updateMedicationLogSchema.parse(await c.req.json());
  const { hasBleeding } = body;

  const updated = await medicationRepository.updateLog(
    db,
    dummyUserId,
    id,
    hasBleeding
  );

  if (!updated) {
    return c.json({ error: 'log not found or user not authorized' }, 404);
  }

  return c.json({
    success: true,
    message: 'medication log updated successfully',
  });
};
