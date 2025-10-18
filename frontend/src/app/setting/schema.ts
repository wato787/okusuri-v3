import { z } from "zod";

export const registerNotificationSettingSchama = z.object({
	subscription: z.string(), // FCMトークンをsubscriptionに変更
	isEnabled: z.boolean(),
	platform: z.enum(["ios", "android", "web"]),
});

export type RegisterNotificationSetting = z.infer<
	typeof registerNotificationSettingSchama
>;

const notificationSettingSchema = z.object({
	id: z.string(),
	userId: z.string(),
	isEnabled: z.boolean(),
	subscription: z.string(), // FCMトークンをsubscriptionに変更
	platform: z.enum(["ios", "android", "web"]),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type NotificationSetting = z.infer<typeof notificationSettingSchema>;
