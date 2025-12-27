import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "common/components/icons";
import useNotifications from "../../../hooks/useNotifications";
import {
  AlertContainer,
  Badge,
  CloseIcon,
  ExpandButton,
  IconWrapper,
  NotificationItem,
  TextContainer,
  Text,
  Title,
} from "./styles";

export default function SidebarAlert() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { notifications, latestNotification, unreadCount, markAsRead } = useNotifications();

  if (!latestNotification && notifications.length === 0) return <></>;

  const visibleNotifications = isExpanded
    ? notifications
    : latestNotification
    ? [latestNotification]
    : [];

  const handleClose = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "info";
      case "success":
        return "check";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <>
      {visibleNotifications.length > 0 && (
        <AlertContainer>
          {visibleNotifications.map((notification, index) => (
            <NotificationItem key={notification.id} $isExpanded={isExpanded} $type={notification.type}>
              <CloseIcon onClick={() => handleClose(notification.id)} />
              {unreadCount > 1 && index === 0 && !isExpanded && (
                <Badge>{unreadCount}</Badge>
              )}
              <IconWrapper>
                <Icon id={getNotificationIcon(notification.type)} className="icon" />
              </IconWrapper>
              <TextContainer>
                <Title>{notification.title}</Title>
                <Text>{notification.message}</Text>
              </TextContainer>
            </NotificationItem>
          ))}
          {notifications.length > 1 && (
            <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded
                ? t("notifications.collapse")
                : t("notifications.expand", { count: notifications.length - 1 })}
            </ExpandButton>
          )}
        </AlertContainer>
      )}
    </>
  );
}
