import PushNotification from 'react-native-push-notification';

type NotificationOption = {
  name: string;
  action: () => void;
};

export const initNotificationSetup = (
  notificationOptions: NotificationOption[],
) => {
  PushNotification.configure({
    onNotification: notification => {
      notificationOptions.forEach(notificationOption => {
        if (notification.action === notificationOption.name) {
          notificationOption.action();
        }
      });
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'homeunlocker',
      channelName: 'homeunlocker',
    },
    () => {},
  );
};
