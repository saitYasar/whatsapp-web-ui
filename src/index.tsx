import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "App";
import GlobalStyle from "global-styles";
import AppThemeProvider from "common/theme";
import { AppConfigProvider } from "common/context/app-config";
import { AuthProvider } from "common/context/auth";
import { MainPageLoader } from "common/components/loader";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AppConfigProvider>
    <AuthProvider>
      <AppThemeProvider>
        <GlobalStyle />
        <Suspense fallback={<MainPageLoader />}>
          <App />
        </Suspense>
      </AppThemeProvider>
    </AuthProvider>
  </AppConfigProvider>
);
