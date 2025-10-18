import { MedicationStatus } from './_components/MedicationStatus';
import { MedicationTracker } from './_components/MedicationTracker';
import { RestPeriodStatus } from './_components/RestPeriodStatus';
import { getMedicationStatus } from '../medication/fetcher';

const Home = async () => {
  // 実際のデータをAPIから取得
  const medicationData = await getMedicationStatus();

  // APIからデータが取得できなかった場合はデフォルト値を使用
  const defaultData = {
    currentStreak: 0,
    consecutiveBleedingDays: 0,
    isRestPeriod: false,
    restDaysLeft: 0,
  };

  const data = medicationData || defaultData;

  // 休薬期間中の場合は別のコンポーネントを表示
  if (data.isRestPeriod) {
    return (
      <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
        <RestPeriodStatus
          bleedingDays={data.consecutiveBleedingDays}
          restDaysLeft={data.restDaysLeft}
          totalRestDays={4}
        />

        <div className='mt-6'>
          <MedicationTracker isRestPeriod={true} />
        </div>
      </div>
    );
  }

  return (
    <div className='container max-w-md mx-auto pt-6 pb-24 px-4'>
      <MedicationStatus
        currentStreak={data.currentStreak}
        consecutiveBleedingDays={data.consecutiveBleedingDays}
        isRestPeriod={data.isRestPeriod}
        restDaysLeft={data.restDaysLeft}
      />

      <div className='mt-6'>
        <MedicationTracker />
      </div>
    </div>
  );
};

export default Home;
