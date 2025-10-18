export type MedicationStatus = {
  currentStreak: number;          // 現在の連続服用日数
  isRestPeriod: boolean;          // 休薬期間中かどうか
  restDaysLeft: number;           // 休薬期間の残り日数（休薬期間中の場合）
  consecutiveBleedingDays: number; // 連続出血日数
};
