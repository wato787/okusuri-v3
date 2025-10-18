import { Hamburger } from './Hamburger';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
      <div className='container flex h-14 items-center justify-between relative'>
        <div className='absolute left-0'>
          <div className='w-10' />
        </div>

        <div className='font-medium absolute left-1/2 transform -translate-x-1/2'>
          おくすり管理
        </div>

        <div className='absolute right-0'>
          <Hamburger />
        </div>
      </div>
    </header>
  );
}
