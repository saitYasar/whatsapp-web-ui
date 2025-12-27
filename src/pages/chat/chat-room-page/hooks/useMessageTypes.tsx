import { useState, useEffect } from "react";
import { MessageTypeOption, MESSAGE_TYPES } from "common/types/message.type";

export default function useMessageTypes(chatId?: string) {
  const [messageTypes, setMessageTypes] = useState<MessageTypeOption[]>(MESSAGE_TYPES);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultSelected, setDefaultSelected] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchMessageTypes = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch(`/api/chats/${chatId}/message-types`);
    //     const data = await response.json();
    //     setMessageTypes(data.types);
    //     setDefaultSelected(data.defaultSelected || []);
    //     setSelectedTypes(data.defaultSelected || []);
    //   } catch (error) {
    //     console.error("Failed to fetch message types:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchMessageTypes();

    // Static default: "text" is selected by default
    const defaultType = "text";
    setDefaultSelected([defaultType]);
    setSelectedTypes([defaultType]);
  }, [chatId]);

  const updateSelectedTypes = async (newSelectedTypes: string[]) => {
    setSelectedTypes(newSelectedTypes);

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch(`/api/chats/${chatId}/message-types`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ types: newSelectedTypes }),
    //   });
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error("Failed to update message types:", error);
    //   throw error;
    // }
  };

  return {
    messageTypes,
    selectedTypes,
    defaultSelected,
    isLoading,
    updateSelectedTypes,
  };
}


