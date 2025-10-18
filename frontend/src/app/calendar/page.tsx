import {} from '@/components/ui/card';
import { MedicationCalendar } from './_components/MedicationCalendar';
import { getMedicationLog } from './fetcher';
import type { MedicationLog } from './schema';

export default async function CalendarPage() {
  const medicationLog = await getMedicationLog();
  // 同じ日付のログを1つにまとめる
  const consolidatedLogs = consolidateLogs(medicationLog || []);

  return (
    <div className='container max-w-md mx-auto pt-8 pb-24 px-4'>
      <MedicationCalendar logs={consolidatedLogs} />
    </div>
  );
}

// 同じ日付のログを1つにまとめる関数
function consolidateLogs(logs: MedicationLog[]): MedicationLog[] {
  const logsByDate = new Map<string, MedicationLog>();

  // 日付ごとに最新のログを保持
  for (const log of logs) {
    const date = new Date(log.createdAt).toISOString().split('T')[0];

    if (
      !logsByDate.has(date) ||
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      new Date(log.createdAt) > new Date(logsByDate.get(date)!.createdAt)
    ) {
      logsByDate.set(date, log);
    }
  }

  return Array.from(logsByDate.values());
}
