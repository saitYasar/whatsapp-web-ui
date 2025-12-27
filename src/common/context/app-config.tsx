import { createContext, useContext, ReactNode } from "react";
import { APP_CONFIG } from "config/app";

type AppConfigContextType = {
  appName: string;
  appShortName: string;
};

const AppConfigContext = createContext<AppConfigContextType>({
  appName: APP_CONFIG.name,
  appShortName: APP_CONFIG.shortName,
});

export function AppConfigProvider({ children }: { children: ReactNode }) {
  return (
    <AppConfigContext.Provider
      value={{
        appName: APP_CONFIG.name,
        appShortName: APP_CONFIG.shortName,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
}

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error("useAppConfig must be used within AppConfigProvider");
  }
  return context;
};


