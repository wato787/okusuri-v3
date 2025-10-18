import { BleedingPatternChart } from './_components/BleedingPatternChart';
import { MonthlyStats } from './_components/MonthlyStats';
import { StatsOverview } from './_components/StatsOverview';
import { UsageChart } from './_components/UsageChart';

export default function StatsPage() {
  return (
    <div className='container max-w-md mx-auto pt-8 pb-24 px-4'>
      <div className='space-y-6'>
        <StatsOverview />
        <UsageChart />
        <BleedingPatternChart />
        <MonthlyStats />
      </div>
    </div>
  );
}
