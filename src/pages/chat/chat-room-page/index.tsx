import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ChatLayout from "../layouts";
import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import ChatNotes from "./components/chat-notes";
import Icon from "common/components/icons";
import useChatRoom from "./hooks/useChatRoom";
import MessagesList from "./components/messages-list";
import SearchSection from "./components/search-section";
import useNavigateToChat from "./hooks/useNavigateToChat";
import { Container, Body, Background, FooterContainer, ScrollButton } from "./styles";

export default function ChatRoomPage() {
  const { t } = useTranslation();
  const params = useParams();
  const {
    activeInbox,
    handleMenuOpen,
    handleShowIcon,
    isSearchOpen,
    isNotesOpen,
    isShowIcon,
    setIsSearchOpen,
    setIsNotesOpen,
    setShouldScrollToBottom,
    shouldScrollToBottom,
  } = useChatRoom();
  useNavigateToChat(activeInbox);

  return (
    <ChatLayout>
      <Container>
        <Body>
          <Background />
          <Header
            title={activeInbox?.name ?? ""}
            image={activeInbox?.image ?? ""}
            subTitle={activeInbox?.isOnline ? t("chatRoom.online") : ""}
            onSearchClick={() => handleMenuOpen("search")}
            onNotesClick={() => handleMenuOpen("notes")}
          />
          <MessagesList
            onShowBottomIcon={handleShowIcon}
            shouldScrollToBottom={shouldScrollToBottom}
          />
          <FooterContainer>
            {isShowIcon && (
              <ScrollButton onClick={() => setShouldScrollToBottom(true)}>
                <Icon id="downArrow" />
              </ScrollButton>
            )}
            <Footer />
          </FooterContainer>
        </Body>
        <Sidebar title={t("chatRoom.search")} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
          <SearchSection />
        </Sidebar>
        <Sidebar title={t("chatNotes.title")} isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)}>
          {params.id && <ChatNotes chatId={params.id} />}
        </Sidebar>
      </Container>
    </ChatLayout>
  );
}
