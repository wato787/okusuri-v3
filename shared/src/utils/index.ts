// 共通ユーティリティ関数

/**
 * 日付をフォーマットする関数
 * @param date フォーマットする日付
 * @param format フォーマット文字列（デフォルト: 'YYYY-MM-DD'）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 現在の日時をISO文字列で取得
 * @returns 現在の日時のISO文字列
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * 文字列が有効な日付かどうかをチェック
 * @param dateString チェックする文字列
 * @returns 有効な日付かどうか
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
}

/**
 * 薬の服用時間を計算する関数
 * @param frequency 服用頻度（例: "1日3回", "12時間おき"）
 * @param startTime 開始時間（HH:mm形式）
 * @returns 次の服用時間の配列
 */
export function calculateNextDoseTimes(frequency: string, startTime: string): string[] {
  const times: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  
  if (frequency.includes('1日3回')) {
    // 8時間おき
    for (let i = 0; i < 3; i++) {
      const hour = (startHour + i * 8) % 24;
      times.push(`${String(hour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`);
    }
  } else if (frequency.includes('1日2回')) {
    // 12時間おき
    for (let i = 0; i < 2; i++) {
      const hour = (startHour + i * 12) % 24;
      times.push(`${String(hour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`);
    }
  } else if (frequency.includes('1日1回')) {
    times.push(startTime);
  }
  
  return times;
}

/**
 * 薬の服用状況を計算する関数
 * @param medication 薬の情報
 * @param logs 服用ログの配列
 * @returns 服用状況のサマリー
 */
export function calculateMedicationStatus(medication: any, logs: any[]): {
  isTakenToday: boolean;
  nextDoseTime?: string;
  totalDoses: number;
  takenDoses: number;
} {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(log => log.takenAt.startsWith(today));
  
  const nextDoseTimes = calculateNextDoseTimes(medication.frequency, medication.startTime || '09:00');
  const nextDoseTime = nextDoseTimes.find(time => {
    const [hour, minute] = time.split(':').map(Number);
    const now = new Date();
    const doseTime = new Date();
    doseTime.setHours(hour, minute, 0, 0);
    return doseTime > now;
  });
  
  return {
    isTakenToday: todayLogs.length > 0,
    nextDoseTime,
    totalDoses: nextDoseTimes.length,
    takenDoses: todayLogs.length,
  };
}

/**
 * エラーメッセージを生成する関数
 * @param error エラーオブジェクト
 * @param defaultMessage デフォルトメッセージ
 * @returns エラーメッセージ
 */
export function getErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}

/**
 * 配列を安全に分割する関数
 * @param array 分割する配列
 * @param size 分割サイズ
 * @returns 分割された配列の配列
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * オブジェクトの深いコピーを作成する関数
 * @param obj コピーするオブジェクト
 * @returns 深いコピーされたオブジェクト
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}