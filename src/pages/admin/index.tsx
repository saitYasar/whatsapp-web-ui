import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "common/context/auth";
import { useAppConfig } from "common/context/app-config";
import ChatLayout from "../chat/layouts";
import Icon from "common/components/icons";
import {
  Container,
  Header,
  HeaderTitle,
  HeaderActions,
  BackButton,
  TabsContainer,
  TabList,
  Tab,
  TabContent,
  StatsSection,
  StatsTitle,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  PeriodSelector,
  PeriodButton,
  UserStatsTable,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  NotificationSection,
  NotificationTitle,
  NotificationForm,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  UserSelector,
  UserCheckbox,
  UserList,
  UserItem,
  Button,
  ButtonGroup,
  NotificationList,
  NotificationItem,
  NotificationItemHeader,
  NotificationItemContent,
  NotificationItemActions,
  EditButton,
  DeleteButton,
  EmptyState,
  UserManagementSection,
  UserTable,
  LineSelector,
  PermissionCheckbox,
  PendingMessagesSection,
  PendingMessageItem,
  MessageManagementSection,
  MessageList,
  MessageItem,
  TableHeaderCell,
} from "./styles";

type User = {
  id: string;
  name: string;
  email: string;
  assignedLines?: string[];
  permissions?: string[];
  dailyMessages?: number;
  monthlyMessages?: number;
  dailyAvgResponseTime?: number;
  monthlyAvgResponseTime?: number;
};

type Notification = {
  id: string;
  type: "info" | "success" | "error" | "emergency";
  title: string;
  message: string;
  userIds: string[];
  createdAt: string;
  updatedAt?: string;
};

type PendingMessage = {
  id: string;
  chatId: string;
  chatName: string;
  message: string;
  sentAt: string;
  waitingTime: number; // in minutes
};

type Message = {
  id: string;
  chatId: string;
  chatName: string;
  body: string;
  timestamp: string;
  messageStatus: string;
  isOpponent: boolean;
};

