import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function StatsLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <div className='h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-6' />

      <div className='space-y-6'>
        <Card>
          <CardHeader className='pb-2'>
            <div className='h-6 bg-muted rounded animate-pulse w-1/3 mx-auto' />
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={i} className='h-24 bg-muted rounded animate-pulse' />
              ))}
            </div>
          </CardContent>
        </Card>

        <SkeletonCard className='h-64' lines={0} />
        <SkeletonCard className='h-64' lines={0} />
        <SkeletonCard className='h-80' lines={3} />
      </div>
    </div>
  );
}
