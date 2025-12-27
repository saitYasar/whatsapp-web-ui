import { useState, useEffect } from "react";
import { Notification, STATIC_NOTIFICATIONS } from "common/types/notification.type";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(STATIC_NOTIFICATIONS);
  // const [isLoading, setIsLoading] = useState(false); // Will be used when API is integrated

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchNotifications = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch('/api/notifications');
    //     const data = await response.json();
    //     setNotifications(data.notifications);
    //   } catch (error) {
    //     console.error("Failed to fetch notifications:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif))
    );

    // TODO: Replace with actual API call
    // try {
    //   await fetch(`/api/notifications/${notificationId}/read`, {
    //     method: "PUT",
    //   });
    // } catch (error) {
    //   console.error("Failed to mark notification as read:", error);
    // }
  };

  // Sort notifications by createdAt (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const latestNotification = sortedNotifications.length > 0 ? sortedNotifications[0] : null;

  return {
    notifications: sortedNotifications,
    latestNotification,
    unreadCount,
    isLoading: false, // Will be used when API is integrated
    markAsRead,
  };
}

