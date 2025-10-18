// 服薬ログのレスポンス型定義
export type MedicationLog = {
  id: number;
  userId: string;
  hasBleeding: boolean;
  createdAt: string;
  updatedAt: string;
};

// 服薬ログリクエスト型定義
export type MedicationLogRequest = {
  hasBleeding: boolean;
};
