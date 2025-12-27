import { forwardRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Icon from "common/components/icons";
import useScrollToBottom from "./hooks/useScrollToBottom";
import useStarMessage from "../../hooks/useStarMessage";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import useMarkAsUnread from "../../hooks/useMarkAsUnread";
import usePinMessage from "../../hooks/usePinMessage";
import useMessages from "../../hooks/useMessages";
import MessageMenu from "./components/message-menu";
import { getMessages, Message } from "./data/get-messages";
import {
  ChatMessage,
  ChatMessageContent,
  ChatMessageFiller,
  ChatMessageFooter,
  Container,
  Date,
  DateWrapper,
  EncryptionMessage,
  MessageGroup,
  MessageActions,
  ChatMessageWrapper,
} from "./styles";

type MessagesListProps = {
  onShowBottomIcon: Function;
  shouldScrollToBottom?: boolean;
};

export default function MessagesList(props: MessagesListProps) {
  const { onShowBottomIcon, shouldScrollToBottom } = props;
  const { t } = useTranslation();

  const params = useParams();
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const { starMessage } = useStarMessage();
  const { deleteMessage } = useDeleteMessage();
  const { markAsUnread } = useMarkAsUnread();
  const { pinMessage } = usePinMessage();
  const { messages: apiMessages } = useMessages(params.id);

  // Initialize messages when chatId changes
  useEffect(() => {
    if (apiMessages.length > 0) {
      // Use API messages if available
      setMessagesState(apiMessages);
    } else {
      // Fallback to static messages for now (only on initial load)
      const staticMessages = getMessages();
      setMessagesState(staticMessages);
    }
    // eslint-disable-next-line
  }, [params.id]);

  // Update messagesState when apiMessages change (only if API returns data)
  // This preserves local state (like starred status) when API is not ready
  useEffect(() => {
    if (apiMessages.length > 0) {
      // Merge API messages with local state to preserve starred status
      setMessagesState((prev) => {
        const merged = apiMessages.map((apiMsg) => {
          const localMsg = prev.find((p) => p.id === apiMsg.id);
          // Preserve local starred status if API doesn't have it or if we have local changes
          return localMsg && localMsg.isStarred !== undefined
            ? { ...apiMsg, isStarred: localMsg.isStarred }
            : apiMsg;
        });
        return merged.length > 0 ? merged : prev;
      });
    }
    // Don't update if apiMessages is empty to preserve existing messages
  }, [apiMessages]);

  const handleStarMessage = async (messageId: string) => {
    const message = messagesState.find((m) => m.id === messageId);
    if (!message) return;

    // Optimistic update - update immediately
    const previousState = messagesState;
    setMessagesState((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isStarred: !(m.isStarred || false) } : m))
    );

    try {
      const result = await starMessage(messageId, params.id || "", message.isStarred || false);
      if (result.success) {
        // Update with API response
        setMessagesState((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isStarred: result.isStarred } : m))
        );
        // Only refresh if API is actually implemented and returns data
        // For now, skip refreshMessages() to prevent message loss
        // TODO: Uncomment when API is ready
        // if (apiMessages.length > 0) {
        //   refreshMessages();
        // }
      } else {
        // Revert on failure
        setMessagesState(previousState);
      }
    } catch (error) {
      console.error("Failed to star message:", error);
      // Revert on error
      setMessagesState(previousState);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistic update - remove immediately
    const previousState = messagesState;
    setMessagesState((prev) => prev.filter((m) => m.id !== messageId));

    try {
      const result = await deleteMessage(messageId, params.id || "");
      if (!result.success) {
        // Revert on failure
        setMessagesState(previousState);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      // Revert on error
      setMessagesState(previousState);
    }
  };

  const handleMarkAsUnread = async (messageId: string) => {
    const message = messagesState.find((m) => m.id === messageId);
    if (!message || message.isOpponent) return; // Only mark own messages as unread

    // Optimistic update
    const previousState = messagesState;
    setMessagesState((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, messageStatus: "SENT" as const } : m))
    );

    try {
      const result = await markAsUnread(messageId, params.id || "");
      if (!result.success) {
        // Revert on failure
        setMessagesState(previousState);
      }
    } catch (error) {
      console.error("Failed to mark message as unread:", error);
      // Revert on error
      setMessagesState(previousState);
    }
  };

  const handlePinMessage = async (messageId: string) => {
    const message = messagesState.find((m) => m.id === messageId);
    if (!message) return;

    // Optimistic update
    const previousState = messagesState;
    setMessagesState((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isPinned: !(m.isPinned || false) } : m))
    );

    try {
      const result = await pinMessage(messageId, params.id || "", message.isPinned || false);
      if (result.success) {
        // Update with API response
        setMessagesState((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isPinned: result.isPinned } : m))
        );
      } else {
        // Revert on failure
        setMessagesState(previousState);
      }
    } catch (error) {
      console.error("Failed to pin message:", error);
      // Revert on error
      setMessagesState(previousState);
    }
  };

  const { containerRef, lastMessageRef } = useScrollToBottom(
    onShowBottomIcon,
    shouldScrollToBottom,
    params.id
  );

  return (
    <Container ref={containerRef}>
      <EncryptionMessage>
        <Icon id="lock" className="icon" />
        {t("chatRoom.encryptionMessage")}
      </EncryptionMessage>
      <DateWrapper>
        <Date>{t("chatRoom.today")}</Date>
      </DateWrapper>
      <MessageGroup>
        {messagesState.length > 0 ? (
          messagesState.map((message, i) => {
            if (i === messagesState.length - 1) {
              return (
                <SingleMessage
                  key={message.id}
                  message={message}
                  onStar={handleStarMessage}
                  onDelete={handleDeleteMessage}
                  onMarkAsUnread={handleMarkAsUnread}
                  onPin={handlePinMessage}
                  ref={lastMessageRef}
                />
              );
            } else {
              return (
                <SingleMessage
                  key={message.id}
                  message={message}
                  onStar={handleStarMessage}
                  onDelete={handleDeleteMessage}
                  onMarkAsUnread={handleMarkAsUnread}
                  onPin={handlePinMessage}
                />
              );
            }
          })
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--sub-heading-color)" }}>
            {t("chatRoom.noMessages")}
          </div>
        )}
      </MessageGroup>
    </Container>
  );
}

