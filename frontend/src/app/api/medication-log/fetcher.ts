import { get, } from "@/utils/apiBase";
import type { MedicationLog, } from "./schema";

/**
 * 服薬ログ一覧を取得する関数
 */
export const getMedicationLogs = async () => {
  const res = await get<MedicationLog[]>("/medication-log", {
    cache: "no-store", // 常に最新データを取得するため
    next: {
      tags: ["medication-logs"],
    },
  });
  
  if (res.status !== 200) {
    return undefined;
  }
  
  return res.data;
};

/**
 * 特定の服薬ログを取得する関数
 */
export const getMedicationLogById = async (id: number) => {
  const res = await get<MedicationLog>(`/medication-log/${id}`, {
    cache: "no-store",
    next: {
      tags: [`medication-log-${id}`],
    },
  });
  
  if (res.status !== 200) {
    return undefined;
  }
  
  return res.data;
};
