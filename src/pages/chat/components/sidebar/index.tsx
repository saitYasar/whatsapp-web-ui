import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsFillMoonFill, BsMoon } from "react-icons/bs";

import SidebarAlert from "./alert";
import InboxContact from "./contacts";
import OptionsMenu from "../option-menu";
import SearchField from "../search-field";
import MultiSelect from "common/components/multi-select";
import NewMessage from "../new-message";
import { useAppTheme } from "common/theme";
import useLanguage from "common/hooks/useLanguage";
import { useAuth } from "common/context/auth";
import useLines from "../../hooks/useLines";
import { Inbox } from "common/types/common.type";
import { useChatContext } from "pages/chat/context/chat";
import {
  Actions,
  ContactContainer,
  FilterWrapper,
  Header,
  LanguageIconContainer,
  LanguageText,
  SidebarContainer,
  ThemeIconContainer,
} from "./styles";

export default function Sidebar() {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const chatCtx = useChatContext();
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = useLanguage();
  const { logout } = useAuth();
  const { lines, selectedLines: hookSelectedLines, updateSelectedLines } = useLines();

  // Sync hook selectedLines with context
  React.useEffect(() => {
    if (hookSelectedLines.length > 0 && hookSelectedLines.join(",") !== chatCtx.selectedLines.join(",")) {
      chatCtx.onLinesChange(hookSelectedLines);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hookSelectedLines]);

  const handleChangeThemeMode = () => {
    theme.onChangeThemeMode();
  };

  const handleChangeLanguage = () => {
    const newLang = currentLanguage === "en" ? "tr" : "en";
    changeLanguage(newLang);
  };

  const handleChangeChat = (chat: Inbox) => {
    chatCtx.onChangeChat(chat);
    navigate("/" + chat.id);
  };

  const handleCreateNewChat = async (phone: string, name?: string) => {
    // TODO: Replace with actual API call
    // const response = await fetch("/api/chats/create", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ phone, name }),
    // });
    // const data = await response.json();
    // if (data.success) {
    //   const newChat = data.chat;
    //   chatCtx.onChangeChat(newChat);
    //   navigate("/" + newChat.id);
    // }

    // Mock: Create a temporary chat for now
    const newChat: Inbox = {
      id: `temp-${Date.now()}`,
      name: name || phone,
      image: "/assets/images/placeholder.jpeg",
      lastMessage: "",
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      messageStatus: "SENT",
      isOnline: false,
      lineId: chatCtx.selectedLines[0] || "line1",
    };
    chatCtx.onChangeChat(newChat);
    navigate("/" + newChat.id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuOptionClick = (option: string) => {
    if (option === t("sidebar.logOut")) {
      handleLogout();
    } else if (option === t("sidebar.bulkMessage")) {
      navigate("/bulk-message");
    }
  };

  const handleLinesChange = async (newSelectedLines: string[]) => {
    await updateSelectedLines(newSelectedLines);
    chatCtx.onLinesChange(newSelectedLines);
  };

  return (
    <SidebarContainer>
      <Header>
        <Actions>
          <ThemeIconContainer onClick={handleChangeThemeMode}>
            {theme.mode === "light" ? <BsMoon /> : <BsFillMoonFill />}
          </ThemeIconContainer>
          <LanguageIconContainer onClick={handleChangeLanguage} title={t("common.language")}>
            <LanguageText>{currentLanguage === "en" ? "EN" : "TR"}</LanguageText>
          </LanguageIconContainer>
  

          <OptionsMenu
            iconClassName="icon"
            className="icon"
            ariaLabel={t("sidebar.menu")}
            iconId="menu"
            options={[
              t("sidebar.bulkMessage"),
              t("sidebar.archived"),
              t("sidebar.starred"),
              t("sidebar.settings"),
              t("sidebar.logOut"),
            ]}
            onOptionClick={handleMenuOptionClick}
          />
        </Actions>
      </Header>
      <SidebarAlert />
      <FilterWrapper>
        <MultiSelect
          options={lines.map((line) => ({
            id: line.id,
            label: line.label,
            labelKey: line.labelKey,
          }))}
          selectedIds={chatCtx.selectedLines}
          onChange={handleLinesChange}
          placeholder={t("lines.selectPlaceholder")}
        />
      </FilterWrapper>
      <SearchField
        value={chatCtx.searchQuery}
        onChange={(value) => chatCtx.onSearch(value)}
      />
      <ContactContainer>
        {chatCtx.filteredInbox.map((inbox) => (
          <InboxContact
            key={inbox.id}
            inbox={inbox}
            isActive={inbox.id === chatCtx.activeChat?.id}
            onChangeChat={handleChangeChat}
          />
        ))}
      </ContactContainer>
      <NewMessage onCreateChat={handleCreateNewChat} />
    </SidebarContainer>
  );
}
