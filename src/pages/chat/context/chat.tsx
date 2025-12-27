import React, { useState, useMemo } from "react";
import { inbox } from "../data/inbox";
import { Inbox } from "common/types/common.type";

type User = {
  name: string;
  image: string;
};

type ChatContextProp = {
  user: User;
  inbox: Inbox[];
  filteredInbox: Inbox[];
  activeChat?: Inbox;
  searchQuery: string;
  selectedLines: string[];
  onChangeChat: (chat: Inbox) => void;
  onSearch: (query: string) => void;
  onLinesChange: (lines: string[]) => void;
};

const initialValue: ChatContextProp = {
  user: { name: "Sait Yaşar", image: "/assets/images/girl.jpeg" },
  inbox,
  filteredInbox: inbox,
  searchQuery: "",
  selectedLines: ["line1"],
  onChangeChat() {
    throw new Error();
  },
  onSearch() {
    throw new Error();
  },
  onLinesChange() {
    throw new Error();
  },
};

export const ChatContext = React.createContext<ChatContextProp>(initialValue);

export default function ChatProvider(props: { children: any }) {
  const { children } = props;

  const [user] = useState<User>(initialValue.user);
  const [inbox] = useState<Inbox[]>(initialValue.inbox);
  const [activeChat, setActiveChat] = useState<Inbox>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLines, setSelectedLines] = useState<string[]>(["line1"]);

  // Filter inbox based on selected lines and search query
  const filteredInbox = useMemo(() => {
    let filtered = inbox;

    // Filter by selected lines
    if (selectedLines.length > 0) {
      filtered = filtered.filter((chat) => {
        const chatLineId = chat.lineId || "line1"; // Default to line1 if not set
        return selectedLines.includes(chatLineId);
      });
    } else {
      // If no lines selected, show nothing
      return [];
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query) ||
          chat.lastMessage?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [inbox, searchQuery, selectedLines]);

  const handleChangeChat = (chat: Inbox) => {
    setActiveChat(chat);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: API call will be implemented here
    // Example: searchInbox(query).then(setFilteredInbox);
  };

  const handleLinesChange = (lines: string[]) => {
    setSelectedLines(lines);
    // TODO: API call will be implemented here
    // Example: updateSelectedLines(lines).then(() => fetchInbox(lines));
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        inbox,
        filteredInbox,
        activeChat,
        searchQuery,
        selectedLines,
        onChangeChat: handleChangeChat,
        onSearch: handleSearch,
        onLinesChange: handleLinesChange,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => React.useContext(ChatContext);
