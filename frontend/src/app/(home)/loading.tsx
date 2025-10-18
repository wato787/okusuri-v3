import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function HomeLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <div className='h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-6' />

      <div className='flex items-center justify-center gap-2 text-lg font-medium mb-6'>
        <div className='h-5 w-5 bg-muted rounded-full animate-pulse' />
        <div className='h-5 bg-muted rounded animate-pulse w-32' />
      </div>

      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <div className='h-5 w-5 bg-muted rounded-full animate-pulse' />
            <div className='h-5 bg-muted rounded animate-pulse w-24' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div className='h-16 bg-muted rounded animate-pulse' />
            <div className='h-16 bg-muted rounded animate-pulse' />
          </div>
        </CardContent>
      </Card>

      <div className='h-14 bg-muted rounded animate-pulse' />
    </div>
  );
}
