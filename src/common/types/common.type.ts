export type MessageStatus = "READ" | "DELIVERED" | "SENT";

export type Inbox = {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  timestamp?: string;
  messageStatus?: MessageStatus;
  notificationsCount?: number;
  isPinned?: boolean;
  isOnline?: boolean;
  lineId?: string; // Which line/phone number this chat belongs to
  notes?: string; // Chat notes (summary or latest note)
  notesCount?: number; // Number of notes in this chat
};
