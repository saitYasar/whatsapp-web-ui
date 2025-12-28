import { useState } from "react";
import { Message } from "../components/messages-list/data/get-messages";

export default function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (chatId: string, body: string, type: string = "text"): Promise<{ success: boolean; message?: Message; error?: string }> => {
    if (!body.trim()) {
      return { success: false, error: "Message body is required" };
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('whatsapp_web_token');
      // const response = await fetch(`/api/chats/${chatId}/messages`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ body, type }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   return { success: true, message: data.message };
      // } else {
      //   throw new Error(data.error || "Failed to send message");
      // }

      // Mock: Create a temporary message for now
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const mockMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        body: body.trim(),
        date: new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }),
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        messageStatus: "SENT",
        isOpponent: false,
        type: type as any,
        isStarred: false,
        isPinned: false,
      };

      return { success: true, message: mockMessage };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Send message error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
}

