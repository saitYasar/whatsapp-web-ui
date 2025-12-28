import React, { Component, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppTheme } from "common/theme";
import { useAppConfig } from "common/context/app-config";
import ChatLayout from "pages/chat/layouts";
import Icon from "common/components/icons";
import {
  Container,
  ImageWrapper,
  Title,
  IconWrapper,
  Link,
  Image,
  Text,
  Button,
  ErrorCode,
  ContentWrapper,
  ErrorDetails,
  ReloadButton,
} from "./ErrorBoundary.styles";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReload }: { error: Error | null; onReload: () => void }) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { appName } = useAppConfig();
  const navigate = useNavigate();

  const getImageURL = () => {
    if (theme.mode === "light") return "/assets/images/entry-image-light.webp";
    return "/assets/images/entry-image-dark.png";
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const isChunkError = error?.message?.includes("chunk") || error?.name === "ChunkLoadError";

  return (
    <ChatLayout>
      <Container>
        <ImageWrapper>
          <Image src={getImageURL()} />
        </ImageWrapper>
        <ContentWrapper>
          <ErrorCode>⚠️</ErrorCode>
          <Title>{t("error.title", { appName })}</Title>
          <Text>
            {isChunkError
              ? t("error.chunkError")
              : t("error.description")}
          </Text>
          {error && process.env.NODE_ENV === "development" && (
            <ErrorDetails>
              <strong>{error.name}:</strong> {error.message}
            </ErrorDetails>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <ReloadButton onClick={onReload}>
              <Icon id="chat" className="icon" />
              {t("error.reload")}
            </ReloadButton>
            <Button onClick={handleGoHome}>
              <Icon id="chat" className="icon" />
              {t("error.goHome")}
            </Button>
          </div>
        </ContentWrapper>
        <Text>
          <span>{t("error.builtBy")}</span>{" "}
          <Link target="_blank" href="https://github.com/saitYasar">
            Sait Yaşar
          </Link>
          <IconWrapper>
            <Icon id="heart" />
          </IconWrapper>
        </Text>
      </Container>
    </ChatLayout>
  );
}

export default ErrorBoundaryClass;

