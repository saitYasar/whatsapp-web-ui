import styled from "styled-components";

export const NewMessageButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  border-top: 1px solid ${(props) => props.theme.common.borderColor};

  &:hover {
    opacity: 0.9;
    background: ${(props) => props.theme.common.tertiaryColor};
  }

  .icon {
    width: 20px;
    height: 20px;
  }
`;

export const NewMessageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.div`
  position: relative;
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1001;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const ModalTitle = styled.h2`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.3rem;
  font-weight: 400;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.common.subHeadingColor};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const InputWrapper = styled.div`
  padding: 15px 20px;

  label {
    display: block;
    color: ${(props) => props.theme.common.mainHeadingColor};
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 8px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 6px;
  background: ${(props) => props.theme.unselectedChat.bg};
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }

  &::placeholder {
    color: ${(props) => props.theme.common.subHeadingColor};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const Button = styled.button<{ secondary?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${(props) => (props.secondary ? "transparent" : props.theme.common.tertiaryColor)};
  color: ${(props) => (props.secondary ? props.theme.common.subHeadingColor : "white")};
  border: ${(props) => (props.secondary ? `1px solid ${props.theme.common.borderColor}` : "none")};
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`;

export const ErrorText = styled.div`
  margin: 0 20px 15px;
  color: ${(props) => props.theme.chatRoom.profileActionColor};
  font-size: 0.85rem;
  padding: 10px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 4px;
`;

