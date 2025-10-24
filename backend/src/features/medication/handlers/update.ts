import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';
import { updateMedicationLogSchema } from '../schemas';

export const updateMedicationLog = async (c: Context) => {
  const db = getDb(c);
  const id = Number.parseInt(c.req.param('id'), 10);
  
  if (Number.isNaN(id)) {
    return c.json({ 
      success: false,
      message: 'Invalid medication log ID',
      errorCode: 'INVALID_ID',
      timestamp: new Date().toISOString()
    }, 400);
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
    return c.json({ 
      success: false,
      message: 'log not found or user not authorized',
      errorCode: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    }, 404);
  }

  return c.json({
    success: true,
    message: 'medication log updated successfully',
    timestamp: new Date().toISOString()
  });
};
