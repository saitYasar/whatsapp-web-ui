import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "common/components/icons";
import useCloseMenu from "../../../../../hooks/useCloseMenu";
import { Message } from "../../data/get-messages";
import {
  MenuButton,
  MenuContainer,
  MenuPopover,
  MenuItem,
  MenuItemIcon,
  MenuItemText,
} from "./styles";

type MessageMenuProps = {
  message: Message;
  onStar?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onMarkAsUnread?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
};

type MenuItemType = {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
  isDanger?: boolean;
};

export default function MessageMenu({
  message,
  onStar,
  onDelete,
  onMarkAsUnread,
  onPin,
}: MessageMenuProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useCloseMenu(() => setIsOpen(false));

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const menuItems: MenuItemType[] = [];

  // Pin/Unpin option
  if (onPin) {
    menuItems.push({
      id: "pin",
      icon: "pinned",
      label: message.isPinned ? t("chatRoom.unpinMessage") : t("chatRoom.pinMessage"),
      onClick: () => onPin(message.id),
    });
  }

  // Star option
  if (onStar) {
    menuItems.push({
      id: "star",
      icon: "star",
      label: message.isStarred ? t("chatRoom.unstarMessage") : t("chatRoom.starMessage"),
      onClick: () => onStar(message.id),
    });
  }

  // Mark as unread option (only for own messages that are read)
  if (onMarkAsUnread && !message.isOpponent && message.messageStatus === "READ") {
    menuItems.push({
      id: "unread",
      icon: "singleTick",
      label: t("chatRoom.markAsUnread"),
      onClick: () => onMarkAsUnread(message.id),
    });
  }

  // Delete option
  if (onDelete) {
    menuItems.push({
      id: "delete",
      icon: "delete",
      label: t("chatRoom.deleteMessage"),
      onClick: () => {
        if (window.confirm(t("chatRoom.deleteMessageConfirm"))) {
          onDelete(message.id);
        }
      },
      isDanger: true,
    });
  }

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <MenuContainer ref={ref}>
      <MenuButton onClick={handleMenuClick} $isOpen={isOpen}>
        <Icon id="menu" className="icon" />
      </MenuButton>
      {isOpen && (
        <MenuPopover $isOpponent={message.isOpponent}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => handleMenuItemClick(item.onClick)}
              $isDanger={item.isDanger}
            >
              <MenuItemIcon>
                <Icon id={item.icon} className="icon" />
              </MenuItemIcon>
              <MenuItemText>{item.label}</MenuItemText>
            </MenuItem>
          ))}
        </MenuPopover>
      )}
    </MenuContainer>
  );
}

