import { BiX } from "react-icons/bi";
import styled from "styled-components";
import { NotificationType } from "common/types/notification.type";

const getNotificationColor = (type: NotificationType | undefined, theme: any) => {
  switch (type) {
    case "info":
      return theme.alert.infoColor;
    case "success":
      return theme.alert.successColor;
    case "error":
      return theme.alert.errorColor;
    default:
      return theme.alert.infoColor;
  }
};

export const AlertContainer = styled.div`
  position: relative;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const NotificationItem = styled.div<{ $isExpanded: boolean; $type?: NotificationType }>`
  min-height: 85px;
  padding: 20px;
  display: flex;
  align-items: center;
  position: relative;
  background: ${(props) => getNotificationColor(props.$type, props.theme)};
  border-bottom: ${(props) => (props.$isExpanded ? `1px solid ${props.theme.common.borderColor}` : "none")};

  &:last-child {
    border-bottom: none;
  }
`;

export const CloseIcon = styled(BiX)`
  position: absolute;
  top: 8px;
  right: 15px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.alert.closeIconColor};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: 8px;
  right: 45px;
  background: ${(props) => props.theme.chatRoom.profileActionColor};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  z-index: 1;
`;

export const IconWrapper = styled.div`
  margin-right: 10px;
  flex-shrink: 0;

  .icon {
    color: ${(props) => props.theme.alert.iconContainerColor} !important;
    width: 24px;
    height: 24px;
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
`;

export const Text = styled.p`
  font-size: 0.85rem;
  color: ${(props) => props.theme.common.subHeadingColor};
  line-height: 17px;
  word-wrap: break-word;
`;

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExpandButton = styled.button`
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  border-top: 1px solid ${(props) => props.theme.common.borderColor};
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.primaryColor};
  }
`;
