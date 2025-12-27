import { useState } from "react";
import { useChatContext } from "pages/chat/context/chat";

export default function useChatRoom() {
  const chatCtx = useChatContext();
  const [isShowIcon, setIsShowIcon] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const handleMenuOpen = (menu: "search" | "notes") => {
    if (menu === "search") {
      setIsSearchOpen(true);
      setIsNotesOpen(false);
    } else if (menu === "notes") {
      setIsNotesOpen(true);
      setIsSearchOpen(false);
    }
  };

  const handleShowIcon = (state: boolean) => {
    setIsShowIcon(state);

    if (state === false) setShouldScrollToBottom(false);
  };

  return {
    activeInbox: chatCtx.activeChat,
    handleMenuOpen,
    handleShowIcon,
    isSearchOpen,
    isNotesOpen,
    isShowIcon,
    setIsSearchOpen,
    setIsNotesOpen,
    setShouldScrollToBottom,
    shouldScrollToBottom,
  };
}
