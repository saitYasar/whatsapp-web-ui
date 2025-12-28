import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Icon from "common/components/icons";
import useSendMessage from "../../hooks/useSendMessage";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
} from "./styles";

export default function Footer() {
  const { t } = useTranslation();
  const params = useParams();
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading } = useSendMessage();

  const attachButtons = [
    { icon: "attachRooms", label: t("chatRoom.chooseRoom") },
    { icon: "attachContacts", label: t("chatRoom.chooseContact") },
    { icon: "attachDocument", label: t("chatRoom.chooseDocument") },
    { icon: "attachCamera", label: t("chatRoom.useCamera") },
    { icon: "attachImage", label: t("chatRoom.chooseImage") },
  ];

  const handleSend = async () => {
    if (!message.trim() || !params.id || isLoading) return;

    const result = await sendMessage(params.id, message);
    if (result.success) {
      setMessage("");
      // Message will be added to the list via optimistic update or API refresh
      // For now, the message list will refresh when API is ready
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <Button showIcon={showIcons} key={btn.label}>
              <Icon id={btn.icon} />
            </Button>
          ))}
        </ButtonsContainer>
      </IconsWrapper>
      <Input
        placeholder={t("chatRoom.typeMessage")}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <SendMessageButton onClick={handleSend} disabled={isLoading || !message.trim()}>
        <Icon id="send" className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
