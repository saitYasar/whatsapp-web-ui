         import { useState } from "react";

export default function useMarkAsUnread() {
  const [isLoading, setIsLoading] = useState(false);

  const markAsUnread = async (messageId: string, chatId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/chats/${chatId}/messages/${messageId}/mark-unread`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   return { success: true, message: data.message || "Message marked as unread successfully" };
      // } else {
      //   throw new Error(data.error || "Failed to mark message as unread");
      // }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, message: "Message marked as unread successfully" };
    } catch (error) {
      console.error("Mark as unread error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markAsUnread,
    isLoading,
  };
}

