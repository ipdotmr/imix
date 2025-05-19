
export enum NotificationSoundType {
  NEW_MESSAGE = 'new_message',
  TASK_ASSIGNED = 'task_assigned',
  MENTION = 'mention',
  CALL = 'call'
}

const soundMap: Record<NotificationSoundType, string> = {
  [NotificationSoundType.NEW_MESSAGE]: '/sounds/new-message.mp3',
  [NotificationSoundType.TASK_ASSIGNED]: '/sounds/task-assigned.mp3',
  [NotificationSoundType.MENTION]: '/sounds/mention.mp3',
  [NotificationSoundType.CALL]: '/sounds/call.mp3'
};

const audioCache: Record<string, HTMLAudioElement> = {};

interface NotificationPreferences {
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  soundVolume: number;
}

const defaultPreferences: NotificationPreferences = {
  soundEnabled: true,
  browserNotificationsEnabled: true,
  soundVolume: 0.5
};

export const getNotificationPreferences = (): NotificationPreferences => {
  const storedPrefs = localStorage.getItem('notificationPreferences');
  if (storedPrefs) {
    return JSON.parse(storedPrefs);
  }
  return defaultPreferences;
};

export const saveNotificationPreferences = (preferences: NotificationPreferences): void => {
  localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
};

export const playNotificationSound = (soundType: NotificationSoundType): void => {
  const preferences = getNotificationPreferences();
  
  if (!preferences.soundEnabled) {
    return;
  }
  
  const soundPath = soundMap[soundType];
  
  if (!audioCache[soundPath]) {
    audioCache[soundPath] = new Audio(soundPath);
  }
  
  const audio = audioCache[soundPath];
  audio.volume = preferences.soundVolume;
  
  audio.currentTime = 0;
  
  audio.play().catch(error => {
    console.error('Failed to play notification sound:', error);
  });
};

export const showBrowserNotification = (
  title: string, 
  options: NotificationOptions = {}
): void => {
  const preferences = getNotificationPreferences();
  
  if (!preferences.browserNotificationsEnabled) {
    return;
  }
  
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } 
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const notifyNewMessage = (
  senderName: string, 
  messagePreview: string
): void => {
  playNotificationSound(NotificationSoundType.NEW_MESSAGE);
  
  showBrowserNotification(`New message from ${senderName}`, {
    body: messagePreview,
    icon: '/logo.png'
  });
};

export const notifyTaskAssigned = (
  taskTitle: string
): void => {
  playNotificationSound(NotificationSoundType.TASK_ASSIGNED);
  
  showBrowserNotification('New Task Assigned', {
    body: taskTitle,
    icon: '/logo.png'
  });
};

export const toggleSoundNotifications = (enabled: boolean): void => {
  const preferences = getNotificationPreferences();
  preferences.soundEnabled = enabled;
  saveNotificationPreferences(preferences);
};

export const toggleBrowserNotifications = (enabled: boolean): void => {
  const preferences = getNotificationPreferences();
  preferences.browserNotificationsEnabled = enabled;
  saveNotificationPreferences(preferences);
};

export const setSoundVolume = (volume: number): void => {
  const preferences = getNotificationPreferences();
  preferences.soundVolume = Math.max(0, Math.min(1, volume));
  saveNotificationPreferences(preferences);
};
