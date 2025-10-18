import { NotificationSetting } from './_components/NotificationSettingContent';
import { getNotificationSetting } from './fetcher';

export default async function SettingPage() {
  // 通知設定を取得
  const notificationSetting = await getNotificationSetting();

  return (
    <div className='container max-w-md mx-auto py-8 px-4'>
      <NotificationSetting notificationSetting={notificationSetting} />
    </div>
  );
}
