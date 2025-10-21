import { z } from 'zod';
import type { Medication, MedicationLog } from '@okusuri/shared';

// 薬のログスキーマ（既存のビジネスロジック用）
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

// 共通の薬の型定義を使用するスキーマ
export const medicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
}) satisfies z.ZodType<Medication>;

export const medicationLogCommonSchema = z.object({
  id: z.string(),
  medicationId: z.string(),
  takenAt: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
}) satisfies z.ZodType<MedicationLog>;
