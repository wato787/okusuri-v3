import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Droplet } from 'lucide-react';

export function MonthlyStats() {
  // ダミーデータ
  const monthlyData = [
    {
      month: '2025年5月',
      totalDays: 31,
      usageDays: 30,
      bleedingDays: 3,
      restPeriod: true,
      usageRate: 97,
    },
    {
      month: '2025年4月',
      totalDays: 30,
      usageDays: 30,
      bleedingDays: 2,
      restPeriod: false,
      usageRate: 100,
    },
    {
      month: '2025年3月',
      totalDays: 31,
      usageDays: 29,
      bleedingDays: 4,
      restPeriod: true,
      usageRate: 94,
    },
  ];

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-center'>月別詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {monthlyData.map((data) => (
            <div key={data.month} className='border rounded-lg p-3'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='font-medium'>{data.month}</h3>
                <Badge variant={data.usageRate >= 95 ? 'success' : 'warning'}>
                  {data.usageRate}%
                </Badge>
              </div>

              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div className='flex items-center'>
                  <Check className='h-4 w-4 text-green-500 mr-1' />
                  <span>服用日数: {data.usageDays}日</span>
                </div>
                <div className='flex items-center'>
                  <Droplet className='h-4 w-4 text-red-500 mr-1' />
                  <span>出血日数: {data.bleedingDays}日</span>
                </div>
              </div>

              {data.restPeriod && (
                <div className='mt-2 text-xs text-amber-600 dark:text-amber-400'>
                  ※この月は休薬期間がありました
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
