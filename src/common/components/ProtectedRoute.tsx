import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "common/context/auth";
import { MainPageLoader } from "./loader";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <MainPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


