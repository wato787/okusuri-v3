'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, Menu, User } from 'lucide-react';
import Link from 'next/link';

export function Hamburger() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-10 w-10'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem asChild>
          <Link href='/auth' className='flex items-center cursor-pointer'>
            <LogIn className='mr-2 h-4 w-4' />
            <span>ログイン / 登録</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/profile' className='flex items-center cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            <span>プロフィール</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
