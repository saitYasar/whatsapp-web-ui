import { useTranslation } from "react-i18next";
import ChatLayout from "../layouts";
import Icon from "common/components/icons";
import { useAppTheme } from "common/theme";
import { useAppConfig } from "common/context/app-config";
import { Container, ImageWrapper, Title, IconWrapper, Link, Image, Text } from "./styles";

export default function UnSelectedChatPage() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { appName } = useAppConfig();

  const getImageURL = () => {
    if (theme.mode === "light") return "/assets/images/entry-image-light.webp";
    return "/assets/images/entry-image-dark.png";
  };

  return (
    <ChatLayout>
      <Container>
        <ImageWrapper>
          <Image src={getImageURL()} />
        </ImageWrapper>
        <Title>{t("unselectedChat.title", { appName })}</Title>
        <Text>{t("unselectedChat.description")}</Text>
        <Text>
          <span>{t("unselectedChat.builtBy")}</span>{" "}
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
