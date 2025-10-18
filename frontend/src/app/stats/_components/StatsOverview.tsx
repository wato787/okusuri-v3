import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Droplet, Pill } from 'lucide-react';

export function StatsOverview() {
  // ダミーデータ
  const stats = {
    maxStreak: 45, // 最長服用日数
    bleedingDays: 15, // 総出血日数
    restPeriods: 4, // 休薬期間の回数
    avgCycleLength: 32, // 平均サイクル長（日）
  };

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-center'>概要</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <Pill className='h-6 w-6 text-green-500 mb-2' />
            <div className='text-sm text-muted-foreground'>最長服用</div>
            <div className='text-xl font-bold'>{stats.maxStreak}日</div>
          </div>

          <div className='flex flex-col items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <Droplet className='h-6 w-6 text-red-500 mb-2' />
            <div className='text-sm text-muted-foreground'>出血日数</div>
            <div className='text-xl font-bold'>{stats.bleedingDays}日</div>
          </div>

          <div className='flex flex-col items-center justify-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg'>
            <Clock className='h-6 w-6 text-amber-500 mb-2' />
            <div className='text-sm text-muted-foreground'>休薬回数</div>
            <div className='text-xl font-bold'>{stats.restPeriods}回</div>
          </div>

          <div className='flex flex-col items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <Clock className='h-6 w-6 text-blue-500 mb-2' />
            <div className='text-sm text-muted-foreground'>平均サイクル</div>
            <div className='text-xl font-bold'>{stats.avgCycleLength}日</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
