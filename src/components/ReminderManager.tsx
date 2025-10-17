import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  LocalNotifications,
  type LocalNotificationSchema,
} from "@capacitor/local-notifications";
import { useDailyProgress } from "../store/dailyProgress";
import { useNativeFeatures } from "../hooks/useNativeFeatures";

const HYDRATION_BASE_ID = 41_000;
const MAX_HYDRATION_NOTIFICATIONS = 6;
const READING_NOTIFICATION_ID = 42_000;

const hydrationNotificationIds = Array.from({ length: MAX_HYDRATION_NOTIFICATIONS }, (_, index) => ({
  id: HYDRATION_BASE_ID + index,
}));

const readingNotificationDescriptor = { id: READING_NOTIFICATION_ID };

const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return {
    hour: Number.isFinite(hour) ? (hour as number) : 9,
    minute: Number.isFinite(minute) ? (minute as number) : 0,
  };
};

export default function ReminderManager() {
  const { loaded, preferences } = useDailyProgress();
  const { isNative } = useNativeFeatures();

  useEffect(() => {
    const syncNotifications = async () => {
      if (!loaded) return;
      if (!Capacitor.isPluginAvailable("LocalNotifications") || !isNative) return;

      const wantsNotifications =
        preferences.hydrationReminderEnabled || preferences.readingReminderEnabled;

      const clearExisting = async () => {
        try {
          await LocalNotifications.cancel({
            notifications: [...hydrationNotificationIds, readingNotificationDescriptor],
          });
        } catch (error) {
          console.warn("Failed to clear notifications", error);
        }
      };

      if (!wantsNotifications) {
        await clearExisting();
        return;
      }

      try {
        const permissions = await LocalNotifications.checkPermissions();
        if (permissions.display !== "granted") {
          const requested = await LocalNotifications.requestPermissions();
          if (requested.display !== "granted") {
            await clearExisting();
            return;
          }
        }

        await clearExisting();

        const notifications: LocalNotificationSchema[] = [];

        if (preferences.hydrationReminderEnabled) {
          preferences.hydrationReminderTimes.forEach((time, index) => {
            if (index >= MAX_HYDRATION_NOTIFICATIONS) {
              return;
            }
            const { hour, minute } = parseTime(time);
            notifications.push({
              id: HYDRATION_BASE_ID + index,
              title: "Hydration reminder",
              body: "Time for a glass of water.",
              schedule: { repeats: true, on: { hour, minute } },
            });
          });
        }

        if (preferences.readingReminderEnabled) {
          const { hour, minute } = parseTime(preferences.readingReminderTime);
          notifications.push({
            id: READING_NOTIFICATION_ID,
            title: "Reading time",
            body: "Protect your reading streak—open a book or queue up your notes.",
            schedule: { repeats: true, on: { hour, minute } },
          });
        }

        if (notifications.length > 0) {
          await LocalNotifications.schedule({ notifications });
        }
      } catch (error) {
        console.warn("Unable to schedule notifications", error);
      }
    };

    void syncNotifications();
  }, [loaded, preferences, isNative]);

  return null;
}
