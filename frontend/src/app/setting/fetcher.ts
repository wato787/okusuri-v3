import { get } from "@/utils/apiBase";
import type { NotificationSetting } from "./schema";

/**
 * 通知設定を取得する関数
 */
export const getNotificationSetting = async () => {
	const res = await get<NotificationSetting | undefined>(
		"/notification/setting",
		{
			cache: "force-cache",
			next: {
				tags: ["notification-setting"],
			},
		},
	);
	if (res.status !== 200) {
		return undefined;
	}
	return res.data;
};
