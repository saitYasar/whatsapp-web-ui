import React, { useEffect } from "react";
import AppRoutes from "routes";
import useAppLoad from "common/hooks/useAppLoad";
import { useAppConfig } from "common/context/app-config";
const SplashPage = React.lazy(() => import("pages/splash"));

export default function App() {
  const { isLoaded, progress } = useAppLoad();
  const { appName } = useAppConfig();

  useEffect(() => {
    document.title = appName;
  }, [appName]);

  if (!isLoaded) return <SplashPage progress={progress} />;
  return <AppRoutes />;
}
