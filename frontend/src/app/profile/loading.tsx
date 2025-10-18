import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function ProfileLoading() {
  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <SkeletonCard className='mb-6' lines={2} />
      <SkeletonCard lines={2} />
    </div>
  );
}
