import { z } from 'zod';

export const registerSettingSchema = z.object({
  isEnabled: z.boolean(),
  platform: z.string(),
  subscription: z.string().optional(),
});
