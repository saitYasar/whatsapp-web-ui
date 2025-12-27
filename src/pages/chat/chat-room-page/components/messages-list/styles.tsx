import styled, { css } from "styled-components";

export const wrapperStyles = css`
  z-index: 9;
`;

export const Container = styled.div`
  flex: 1;
  position: relative;
  /* background: #e4dcd4; */
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px 5% 2pc;

  .icon {
    color: ${(props) => props.theme.common.subHeadingColor};
    margin-right: 5px;
    margin-bottom: -1px;
  }
`;

export const DateWrapper = styled.div`
  text-align: center;
  margin: 10px 0 14px;
  position: relative;

  ${wrapperStyles}
`;

export const Date = styled.span`
  background: ${(props) => props.theme.badge.bgColor};
  display: inline-block;
  color: ${(props) => props.theme.badge.textColor};
  font-size: 0.75rem;
  padding: 7px 10px;
  border-radius: 5px;
`;

export const EncryptionMessage = styled.p`
  background: ${(props) => props.theme.encryptionMessage.bgColor};
  color: ${(props) => props.theme.encryptionMessage.textColor};
  font-size: 0.77rem;
  text-align: center;
  padding: 5px 10px;
  position: relative;
  margin-bottom: 8px;
  border-radius: 5px;
  line-height: 20px;

  ${wrapperStyles}
`;

export const MessageGroup = styled.div`
  ${wrapperStyles}

  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  position: relative;

  .chat__msg--sent {
    background: ${(props) => props.theme.sentMessage.bgColor};
    align-self: flex-end;
  }

  .chat__msg--received {
    background: ${(props) => props.theme.receivedMessage.bgColor};
    align-self: flex-start;
  }

  & > *:nth-child(1):not(.chat__msg--sent)::before,
  .chat__msg--sent + .chat__msg--received::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: -8px;
    border-top: 6px solid ${(props) => props.theme.receivedMessage.bgColor};
    border-right: 6px solid ${(props) => props.theme.receivedMessage.bgColor};
    border-bottom: 6px solid transparent;
    border-left: 6px solid transparent;
  }

  & > *:nth-child(1):not(.chat__msg--received)::before,
  .chat__msg--received + .chat__msg--sent::before {
    right: -8px;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    border-top: 6px solid ${(props) => props.theme.sentMessage.bgColor};
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid ${(props) => props.theme.sentMessage.bgColor};
  }

  .chat__msg-status-icon {
    color: ${(props) => props.theme.common.subHeadingColor};
    margin-left: 3px;
  }

  .chat__msg-status-icon--blue {
    color: ${(props) => props.theme.common.readIconColor};
  }
`;

export const ChatMessage = styled.div`
  padding: 6px 7px 8px 9px;
  margin-bottom: 12px;
  font-size: 0.85rem;
  color: ${(props) => props.theme.common.mainHeadingColor};
  width: 100%;
  line-height: 20px;
  border-radius: 5px;
  position: relative;
  white-space: pre-line;
  display: flex;
  flex-direction: column;
`;

export const ChatMessageContent = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
  padding-right: 40px; /* Space for menu button */
`;

export const ChatMessageFiller = styled.span`
  width: 65px;
  display: inline-block;
  height: 3px;
  background: transparent;
  flex-shrink: 0;
`;

export const ChatMessageFooter = styled.span`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.7rem;
  font-weight: 500;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
`;

export const StarButton = styled.button<{ $isStarred: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  transition: all 0.2s;
  opacity: ${(props) => (props.$isStarred ? 1 : 0.3)};

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .icon {
    width: 14px;
    height: 14px;
    color: ${(props) =>
      props.$isStarred
        ? props.theme.common.tertiaryColor
        : props.theme.common.subHeadingColor};
    fill: ${(props) => (props.$isStarred ? props.theme.common.tertiaryColor : "none")};
  }
`;

export const MessageActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
`;

export const ChatMessageWrapper = styled.div`
  position: relative;
  width: fit-content;
  max-width: 95%;

  @media screen and (min-width: 1301px) {
    max-width: 65%;
  }

  @media screen and (min-width: 1000px) and (max-width: 1300px) {
    max-width: 75%;
  }

  @media screen and (min-width: 900px) and (max-width: 1000px) {
    max-width: 85%;
  }

  &:hover ${MessageActions} {
    opacity: 1;
  }

  &:hover ${MessageActions} button {
    opacity: 1;
  }
`;
