import { z } from "zod";

const medicationLog = z.object({
  id: z.string(),
  userId: z.string(),
  hasBleeding: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MedicationLog = z.infer<typeof medicationLog>;