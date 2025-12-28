import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatProvider from "pages/chat/context/chat";
import ProtectedRoute from "common/components/ProtectedRoute";
const ChatPage = React.lazy(() => import("pages/chat/chat-room-page"));
const UnSelectedChatPage = React.lazy(() => import("pages/chat/unselected-page"));
const LoginPage = React.lazy(() => import("pages/login"));
const NotFoundPage = React.lazy(() => import("pages/404"));
const BulkMessagePage = React.lazy(() => import("pages/bulk-message"));
const AdminPage = React.lazy(() => import("pages/admin"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/:id",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/bulk-message",
    element: (
      <ProtectedRoute>
        <BulkMessagePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UnSelectedChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}
