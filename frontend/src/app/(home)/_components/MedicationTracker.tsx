'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Check, Droplet, Info } from 'lucide-react';
import { useState, useTransition } from 'react';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { registerMedicationLog } from '../action';
import { motion, AnimatePresence } from 'framer-motion';

type MedicationTrackerProps = {
  isRestPeriod?: boolean;
};

export function MedicationTracker({
  isRestPeriod = false,
}: MedicationTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const [activeButton, setActiveButton] = useState<
    'bleeding' | 'normal' | null
  >(null);

  const today = format(new Date(), 'yyyy年MM月dd日 (eee)', { locale: ja });

  const handleBleedingStatus = (hasBleeding: boolean) => {
    // 既に処理中の場合は何もしない
    if (isPending) return;

    // クリックされたボタンをアクティブにする
    setActiveButton(hasBleeding ? 'bleeding' : 'normal');

    startTransition(async () => {
      try {
        await registerMedicationLog({ hasBleeding });
        toast.success('記録が完了しました');

        // 送信完了後、少し待ってからボタンのアクティブ状態をリセット
        setTimeout(() => {
          setActiveButton(null);
        }, 1000);
      } catch (error) {
        console.error('記録の保存に失敗しました', error);
        toast.error('記録の保存に失敗しました');
        setActiveButton(null);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='space-y-6 w-full'
    >
      <div className='flex items-center justify-center gap-2 text-lg font-medium bg-gray-50 dark:bg-gray-800/50 py-3 px-4 rounded-lg shadow-sm'>
        <Calendar className='h-5 w-5 text-blue-500' />
        <span>{today}</span>
      </div>

      <Card className='overflow-hidden shadow-lg border-0 rounded-xl'>
        <CardContent className='px-5 py-5'>
          {isRestPeriod ? (
            <div className='flex items-center gap-2 text-lg mb-4'>
              <Info className='h-5 w-5 text-amber-500' />
              <span>休薬期間中の出血状況</span>
            </div>
          ) : (
            <div className='flex items-center gap-2 text-lg mb-4'>
              <Droplet className='h-5 w-5 text-red-500' />
              <span>今日の出血状況</span>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type='button'
                variant={activeButton === 'bleeding' ? 'default' : 'outline'}
                className={`h-20 text-lg relative w-full rounded-xl shadow-sm ${
                  activeButton === 'bleeding'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                    : 'border-2 border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700'
                }`}
                onClick={() => handleBleedingStatus(true)}
                disabled={isPending}
              >
                {isPending && activeButton === 'bleeding' ? (
                  <>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin' />
                    </div>
                    <span className='opacity-0'>出血あり</span>
                  </>
                ) : (
                  <>
                    <Droplet className='mr-2 h-6 w-6' />
                    <span>出血あり</span>
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type='button'
                variant={activeButton === 'normal' ? 'default' : 'outline'}
                className={`h-20 text-lg relative w-full rounded-xl shadow-sm ${
                  activeButton === 'normal'
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                    : 'border-2 border-green-200 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700'
                }`}
                onClick={() => handleBleedingStatus(false)}
                disabled={isPending}
              >
                {isPending && activeButton === 'normal' ? (
                  <>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin' />
                    </div>
                    <span className='opacity-0'>出血なし</span>
                  </>
                ) : (
                  <>
                    <Check className='mr-2 h-6 w-6' />
                    <span>出血なし</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {isRestPeriod && (
            <div className='mt-4 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg'>
              <p>
                休薬期間中も出血状況を記録してください。休薬期間が終了すると、連続服用日数は1日目からリセットされます。
              </p>
            </div>
          )}

          <AnimatePresence>
            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='text-center text-sm text-muted-foreground mt-4 bg-gray-50 dark:bg-gray-800/50 py-2 px-3 rounded-lg'
              >
                記録を保存しています...
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
