'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, PauseCircle, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

type MedicationStatusProps = {
  currentStreak: number; // 現在の服用日数
  consecutiveBleedingDays: number; // 連続出血日数
  isRestPeriod: boolean; // 休薬期間中かどうか
  restDaysLeft: number; // 休薬期間の残り日数（4日間の場合、残り何日か）
};

export function MedicationStatus({
  currentStreak,
  consecutiveBleedingDays,
  isRestPeriod,
  restDaysLeft,
}: MedicationStatusProps) {
  // 休薬期間の進捗（4日間中何日経過したか）
  const restProgress = isRestPeriod ? ((4 - restDaysLeft) / 4) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
        <div
          className={cn(
            'py-4 px-5 text-white font-medium',
            isRestPeriod
              ? 'bg-gradient-to-r from-amber-500 to-amber-400'
              : 'bg-gradient-to-r from-teal-600 to-teal-500'
          )}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              {isRestPeriod ? (
                <span className='text-lg flex items-center'>
                  <PauseCircle className='mr-2 h-5 w-5' />
                  休薬期間中
                </span>
              ) : (
                <span className='text-lg flex items-center'>
                  <Pill className='mr-2 h-5 w-5' />
                  服用継続中
                </span>
              )}
            </div>
            <div className='text-sm bg-white/20 px-3 py-1 rounded-full'>
              {isRestPeriod ? `残り${restDaysLeft}日` : `${currentStreak}日目`}
            </div>
          </div>
        </div>

        <CardContent className='p-5'>
          <div className='space-y-5'>
            <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
              <div className='text-sm text-muted-foreground flex items-center mb-1'>
                <Pill className='mr-2 h-4 w-4' />
                <span>服用日数</span>
              </div>
              <div className='text-2xl font-bold'>
                {isRestPeriod ? '休薬中' : `${currentStreak}日目`}
              </div>
            </div>

            {isRestPeriod && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    休薬期間の進捗
                  </div>
                  <div className='text-sm font-medium'>
                    {4 - restDaysLeft}/4日
                  </div>
                </div>
                <Progress value={restProgress} className='h-2' />
                <div className='text-xs text-muted-foreground text-center mt-1'>
                  休薬期間終了後、服用日数は1日目からリセットされます
                </div>
              </div>
            )}

            {consecutiveBleedingDays > 0 && !isRestPeriod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='flex items-start text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg'
              >
                <AlertCircle
                  className={cn(
                    'mr-2 h-5 w-5 flex-shrink-0 mt-0.5',
                    consecutiveBleedingDays >= 3
                      ? 'text-red-500'
                      : 'text-amber-500'
                  )}
                />
                <div>
                  <p className='font-medium'>
                    {consecutiveBleedingDays >= 3
                      ? '3日連続で出血があります'
                      : `連続${consecutiveBleedingDays}日間出血があります`}
                  </p>
                  {consecutiveBleedingDays >= 3 && (
                    <p className='text-xs mt-1'>
                      3日連続で出血がある場合は、4日間の休薬期間に入ってください。休薬後は服用日数が1日目からリセットされます。
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            <div className='flex items-center bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
              <Clock className='mr-3 h-5 w-5 text-blue-500 flex-shrink-0' />
              <span className='font-medium'>
                {isRestPeriod
                  ? `あと${restDaysLeft}日の休薬期間を続けてください`
                  : consecutiveBleedingDays >= 3
                  ? '休薬期間に入ることをお勧めします'
                  : '毎日服用を続けてください'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
