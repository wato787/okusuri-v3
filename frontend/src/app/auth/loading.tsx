import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuthLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <div className='h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-6' />

      <div className='grid w-full grid-cols-2 mb-6'>
        <div className='h-10 bg-muted rounded-tl-md animate-pulse' />
        <div className='h-10 bg-muted/50 rounded-tr-md animate-pulse' />
      </div>

      <Card>
        <CardHeader>
          <div className='h-6 bg-muted rounded animate-pulse w-1/3 mb-2' />
          <div className='h-4 bg-muted rounded animate-pulse w-2/3' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='h-4 bg-muted rounded animate-pulse w-1/4' />
            <div className='h-10 bg-muted rounded animate-pulse w-full' />
          </div>
          <div className='space-y-2'>
            <div className='h-4 bg-muted rounded animate-pulse w-1/4' />
            <div className='h-10 bg-muted rounded animate-pulse w-full' />
          </div>
          <div className='h-10 bg-muted rounded animate-pulse w-full mt-4' />
        </CardContent>
      </Card>
    </div>
  );
}
