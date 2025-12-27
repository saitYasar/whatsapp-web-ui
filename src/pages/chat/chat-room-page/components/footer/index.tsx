import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "common/components/icons";
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
  const [showIcons, setShowIcons] = useState(false);
  const { t } = useTranslation();

  const attachButtons = [
    { icon: "attachRooms", label: t("chatRoom.chooseRoom") },
    { icon: "attachContacts", label: t("chatRoom.chooseContact") },
    { icon: "attachDocument", label: t("chatRoom.chooseDocument") },
    { icon: "attachCamera", label: t("chatRoom.useCamera") },
    { icon: "attachImage", label: t("chatRoom.chooseImage") },
  ];

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
      <Input placeholder={t("chatRoom.typeMessage")} />
      <SendMessageButton>
        <Icon id="send" className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
