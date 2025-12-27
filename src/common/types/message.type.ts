export type MessageType = "text" | "image" | "video" | "audio" | "document" | "location" | "contact" | "sticker";

export type MessageTypeOption = {
  id: MessageType;
  label: string;
  labelKey: string; // i18n key
};

// Static message types - will be replaced with API call
export const MESSAGE_TYPES: MessageTypeOption[] = [
  { id: "text", label: "Text", labelKey: "messageTypes.text" },
  { id: "image", label: "Image", labelKey: "messageTypes.image" },
  { id: "video", label: "Video", labelKey: "messageTypes.video" },
  { id: "audio", label: "Audio", labelKey: "messageTypes.audio" },
  { id: "document", label: "Document", labelKey: "messageTypes.document" },
  { id: "location", label: "Location", labelKey: "messageTypes.location" },
  { id: "contact", label: "Contact", labelKey: "messageTypes.contact" },
  { id: "sticker", label: "Sticker", labelKey: "messageTypes.sticker" },
];

// TODO: Replace with API call
// export const getMessageTypes = async (): Promise<MessageTypeOption[]> => {
//   const response = await fetch('/api/message-types');
//   const data = await response.json();
//   return data.types;
// };


