import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function SettingLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <SkeletonCard lines={2} />
    </div>
  );
}