const SingleMessage = forwardRef(
  (
    props: {
      message: Message;
      onStar?: (messageId: string) => void;
      onDelete?: (messageId: string) => void;
      onMarkAsUnread?: (messageId: string) => void;
      onPin?: (messageId: string) => void;
    },
    ref: any
  ) => {
    const { message, onStar, onDelete, onMarkAsUnread, onPin } = props;

    return (
      <ChatMessageWrapper>
        <ChatMessage
          key={message.id}
          className={message.isOpponent ? "chat__msg--received" : "chat__msg--sent"}
          ref={ref}
        >
          <ChatMessageContent>
            <span>{message.body}</span>
            <ChatMessageFiller />
            <ChatMessageFooter>
              <span>{message.timestamp}</span>
              {!message.isOpponent && (
                <Icon
                  id={`${message.messageStatus === "SENT" ? "singleTick" : "doubleTick"}`}
                  className={`chat__msg-status-icon ${
                    message.messageStatus === "READ" ? "chat__msg-status-icon--blue" : ""
                  }`}
                />
              )}
            </ChatMessageFooter>
          </ChatMessageContent>
        </ChatMessage>
        <MessageActions>
          <MessageMenu
            message={message}
            onStar={onStar}
            onDelete={onDelete}
            onMarkAsUnread={onMarkAsUnread}
            onPin={onPin}
          />
        </MessageActions>
      </ChatMessageWrapper>
    );
  }
);
