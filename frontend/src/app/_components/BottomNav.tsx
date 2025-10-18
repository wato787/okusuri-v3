'use client';

import { Calendar, Home, PieChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      name: 'ホーム',
      href: '/',
      icon: Home,
    },
    {
      name: 'カレンダー',
      href: '/calendar',
      icon: Calendar,
    },
    {
      name: '統計',
      href: '/stats',
      icon: PieChart,
    },
    {
      name: '設定',
      href: '/setting',
      icon: Settings,
    },
  ];

  return (
    <div className='fixed bottom-0 left-0 right-0 border-t bg-background'>
      <nav className='flex justify-around items-center h-16'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className='h-5 w-5 mb-1' />
            <span className='text-xs'>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
