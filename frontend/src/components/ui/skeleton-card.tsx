import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SkeletonCardProps = {
  header?: boolean;
  lines?: number;
  className?: string;
};

export function SkeletonCard({
  header = true,
  lines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <Card className={className}>
      {header && (
        <CardHeader className='pb-2'>
          <div className='h-6 bg-muted rounded animate-pulse w-1/2 mx-auto' />
        </CardHeader>
      )}
      <CardContent className='space-y-4'>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            className={cn(
              'h-4 bg-muted rounded animate-pulse',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
}
