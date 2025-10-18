import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, PauseCircle } from 'lucide-react';

type RestPeriodStatusProps = {
  bleedingDays: number; // 連続出血日数
  restDaysLeft: number; // 休薬期間の残り日数
  totalRestDays: number; // 休薬期間の合計日数（通常4日）
};

export function RestPeriodStatus({
  bleedingDays,
  restDaysLeft,
  totalRestDays = 4,
}: RestPeriodStatusProps) {
  // 休薬期間の進捗
  const restProgress = ((totalRestDays - restDaysLeft) / totalRestDays) * 100;

  return (
    <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
      <div className='py-4 px-5 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <PauseCircle className='mr-2 h-5 w-5' />
            <span className='text-lg'>休薬期間中</span>
          </div>
          <div className='text-sm bg-white/20 px-3 py-1 rounded-full'>
            残り{restDaysLeft}日
          </div>
        </div>
      </div>

      <CardContent className='p-5'>
        <div className='space-y-5'>
          <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
            <div className='text-sm text-muted-foreground flex items-center mb-1'>
              <PauseCircle className='mr-2 h-4 w-4' />
              <span>休薬理由</span>
            </div>
            <div className='text-xl font-bold'>{bleedingDays}日連続出血</div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                休薬期間の進捗
              </div>
              <div className='text-sm font-medium'>
                {totalRestDays - restDaysLeft}/{totalRestDays}日
              </div>
            </div>
            <Progress value={restProgress} className='h-2' />
            <div className='text-xs text-muted-foreground text-center mt-1'>
              休薬期間終了後、服用日数は1日目からリセットされます
            </div>
          </div>

          <div className='flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
            <Clock className='mr-3 h-5 w-5 text-blue-500 flex-shrink-0' />
            <div>
              <p className='font-medium'>休薬期間を完了してください</p>
              <p className='text-xs mt-1'>
                {restDaysLeft === 0
                  ? '明日から服用を再開できます。服用日数は1日目からカウントされます。'
                  : `あと${restDaysLeft}日の休薬期間が必要です。`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