type TabType = "stats" | "notifications" | "users" | "messages" | "pending";

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, isAdmin, isLoading } = useAuth();
  const { appName } = useAppConfig();
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [period, setPeriod] = useState<"daily" | "monthly">("daily");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    type: "info" as "info" | "success" | "error" | "emergency",
    title: "",
    message: "",
    sendToAll: false,
  });
  const [editingNotification, setEditingNotification] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    assignedLines: [] as string[],
    permissions: [] as string[],
  });
  const [lines] = useState([
    { id: "line1", label: "Hat 1" },
    { id: "line2", label: "Hat 2" },
    { id: "line3", label: "Hat 3" },
  ]);
  const [todayCustomers, setTodayCustomers] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchNotifications();
      fetchPendingMessages();
      fetchMessages();
      fetchTodayCustomers();
    }
  }, [isAdmin, period]);

  const fetchUsers = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch("/api/admin/users");
    // const data = await response.json();
    // setUsers(data.users);

    // Mock data
    setUsers([
      {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        assignedLines: ["line1"],
        permissions: ["view_messages"],
        dailyMessages: 45,
        monthlyMessages: 1234,
        dailyAvgResponseTime: 8.5,
        monthlyAvgResponseTime: 12.3,
      },
      {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        assignedLines: ["line2", "line3"],
        permissions: ["view_messages", "edit_messages"],
        dailyMessages: 67,
        monthlyMessages: 1890,
        dailyAvgResponseTime: 6.2,
        monthlyAvgResponseTime: 9.8,
      },
      {
        id: "user3",
        name: "Mike Johnson",
        email: "mike@example.com",
        assignedLines: ["line1", "line2"],
        permissions: ["view_messages"],
        dailyMessages: 33,
        monthlyMessages: 987,
        dailyAvgResponseTime: 15.4,
        monthlyAvgResponseTime: 18.7,
      },
    ]);
  };

  const fetchNotifications = async () => {
    // TODO: Replace with actual API call
    setNotifications([
      {
        id: "notif1",
        type: "info",
        title: "Sistem Güncellemesi",
        message: "Yeni özellikler eklendi.",
        userIds: ["user1", "user2"],
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "notif2",
        type: "success",
        title: "Başarılı",
        message: "İşlem tamamlandı.",
        userIds: [],
        createdAt: "2024-01-14T09:20:00Z",
      },
    ]);
  };

  const fetchPendingMessages = async () => {
    // TODO: Replace with actual API call
    // Messages waiting more than 1 hour
    setPendingMessages([
      {
        id: "pending1",
        chatId: "chat1",
        chatName: "Ahmet Yılmaz",
        message: "Merhaba, yardıma ihtiyacım var",
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        waitingTime: 120,
      },
      {
        id: "pending2",
        chatId: "chat2",
        chatName: "Ayşe Demir",
        message: "Siparişim hakkında soru sormak istiyorum",
        sentAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
        waitingTime: 90,
      },
    ]);
  };

  const fetchMessages = async () => {
    // TODO: Replace with actual API call
    setMessages([
      {
        id: "msg1",
        chatId: "chat1",
        chatName: "Ahmet Yılmaz",
        body: "Merhaba, nasılsınız?",
        timestamp: "14:30",
        messageStatus: "READ",
        isOpponent: true,
      },
      {
        id: "msg2",
        chatId: "chat2",
        chatName: "Ayşe Demir",
        body: "Sipariş durumu nedir?",
        timestamp: "15:45",
        messageStatus: "DELIVERED",
        isOpponent: true,
      },
    ]);
  };

  const fetchTodayCustomers = async () => {
    // TODO: Replace with actual API call
    setTodayCustomers(23);
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      alert(t("admin.notificationRequired"));
      return;
    }

    const userIds = notificationForm.sendToAll ? [] : selectedUsers;

    // TODO: Replace with actual API call
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: notificationForm.type,
      title: notificationForm.title,
      message: notificationForm.message,
      userIds,
      createdAt: new Date().toISOString(),
    };

    setNotifications([newNotification, ...notifications]);
    setNotificationForm({ type: "info", title: "", message: "", sendToAll: false });
    setSelectedUsers([]);
  };

  const handleUpdateNotification = async (id: string) => {
    // TODO: Replace with actual API call
    setNotifications(
      notifications.map((n) =>
        n.id === id
          ? {
              ...n,
              type: notificationForm.type,
              title: notificationForm.title,
              message: notificationForm.message,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );
    setEditingNotification(null);
    setNotificationForm({ type: "info", title: "", message: "", sendToAll: false });
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm(t("admin.deleteNotificationConfirm"))) return;
    // TODO: Replace with actual API call
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification.id);
    setNotificationForm({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      sendToAll: notification.userIds.length === 0,
    });
    setSelectedUsers(notification.userIds);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map((u) => u.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setUserForm({
      assignedLines: user.assignedLines || [],
      permissions: user.permissions || [],
    });
  };

  const handleSaveUser = async (userId: string) => {
    // TODO: Replace with actual API call
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              assignedLines: userForm.assignedLines,
              permissions: userForm.permissions,
            }
          : u
      )
    );
    setEditingUser(null);
    setUserForm({ assignedLines: [], permissions: [] });
  };

  const handleLineToggle = (lineId: string) => {
    setUserForm((prev) => ({
      ...prev,
      assignedLines: prev.assignedLines.includes(lineId)
        ? prev.assignedLines.filter((id) => id !== lineId)
        : [...prev.assignedLines, lineId],
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setUserForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleMessageClick = (chatId: string) => {
    navigate(`/${chatId}`);
  };

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  const totalDailyMessages = users.reduce((sum, u) => sum + (u.dailyMessages || 0), 0);
  const totalMonthlyMessages = users.reduce((sum, u) => sum + (u.monthlyMessages || 0), 0);
  const avgDailyResponseTime =
    users.length > 0
      ? users.reduce((sum, u) => sum + (u.dailyAvgResponseTime || 0), 0) / users.length
      : 0;
  const avgMonthlyResponseTime =
    users.length > 0
      ? users.reduce((sum, u) => sum + (u.monthlyAvgResponseTime || 0), 0) / users.length
      : 0;

  return (
    <ChatLayout>
      <Container>
        <Header>
          <HeaderTitle>{t("admin.title")}</HeaderTitle>
          <HeaderActions>
            <BackButton onClick={() => navigate("/")}>
              <Icon id="downArrow" className="icon" />
              {t("admin.backToList")}
            </BackButton>
          </HeaderActions>
        </Header>

        <TabsContainer>
          <TabList>
            <Tab active={activeTab === "stats"} onClick={() => setActiveTab("stats")}>
              {t("admin.tabStats")}
            </Tab>
            <Tab active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
              {t("admin.tabNotifications")}
            </Tab>
            <Tab active={activeTab === "users"} onClick={() => setActiveTab("users")}>
              {t("admin.tabUsers")}
            </Tab>
            <Tab active={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
              {t("admin.tabMessages")}
            </Tab>
            <Tab active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
              {t("admin.tabPending")}
            </Tab>
          </TabList>

          <TabContent>
            {activeTab === "stats" && (
              <StatsSection>
                <StatsTitle>
                  {t("admin.statistics")}
                  <PeriodSelector>
                    <PeriodButton active={period === "daily"} onClick={() => setPeriod("daily")}>
                      {t("admin.daily")}
                    </PeriodButton>
                    <PeriodButton active={period === "monthly"} onClick={() => setPeriod("monthly")}>
                      {t("admin.monthly")}
                    </PeriodButton>
                  </PeriodSelector>
                </StatsTitle>
                <StatsGrid>
                  <StatCard>
                    <StatLabel>{t("admin.todayCustomers")}</StatLabel>
                    <StatValue>{todayCustomers}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>{t("admin.totalMessages")}</StatLabel>
                    <StatValue>
                      {period === "daily" ? totalDailyMessages : totalMonthlyMessages}
                    </StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>{t("admin.avgResponseTime")}</StatLabel>
                    <StatValue>
                      {period === "daily"
                        ? avgDailyResponseTime.toFixed(1)
                        : avgMonthlyResponseTime.toFixed(1)}{" "}
                      {t("admin.minutes")}
                    </StatValue>
                  </StatCard>
                </StatsGrid>

                <StatsTitle style={{ marginTop: "30px" }}>
                  {t("admin.userStatistics")}
                </StatsTitle>
                <UserStatsTable>
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHeaderCell>{t("admin.userName")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.messages")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.avgResponseTime")}</TableHeaderCell>
                      </tr>
                    </TableHeader>
                    <tbody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>
                            {period === "daily" ? user.dailyMessages || 0 : user.monthlyMessages || 0}
                          </TableCell>
                          <TableCell>
                            {period === "daily"
                              ? (user.dailyAvgResponseTime || 0).toFixed(1)
                              : (user.monthlyAvgResponseTime || 0).toFixed(1)}{" "}
                            {t("admin.minutes")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </UserStatsTable>
              </StatsSection>
            )}

            {activeTab === "notifications" && (
              <NotificationSection>
                <NotificationTitle>{t("admin.notificationManagement")}</NotificationTitle>

                <NotificationForm>
                  <FormGroup>
                    <FormLabel>{t("admin.notificationType")}</FormLabel>
                    <FormSelect
                      value={notificationForm.type}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          type: e.target.value as any,
                        })
                      }
                    >
                      <option value="info">{t("admin.typeInfo")}</option>
                      <option value="success">{t("admin.typeSuccess")}</option>
                      <option value="error">{t("admin.typeError")}</option>
                      <option value="emergency">{t("admin.typeEmergency")}</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{t("admin.notificationTitle")}</FormLabel>
                    <FormInput
                      type="text"
                      value={notificationForm.title}
                      onChange={(e) =>
                        setNotificationForm({ ...notificationForm, title: e.target.value })
                      }
                      placeholder={t("admin.titlePlaceholder")}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>{t("admin.notificationMessage")}</FormLabel>
                    <FormTextarea
                      value={notificationForm.message}
                      onChange={(e) =>
                        setNotificationForm({ ...notificationForm, message: e.target.value })
                      }
                      placeholder={t("admin.messagePlaceholder")}
                      rows={4}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      <input
                        type="checkbox"
                        checked={notificationForm.sendToAll}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            sendToAll: e.target.checked,
                          })
                        }
                      />
                      {t("admin.sendToAllUsers")}
                    </FormLabel>
                  </FormGroup>

                  {!notificationForm.sendToAll && (
                    <FormGroup>
                      <FormLabel>
                        {t("admin.selectUsers")}
                        <ButtonGroup>
                          <Button
                            type="button"
                            onClick={handleSelectAll}
                            style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                          >
                            {t("admin.selectAll")}
                          </Button>
                          <Button
                            type="button"
                            onClick={handleDeselectAll}
                            style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                          >
                            {t("admin.deselectAll")}
                          </Button>
                        </ButtonGroup>
                      </FormLabel>
                      <UserSelector>
                        <UserList>
                          {users.map((user) => (
                            <UserItem key={user.id}>
                              <UserCheckbox
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserToggle(user.id)}
                              />
                              <span>{user.name}</span>
                              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                                {user.email}
                              </span>
                            </UserItem>
                          ))}
                        </UserList>
                      </UserSelector>
                    </FormGroup>
                  )}

                  <ButtonGroup>
                    {editingNotification ? (
                      <>
                        <Button onClick={() => handleUpdateNotification(editingNotification)}>
                          {t("admin.updateNotification")}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setEditingNotification(null);
                            setNotificationForm({
                              type: "info",
                              title: "",
                              message: "",
                              sendToAll: false,
                            });
                            setSelectedUsers([]);
                          }}
                          style={{ background: "transparent", border: "1px solid" }}
                        >
                          {t("admin.cancel")}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleSendNotification}>
                        {t("admin.sendNotification")}
                      </Button>
                    )}
                  </ButtonGroup>
                </NotificationForm>

                <NotificationTitle style={{ marginTop: "40px" }}>
                  {t("admin.sentNotifications")}
                </NotificationTitle>

                {notifications.length === 0 ? (
                  <EmptyState>{t("admin.noNotifications")}</EmptyState>
                ) : (
                  <NotificationList>
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} $type={notification.type}>
                        <NotificationItemHeader>
                          <div>
                            <strong>{notification.title}</strong>
                            <span style={{ fontSize: "0.85rem", opacity: 0.7, marginLeft: "10px" }}>
                              {notification.type}
                            </span>
                          </div>
                          <NotificationItemActions>
                            <EditButton onClick={() => handleEditNotification(notification)}>
                              <Icon id="attachDocument" className="icon" />
                            </EditButton>
                            <DeleteButton onClick={() => handleDeleteNotification(notification.id)}>
                              <Icon id="delete" className="icon" />
                            </DeleteButton>
                          </NotificationItemActions>
                        </NotificationItemHeader>
                        <NotificationItemContent>
                          <p>{notification.message}</p>
                          <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "8px" }}>
                            {notification.userIds.length === 0
                              ? t("admin.sentToAll")
                              : t("admin.sentToUsers", { count: notification.userIds.length })}
                            {" • "}
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </NotificationItemContent>
                      </NotificationItem>
                    ))}
                  </NotificationList>
                )}
              </NotificationSection>
            )}

            {activeTab === "users" && (
              <UserManagementSection>
                <NotificationTitle>{t("admin.userManagement")}</NotificationTitle>
                <UserTable>
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHeaderCell>{t("admin.userName")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.email")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.assignedLines")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.permissions")}</TableHeaderCell>
                        <TableHeaderCell>{t("admin.actions")}</TableHeaderCell>
                      </tr>
                    </TableHeader>
                    <tbody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {editingUser === user.id ? (
                              <LineSelector>
                                {lines.map((line) => (
                                  <label key={line.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <input
                                      type="checkbox"
                                      checked={userForm.assignedLines.includes(line.id)}
                                      onChange={() => handleLineToggle(line.id)}
                                    />
                                    <span>{line.label}</span>
                                  </label>
                                ))}
                              </LineSelector>
                            ) : (
                              user.assignedLines?.map((lineId) => {
                                const line = lines.find((l) => l.id === lineId);
                                return line ? line.label : lineId;
                              }).join(", ") || "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {editingUser === user.id ? (
                              <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                  <PermissionCheckbox
                                    type="checkbox"
                                    checked={userForm.permissions.includes("view_messages")}
                                    onChange={() => handlePermissionToggle("view_messages")}
                                  />
                                  <span>{t("admin.permissionViewMessages")}</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                  <PermissionCheckbox
                                    type="checkbox"
                                    checked={userForm.permissions.includes("edit_messages")}
                                    onChange={() => handlePermissionToggle("edit_messages")}
                                  />
                                  <span>{t("admin.permissionEditMessages")}</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <PermissionCheckbox
                                    type="checkbox"
                                    checked={userForm.permissions.includes("delete_messages")}
                                    onChange={() => handlePermissionToggle("delete_messages")}
                                  />
                                  <span>{t("admin.permissionDeleteMessages")}</span>
                                </label>
                              </div>
                            ) : (
                              user.permissions?.join(", ") || "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {editingUser === user.id ? (
                              <ButtonGroup>
                                <Button onClick={() => handleSaveUser(user.id)} style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                                  {t("admin.save")}
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setEditingUser(null);
                                    setUserForm({ assignedLines: [], permissions: [] });
                                  }}
                                  style={{ fontSize: "0.85rem", padding: "6px 12px", background: "transparent", border: "1px solid" }}
                                >
                                  {t("admin.cancel")}
                                </Button>
                              </ButtonGroup>
                            ) : (
                              <EditButton onClick={() => handleEditUser(user)}>
                                <Icon id="attachDocument" className="icon" />
                                {t("admin.edit")}
                              </EditButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </UserTable>
              </UserManagementSection>
            )}

            {activeTab === "messages" && (
              <MessageManagementSection>
                <NotificationTitle>{t("admin.messageManagement")}</NotificationTitle>
                {messages.length === 0 ? (
                  <EmptyState>{t("admin.noMessages")}</EmptyState>
                ) : (
                  <MessageList>
                    {messages.map((message) => (
                      <MessageItem key={message.id} onClick={() => handleMessageClick(message.chatId)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <strong>{message.chatName}</strong>
                          <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>{message.timestamp}</span>
                        </div>
                        <p style={{ margin: 0, color: "var(--sub-heading-color)" }}>{message.body}</p>
                        <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "8px" }}>
                          {t("admin.status")}: {message.messageStatus}
                        </div>
                      </MessageItem>
                    ))}
                  </MessageList>
                )}
              </MessageManagementSection>
            )}

            {activeTab === "pending" && (
              <PendingMessagesSection>
                <NotificationTitle>{t("admin.pendingMessages")}</NotificationTitle>
                {pendingMessages.length === 0 ? (
                  <EmptyState>{t("admin.noPendingMessages")}</EmptyState>
                ) : (
                  <div>
                    {pendingMessages.map((pending) => (
                      <PendingMessageItem
                        key={pending.id}
                        onClick={() => handleMessageClick(pending.chatId)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <strong>{pending.chatName}</strong>
                          <span style={{ fontSize: "0.85rem", color: "#f44336", fontWeight: "bold" }}>
                            {Math.floor(pending.waitingTime / 60)} {t("admin.hours")} {pending.waitingTime % 60}{" "}
                            {t("admin.minutes")}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: "var(--sub-heading-color)" }}>{pending.message}</p>
                        <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "8px" }}>
                          {new Date(pending.sentAt).toLocaleString()}
                        </div>
                      </PendingMessageItem>
                    ))}
                  </div>
                )}
              </PendingMessagesSection>
            )}
          </TabContent>
        </TabsContainer>
      </Container>
    </ChatLayout>
  );
}
