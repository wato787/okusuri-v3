// ビジネスロジックの型定義

/**
 * 薬の情報を表す型
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 薬のログ情報を表す型
 */
export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: string;
  notes?: string;
  createdAt: string;
}

/**
 * ユーザー情報を表す型
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 通知設定を表す型
 */
export interface NotificationSetting {
  id: string;
  userId: string;
  medicationId: string;
  time: string; // HH:mm形式
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 薬のサマリー情報（フロントエンド用）
 */
export interface MedicationSummary {
  id: string;
  name: string;
  nextDoseTime?: string;
  isTakenToday: boolean;
  totalDoses: number;
  takenDoses: number;
}

/**
 * エラーレスポンスの型
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  timestamp: string;
}

/**
 * 成功レスポンスの型
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * ページネーション情報の型
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * ページネーション付きレスポンスの型
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}