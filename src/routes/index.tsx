import React from "react";
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { useAppTheme } from "common/theme";
import { useAppConfig } from "common/context/app-config";
import ChatLayout from "pages/chat/layouts";
import Icon from "common/components/icons";

import ChatProvider from "pages/chat/context/chat";
import ProtectedRoute from "common/components/ProtectedRoute";
const ChatPage = React.lazy(() => import("pages/chat/chat-room-page"));
const UnSelectedChatPage = React.lazy(() => import("pages/chat/unselected-page"));
const LoginPage = React.lazy(() => import("pages/login"));
const NotFoundPage = React.lazy(() => import("pages/404"));
const BulkMessagePage = React.lazy(() => import("pages/bulk-message"));
const AdminPage = React.lazy(() => import("pages/admin"));

function ErrorPage() {
  const error = useRouteError();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appTheme = useAppTheme();
  const theme = useTheme();
  const { appName } = useAppConfig();
  
  const isChunkError = error instanceof Error && (error.message?.includes("chunk") || error.name === "ChunkLoadError");
  
  const getImageURL = () => {
    if (appTheme.mode === "light") return "/assets/images/entry-image-light.webp";
    return "/assets/images/entry-image-dark.png";
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <ChatLayout>
      <div style={{
        background: theme.unselectedChat.bg,
        padding: "20px",
        height: "100%",
        flex: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderBottom: `6px solid ${theme.common.tertiaryColor}`,
      }}>
        <div style={{ width: "550px", marginBottom: "20px" }}>
          <img src={getImageURL()} alt="Error" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
          <div style={{ fontSize: "4rem", fontWeight: 300, color: theme.common.mainHeadingColor, marginBottom: "10px" }}>
            ⚠️
          </div>
          <h1 style={{ color: theme.common.mainHeadingColor, fontSize: "2rem", fontWeight: 400, marginBottom: "10px" }}>
            {t("error.title", { appName })}
          </h1>
          <p style={{ color: theme.common.subHeadingColor, fontSize: "0.9rem", fontWeight: 500, maxWidth: "500px", lineHeight: "24px" }}>
            {isChunkError ? t("error.chunkError") : t("error.description")}
          </p>
          {error instanceof Error && process.env.NODE_ENV === "development" && (
            <div style={{
              background: theme.common.primaryColor,
              border: `1px solid ${theme.common.borderColor}`,
              borderRadius: "4px",
              padding: "15px",
              marginTop: "20px",
              maxWidth: "600px",
              textAlign: "left",
              fontSize: "0.85rem",
              color: theme.common.subHeadingColor,
              fontFamily: "monospace",
            }}>
              <strong style={{ color: theme.chatRoom.profileActionColor || "#dc3545" }}>
                {error.name}:
              </strong> {error.message}
            </div>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handleReload}
              style={{
                padding: "12px 24px",
                background: theme.common.secondaryColor,
                color: theme.common.mainHeadingColor,
                border: `1px solid ${theme.common.borderColor}`,
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon id="chat" className="icon" style={{ width: "18px", height: "18px" }} />
              {t("error.reload")}
            </button>
            <button
              onClick={handleGoHome}
              style={{
                padding: "12px 24px",
                background: theme.common.tertiaryColor,
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon id="chat" className="icon" style={{ width: "18px", height: "18px" }} />
              {t("error.goHome")}
            </button>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/:id",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/bulk-message",
    element: (
      <ProtectedRoute>
        <BulkMessagePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UnSelectedChatPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
]);

export default function AppRoutes() {
  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}
