'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from '@/lib/login';

import { cn } from '@/lib/utils';

export function AuthCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>ログイン</CardTitle>
          <CardDescription>
            Google アカウントでログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <Button onClick={signIn} className='w-full'>
              Googleでログイン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
