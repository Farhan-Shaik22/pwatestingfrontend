import MobileDialpad from '@/components/mobile-dialpad';
import InstallPrompt from './_components/IosInstall';
import PushNotificationManager from './_components/SubscriptionManager';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to Push Notifications App</h2>
      <p>
        This app allows you to subscribe to push notifications and experience the benefits of a Progressive Web App (PWA).
      </p>
      <PushNotificationManager />
      <MobileDialpad/>
      <InstallPrompt/>
    </div>
  );
}
