import { useState } from "react";

export default function useStarMessage() {
  const [isLoading, setIsLoading] = useState(false);

  const starMessage = async (messageId: string, chatId: string, isStarred: boolean) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('token');
      // const response = await fetch(`/api/chats/${chatId}/messages/${messageId}/star`, {
      //   method: isStarred ? "DELETE" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // const data = await response.json();
      // if (data.success) {
      //   // isStarred is user-specific, returned from API
      //   return { success: true, isStarred: data.isStarred };
      // } else {
      //   throw new Error(data.error || "Failed to star message");
      // }

      // Mock API call - user-specific starring
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Return opposite of current state (toggle)
      return { success: true, isStarred: !isStarred };
    } catch (error) {
      console.error("Star message error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    starMessage,
    isLoading,
  };
}

