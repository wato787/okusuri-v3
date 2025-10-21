import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import type { Bindings, Variables } from '../../context/bindings';
import { medicationLogSchema, updateMedicationLogSchema } from './schemas';
import { createMedicationLog, listMedicationLogs, getMedicationLog, updateMedicationLog } from './handlers';

const medication = new Hono<{ Bindings: Bindings; Variables: Variables }>();

medication.post('/', zValidator('json', medicationLogSchema), createMedicationLog);
medication.get('/', listMedicationLogs);
medication.get('/:id', getMedicationLog);
medication.patch('/:id', zValidator('json', updateMedicationLogSchema), updateMedicationLog);

export const medicationRoutes = medication;
