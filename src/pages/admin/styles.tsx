import styled from "styled-components";
import Icon from "common/components/icons";

export const Container = styled.div`
  background: ${(props) => props.theme.unselectedChat.bg};
  padding: 20px;
  height: 100%;
  flex: 60%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-bottom: 6px solid ${(props) => props.theme.common.tertiaryColor};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const HeaderTitle = styled.h1`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.8rem;
  font-weight: 400;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => props.theme.common.secondaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.primaryColor};
  }

  .icon {
    width: 16px;
    height: 16px;
    transform: rotate(90deg);
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 2px solid ${(props) => props.theme.common.borderColor};
  margin-bottom: 20px;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${(props) => (props.active ? props.theme.common.secondaryColor : "transparent")};
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? props.theme.common.tertiaryColor : "transparent")};
  color: ${(props) =>
    props.active ? props.theme.common.tertiaryColor : props.theme.common.subHeadingColor};
  font-size: 0.95rem;
  font-weight: ${(props) => (props.active ? 500 : 400)};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
    color: ${(props) => props.theme.common.tertiaryColor};
  }
`;

export const TabContent = styled.div`
  flex: 1;
`;

export const StatsSection = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const StatsTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.2rem;
  font-weight: 500;
`;

export const PeriodSelector = styled.div`
  display: flex;
  gap: 8px;
`;

export const PeriodButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  background: ${(props) =>
    props.active ? props.theme.common.tertiaryColor : props.theme.common.primaryColor};
  color: ${(props) => (props.active ? "white" : props.theme.common.mainHeadingColor)};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatCard = styled.div`
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const StatLabel = styled.div`
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

export const StatValue = styled.div`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 2rem;
  font-weight: 600;
`;

export const UserStatsTable = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background: ${(props) => props.theme.common.primaryColor};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;

  &:first-child {
    font-weight: 500;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 12px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
`;

export const NotificationSection = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const NotificationTitle = styled.h2`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 20px;
`;

export const NotificationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    margin-right: 8px;
  }
`;

export const FormInput = styled.input`
  padding: 10px;
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }
`;

export const FormSelect = styled.select`
  padding: 10px;
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }
`;

export const FormTextarea = styled.textarea`
  padding: 10px;
  background: ${(props) => props.theme.common.primaryColor};
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.95rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.common.tertiaryColor};
  }
`;

export const UserSelector = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  background: ${(props) => props.theme.common.primaryColor};
`;

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid ${(props) => props.theme.common.borderColor};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
  }

  &:last-child {
    border-bottom: none;
  }

  span {
    color: ${(props) => props.theme.common.mainHeadingColor};
    font-size: 0.95rem;
  }
`;

export const UserCheckbox = styled.input`
  cursor: pointer;
`;

export const Button = styled.button`
  padding: 12px 24px;
  background: ${(props) => props.theme.common.tertiaryColor};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

export const NotificationItem = styled.div<{ $type: string }>`
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid
    ${(props) => {
      switch (props.$type) {
        case "success":
          return "#4caf50";
        case "error":
          return "#f44336";
        case "emergency":
          return "#ff5722";
        default:
          return "#ffc107";
      }
    }};
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const NotificationItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  strong {
    color: ${(props) => props.theme.common.mainHeadingColor};
    font-size: 1rem;
  }
`;

export const NotificationItemContent = styled.div`
  p {
    color: ${(props) => props.theme.common.subHeadingColor};
    margin: 0;
    line-height: 1.6;
  }
`;

export const NotificationItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const EditButton = styled.button`
  padding: 6px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background-color 0.2s;
  color: ${(props) => props.theme.common.mainHeadingColor};
  font-size: 0.85rem;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
  }

  .icon {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.common.mainHeadingColor};
  }
`;

export const DeleteButton = styled(EditButton)`
  border-color: ${(props) => props.theme.chatRoom.profileActionColor || "#dc3545"};
  color: ${(props) => props.theme.chatRoom.profileActionColor || "#dc3545"};

  .icon {
    color: ${(props) => props.theme.chatRoom.profileActionColor || "#dc3545"};
  }

  &:hover {
    background: ${(props) => props.theme.chatRoom.profileActionColor || "#dc3545"};
    color: white;

    .icon {
      color: white;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.common.subHeadingColor};
  font-size: 0.95rem;
`;

export const UserManagementSection = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const UserTable = styled.div`
  overflow-x: auto;
`;

export const LineSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PermissionCheckbox = styled.input`
  cursor: pointer;
`;

export const PendingMessagesSection = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const PendingMessageItem = styled.div`
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #f44336;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
    transform: translateX(4px);
  }
`;

export const MessageManagementSection = styled.div`
  background: ${(props) => props.theme.common.secondaryColor};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
`;

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const MessageItem = styled.div`
  background: ${(props) => props.theme.common.primaryColor};
  border-radius: 8px;
  padding: 15px;
  border: 1px solid ${(props) => props.theme.common.borderColor};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.common.secondaryColor};
    transform: translateX(4px);
  }
`;
