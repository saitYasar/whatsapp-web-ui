export type NotificationType = "info" | "success" | "error";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
};

// Static notifications - will be replaced with API call
export const STATIC_NOTIFICATIONS: Notification[] = [
  {
    id: "notif1",
    type: "info",
    title: "Bilgi",
    message: "Yeni özellikler eklendi. Daha fazla bilgi için tıklayın.",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: "notif2",
    type: "success",
    title: "Başarılı",
    message: "Mesajlarınız başarıyla gönderildi.",
    createdAt: new Date(Date.now() - 60000).toISOString(),
    isRead: false,
  },
  {
    id: "notif3",
    type: "error",
    title: "Hata",
    message: "Bağlantı hatası oluştu. Lütfen tekrar deneyin.",
    createdAt: new Date(Date.now() - 120000).toISOString(),
    isRead: false,
  },
];

// TODO: Replace with API call
// export const getNotifications = async (): Promise<Notification[]> => {
//   const response = await fetch('/api/notifications');
//   const data = await response.json();
//   return data.notifications;
// };

