import { useState } from "react";

export default function usePinMessage() {
  const [isLoading, setIsLoading] = useState(false);

  const pinMessage = async (messageId: string, chatId: string, isPinned: boolean) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/chats/${chatId}/messages/${messageId}/pin`, {
      //   method: isPinned ? "DELETE" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   return { success: true, isPinned: data.isPinned, message: data.message || "Message pinned successfully" };
      // } else {
      //   throw new Error(data.error || "Failed to pin message");
      // }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true, isPinned: !isPinned, message: isPinned ? "Message unpinned successfully" : "Message pinned successfully" };
    } catch (error) {
      console.error("Pin message error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pinMessage,
    isLoading,
  };
}

