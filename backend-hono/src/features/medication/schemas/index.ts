import { z } from 'zod';

export const medicationLogSchema = z.object({
  hasBleeding: z.boolean(),
  date: z
    .string()
    .datetime({ offset: true })
    .optional(),
});

export const updateMedicationLogSchema = z.object({
  hasBleeding: z.boolean(),
});
