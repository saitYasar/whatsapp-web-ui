import { useState, useEffect } from "react";
import { Message } from "../components/messages-list/data/get-messages";

export default function useMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/chats/${chatId}/messages?types=text,image,video,audio,document,location,contact,sticker`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   // Messages will include isStarred property based on current authenticated user
      //   // isStarred is user-specific - each user sees their own starred status
      //   setMessages(data.messages);
      // } else {
      //   throw new Error(data.error || "Failed to fetch messages");
      // }

      // Mock: For now, return empty array - will be populated by static data
      // When API is ready, messages will include isStarred property for current user
      setMessages([]);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMessages = () => {
    if (chatId) {
      fetchMessages();
    }
  };

  return {
    messages,
    isLoading,
    error,
    refreshMessages,
  };
}

