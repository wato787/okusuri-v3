import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CalendarLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <div className='h-8 w-8 bg-muted rounded animate-pulse' />
            <div className='h-6 bg-muted rounded animate-pulse w-32' />
            <div className='h-8 w-8 bg-muted rounded animate-pulse' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-7 gap-1'>
            {/* 曜日のヘッダー */}
            {Array.from({ length: 7 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={i} className='text-center py-2'>
                <div className='h-4 bg-muted rounded animate-pulse w-4 mx-auto' />
              </div>
            ))}

            {/* カレンダーの日付 */}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className='relative h-10 flex items-center justify-center'
              >
                <div className='h-8 w-8 bg-muted rounded-full animate-pulse' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-center space-x-4'>
        <div className='flex items-center'>
          <div className='h-3 w-3 bg-muted rounded-full animate-pulse mr-2' />
          <div className='h-4 bg-muted rounded animate-pulse w-20' />
        </div>
        <div className='flex items-center'>
          <div className='h-3 w-3 bg-muted rounded-full animate-pulse mr-2' />
          <div className='h-4 bg-muted rounded animate-pulse w-20' />
        </div>
      </div>
    </div>
  );
}
