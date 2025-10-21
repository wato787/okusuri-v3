// API関連の型定義とユーティリティ

/**
 * APIレスポンスの基本型定義
 * すべてのAPIレスポンスの基本となる共通の型
 */
export interface BaseResponse {
  /**
   * 操作の成功/失敗を示すステータス
   */
  success: boolean;

  /**
   * レスポンスに関連するメッセージ（成功時や失敗時のメッセージ）
   */
  message?: string;

  /**
   * エラーが発生した場合のエラーコード
   */
  errorCode?: string;

  /**
   * 操作が処理された時間のタイムスタンプ
   */
  timestamp?: string;
}

/**
 * HTTP APIレスポンスの型
 */
export interface ApiResponse<T> {
  status: number;
  data: T;
  headers: Headers;
}

/**
 * フェッチオプションの型
 */
export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit;
  cache?: RequestCache;
  next?: NextFetchOptions;
  credentials?: RequestCredentials;
}

/**
 * Next.js用のフェッチオプション
 */
export interface NextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * APIエンドポイントの定数
 */
export const API_ENDPOINTS = {
  // 薬関連
  MEDICATIONS: '/api/medications',
  MEDICATION_LOGS: '/api/medication-logs',
  
  // ユーザー関連
  USERS: '/api/users',
  
  // 通知関連
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_SETTINGS: '/api/notification-settings',
  
  // ヘルスチェック
  HEALTH: '/api/health',
} as const;

/**
 * HTTPステータスコードの定数
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * エラーコードの定数
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  MEDICATION_NOT_FOUND: 'MEDICATION_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_DOSAGE: 'INVALID_DOSAGE',
  INVALID_FREQUENCY: 'INVALID_FREQUENCY',
} as const;