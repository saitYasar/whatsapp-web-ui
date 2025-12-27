import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiX } from "react-icons/bi";
import Icon from "common/components/icons";
import {
  NewMessageButton,
  NewMessageModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  InputWrapper,
  Input,
  Button,
  ButtonContainer,
  ErrorText,
} from "./styles";

type NewMessageProps = {
  onCreateChat: (phone: string, name?: string) => void;
};

export default function NewMessage({ onCreateChat }: NewMessageProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPhone("");
    setName("");
    setError(null);
  };

  const validatePhone = (phoneNumber: string): boolean => {
    // International format: 10-15 digits, starting with country code
    const phoneRegex = /^[1-9]\d{9,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\D/g, ""));
  };

  const handleCreate = () => {
    if (!phone.trim()) {
      setError(t("newMessage.phoneRequired"));
      return;
    }

    const cleanedPhone = phone.replace(/\D/g, "");
    if (!validatePhone(cleanedPhone)) {
      setError(t("newMessage.invalidPhone"));
      return;
    }

    onCreateChat(cleanedPhone, name.trim() || undefined);
    handleClose();
  };

  return (
    <>
      <NewMessageButton onClick={handleOpen}>
        <Icon id="chat" className="icon" />
        {t("newMessage.button")}
      </NewMessageButton>

      {isOpen && (
        <NewMessageModal>
          <ModalOverlay onClick={handleClose} />
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{t("newMessage.title")}</ModalTitle>
              <CloseButton onClick={handleClose}>
                <BiX />
              </CloseButton>
            </ModalHeader>

            <InputWrapper>
              <label>{t("newMessage.phoneLabel")}</label>
              <Input
                type="tel"
                placeholder={t("newMessage.phonePlaceholder")}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </InputWrapper>

            <InputWrapper>
              <label>{t("newMessage.nameLabel")}</label>
              <Input
                type="text"
                placeholder={t("newMessage.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCreate();
                }}
              />
            </InputWrapper>

            {error && <ErrorText>{error}</ErrorText>}

            <ButtonContainer>
              <Button secondary onClick={handleClose}>
                {t("newMessage.cancel")}
              </Button>
              <Button onClick={handleCreate}>
                <Icon id="send" className="icon" />
                {t("newMessage.create")}
              </Button>
            </ButtonContainer>
          </ModalContent>
        </NewMessageModal>
      )}
    </>
  );
}

