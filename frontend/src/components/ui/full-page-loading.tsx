import { LoadingSpinner } from './loading-spinner';

export default function FullPageLoading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'>
      <div className='text-center'>
        <LoadingSpinner size='lg' />
        <p className='mt-4 text-muted-foreground'>読み込み中...</p>
      </div>
    </div>
  );
}
