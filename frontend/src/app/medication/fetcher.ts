import { get } from "@/utils/apiBase";
import type { MedicationStatus } from "./schema";

/**
 * 服薬ステータスを取得する関数
 */
export const getMedicationStatus = async () => {
	const res = await get<MedicationStatus>("/medication-status", {
		cache: "no-store", // 常に最新データを取得するため
		next: {
			tags: ["medication-status"],
		},
	});
	if (res.status !== 200) {
		return undefined;
	}
	return res.data;
};
