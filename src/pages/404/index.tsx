import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ChatLayout from "../chat/layouts";
import Icon from "common/components/icons";
import { useAppTheme } from "common/theme";
import { useAppConfig } from "common/context/app-config";
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
} from "./styles";

export default function NotFoundPage() {
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

  return (
    <ChatLayout>
      <Container>
        <ImageWrapper>
          <Image src={getImageURL()} />
        </ImageWrapper>
        <ContentWrapper>
          <ErrorCode>404</ErrorCode>
          <Title>{t("notFound.title", { appName })}</Title>
          <Text>{t("notFound.description")}</Text>
          <Button onClick={handleGoHome}>
            <Icon id="chat" className="icon" />
            {t("notFound.goHome")}
          </Button>
        </ContentWrapper>
        <Text>
          <span>{t("notFound.builtBy")}</span>{" "}
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

