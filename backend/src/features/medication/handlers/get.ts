import type { Context } from 'hono';
import { getDb } from '../../../context/helpers';
import { medicationRepository } from '../../../repositories/medication';
import { dummyUserId } from '../../../lib/auth';

export const getMedicationLog = async (c: Context) => {
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
  
  const log = await medicationRepository.getLogById(db, dummyUserId, id);

  if (!log) {
    return c.json({ 
      success: false,
      message: 'medication log not found',
      errorCode: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    }, 404);
  }

  return c.json({
    success: true,
    data: log,
    timestamp: new Date().toISOString()
  });
};
